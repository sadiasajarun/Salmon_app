/* ============================================================================
 * Salmon Developers — Act 4 payment/booking state machine (the reducer)
 * ----------------------------------------------------------------------------
 * HONESTY RULES encoded here (CLAUDE.md §2 + Act 4 brief):
 *  - The gateway saying "done" is a RUMOUR. Only WEBHOOK_VERIFIED -> SUCCESS.
 *  - The client never invents SUCCESS. `paid` is true only in SUCCESS.
 *  - One booking, one payment: a persisted `idem` (idempotency) key + an
 *    `inFlight` guard prevent duplicates on double-tap / back / app-restart.
 *  - We never resolve uncertainty into optimism: RESULT_UNKNOWN -> UNKNOWN.
 *  - Lock expiring while PAYMENT_PENDING is its own truthful state.
 *
 * CONFIG values (token amount, lock duration, transaction currency) are
 * UNDEFINED by the client -> placeholders, logged in OPEN_QUESTIONS.md.
 * ==========================================================================*/
(function (root) {
  'use strict';

  var KEY = 'salmon_txn';

  var CONFIG = {
    tokenBookingBdt: 500000,      // __PLACEHOLDER — fixed/per-project/percentage undefined
    lockMinutes: 30,              // __PLACEHOLDER — inventory lock duration undefined
    transactionCurrency: 'BDT',   // __PLACEHOLDER — may vary by gateway
    __PLACEHOLDER: true
  };

  // Canonical states (booking + payment combined FSM).
  var S = {
    NONE: 'NONE',
    BOOKING_PENDING: 'BOOKING_PENDING',     // unit locked, countdown running
    PAYMENT_INITIATED: 'PAYMENT_INITIATED', // channel chosen
    PAYMENT_PENDING: 'PAYMENT_PENDING',     // ⭐ gateway "done", backend NOT confirmed
    WIRE_PENDING: 'WIRE_PENDING',           // wire submitted, finance verifies manually
    SUCCESS: 'SUCCESS',                     // webhook verified -> booking confirmed
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',                     // lock ran out, no successful payment
    EXPIRED_WHILE_PAYING: 'EXPIRED_WHILE_PAYING', // lock lapsed while PAYMENT_PENDING
    UNKNOWN: 'UNKNOWN'                       // genuinely don't know
  };

  var CHANNELS = [
    { key: 'stripe', en: 'Card / wallet (Stripe)', bn: 'কার্ড / ওয়ালেট (Stripe)', costEn: 'Card fees may apply', confirmEn: 'Confirms in seconds', confirmBn: 'কয়েক সেকেন্ডে নিশ্চিত', hosted: true },
    { key: 'paypal', en: 'PayPal', bn: 'PayPal', costEn: 'PayPal fees may apply', confirmEn: 'Confirms in seconds', confirmBn: 'কয়েক সেকেন্ডে নিশ্চিত', hosted: true },
    { key: 'sslcommerz', en: 'SSLCommerz', bn: 'SSLCommerz', costEn: 'Local gateway fees may apply', confirmEn: 'Confirms in minutes', confirmBn: 'কয়েক মিনিটে নিশ্চিত', hosted: true },
    { key: 'mfs', en: 'Local MFS (bKash/Nagad)', bn: 'লোকাল MFS (বিকাশ/নগদ)', costEn: 'MFS charges may apply', confirmEn: 'Confirms in minutes', confirmBn: 'কয়েক মিনিটে নিশ্চিত', hosted: true },
    { key: 'wire', en: 'International wire', bn: 'আন্তর্জাতিক ওয়্যার', costEn: 'Your bank’s wire fee applies', confirmEn: 'Verified by finance — can take DAYS', confirmBn: 'ফিন্যান্স যাচাই করে — কয়েক দিন লাগতে পারে', hosted: false, slow: true }
  ];

  function genRef() {
    // Prototype ref. (Math.random is fine in the browser.)
    var n = Math.floor(Math.random() * 900000) + 100000;
    return 'SLM-BKG-' + n;
  }
  function nowMs() { return Date.now(); }

  function initial() {
    return {
      status: S.NONE, kind: 'booking', slug: null, unit: null, seq: null,
      amountBdt: null, transactionCurrency: CONFIG.transactionCurrency,
      channel: null, bookingRef: null, idem: null,
      lockExpiresAt: null, createdAt: null, updatedAt: null
    };
  }

  function inFlight(status) {
    return status === S.BOOKING_PENDING || status === S.PAYMENT_INITIATED ||
           status === S.PAYMENT_PENDING || status === S.WIRE_PENDING;
  }
  function terminal(status) {
    return status === S.SUCCESS || status === S.FAILED || status === S.CANCELLED ||
           status === S.EXPIRED || status === S.EXPIRED_WHILE_PAYING;
  }

  // Pure reducer. Returns a NEW state; never mutates.
  function reduce(state, action) {
    var s = Object.assign({}, state); s.updatedAt = nowMs();
    switch (action.type) {
      case 'BOOK': // create pending booking + lock (idempotent: reuse if already in flight for same unit)
        if (inFlight(state.status) && state.slug === action.slug && state.unit === action.unit) return state;
        s.status = S.BOOKING_PENDING; s.slug = action.slug; s.unit = action.unit;
        s.amountBdt = CONFIG.tokenBookingBdt; s.transactionCurrency = CONFIG.transactionCurrency;
        s.bookingRef = genRef(); s.idem = s.bookingRef + '-' + nowMs();
        s.createdAt = nowMs(); s.lockExpiresAt = nowMs() + CONFIG.lockMinutes * 60000; s.channel = null;
        return s;
      case 'START_INSTALLMENT': // reuse the SAME pay path (channel -> handoff -> pending) for an installment
        if (inFlight(state.status)) return state; // one payment at a time (duplicate guard)
        s.status = S.PAYMENT_INITIATED; s.kind = 'installment'; s.slug = action.slug; s.unit = action.unit;
        s.seq = action.seq; s.amountBdt = action.amountBdt; s.transactionCurrency = CONFIG.transactionCurrency;
        s.bookingRef = action.ref || genRef(); s.idem = s.bookingRef + '-inst' + action.seq + '-' + nowMs();
        s.channel = null; s.lockExpiresAt = null; s.createdAt = nowMs(); return s;
      case 'SELECT_CHANNEL':
        if (state.status !== S.BOOKING_PENDING && state.status !== S.PAYMENT_INITIATED) return state;
        s.status = S.PAYMENT_INITIATED; s.channel = action.channel; return s;
      case 'GO_PENDING': // left for hosted checkout and returned (or wire submitted)
        if (action.channel === 'wire') { s.status = S.WIRE_PENDING; s.channel = 'wire'; return s; }
        s.status = S.PAYMENT_PENDING; return s;
      case 'WEBHOOK_VERIFIED': // the ONLY path to success
        if (state.status !== S.PAYMENT_PENDING && state.status !== S.WIRE_PENDING) return state;
        s.status = S.SUCCESS; return s;
      case 'WEBHOOK_DECLINED':
        if (state.status !== S.PAYMENT_PENDING) return state;
        s.status = S.FAILED; return s;
      case 'CANCEL_AT_GATEWAY':
        if (state.status !== S.PAYMENT_INITIATED && state.status !== S.PAYMENT_PENDING) return state;
        s.status = S.CANCELLED; return s;
      case 'LOCK_EXPIRED':
        if (state.status === S.PAYMENT_PENDING || state.status === S.WIRE_PENDING) { s.status = S.EXPIRED_WHILE_PAYING; return s; }
        if (state.status === S.BOOKING_PENDING || state.status === S.PAYMENT_INITIATED) { s.status = S.EXPIRED; return s; }
        return state;
      case 'RESULT_UNKNOWN':
        s.status = S.UNKNOWN; return s;
      case 'RESET':
        return initial();
      default:
        return state;
    }
  }

  // Persisted store (localStorage) — survives reload / app-restart for the duplicate guard.
  function load() { try { var v = JSON.parse(localStorage.getItem(KEY)); return v || initial(); } catch (e) { return initial(); } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function dispatch(action) { var s = reduce(load(), action); save(s); return s; }
  function reset() { save(initial()); }

  // Auto-expire helper: if lock elapsed while in flight, apply LOCK_EXPIRED.
  function tickExpiry() {
    var s = load();
    if (inFlight(s.status) && s.lockExpiresAt && nowMs() >= s.lockExpiresAt) { s = reduce(s, { type: 'LOCK_EXPIRED' }); save(s); }
    return s;
  }
  function msLeft() { var s = load(); return s.lockExpiresAt ? Math.max(0, s.lockExpiresAt - nowMs()) : 0; }

  root.PayState = {
    S: S, CONFIG: CONFIG, CHANNELS: CHANNELS,
    initial: initial, reduce: reduce, inFlight: inFlight, terminal: terminal,
    load: load, save: save, dispatch: dispatch, reset: reset, tickExpiry: tickExpiry, msLeft: msLeft, genRef: genRef
  };
})(window);
