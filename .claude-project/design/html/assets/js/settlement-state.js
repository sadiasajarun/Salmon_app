/* ============================================================================
 * Salmon Developers — settlement REQUEST state machine (partner Act 8)
 * ----------------------------------------------------------------------------
 * The partner app RECORDS a request; it never moves money. This reducer tracks
 * one settlement request through the states finance drives on the web panel:
 *   NONE -> SUBMITTED -> APPROVED -> SETTLED   (or -> REJECTED / ON_HOLD)
 *
 * Guards encoded here (mirror the client payment discipline):
 *  - No duplicate: SUBMIT is a no-op while a request is in flight.
 *  - Never optimistic: SUBMITTED only after a real submit; offline is blocked by
 *    the screen BEFORE dispatch (never queued).
 *  - The partner sees status only — no finance reference/evidence is stored here.
 * A go_router/Riverpod guard can mirror this directly.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var KEY = 'salmon_settlement';
  var S = { NONE: 'NONE', SUBMITTED: 'SUBMITTED', APPROVED: 'APPROVED', SETTLED: 'SETTLED', REJECTED: 'REJECTED', ON_HOLD: 'ON_HOLD' };

  function initial() { return { status: S.NONE, amountBdt: null, ref: null, submittedAt: null, updatedAt: null }; }
  function inFlight(st) { return st === S.SUBMITTED || st === S.APPROVED || st === S.ON_HOLD; }
  function terminal(st) { return st === S.SETTLED || st === S.REJECTED; }
  function genRef() { return 'ST-2026-' + (Math.floor(Math.random() * 900) + 100); }
  function now() { return Date.now(); }

  function reduce(state, action) {
    var s = Object.assign({}, state); s.updatedAt = now();
    switch (action.type) {
      case 'SUBMIT':
        if (inFlight(state.status)) return state;      // duplicate guard
        s.status = S.SUBMITTED; s.amountBdt = action.amountBdt; s.ref = genRef(); s.submittedAt = now(); return s;
      case 'APPROVE':  if (state.status !== S.SUBMITTED && state.status !== S.ON_HOLD) return state; s.status = S.APPROVED; return s;
      case 'SETTLE':   if (state.status !== S.APPROVED) return state; s.status = S.SETTLED; return s;
      case 'REJECT':   if (!inFlight(state.status)) return state; s.status = S.REJECTED; return s;
      case 'HOLD':     if (state.status !== S.SUBMITTED && state.status !== S.APPROVED) return state; s.status = S.ON_HOLD; return s;
      case 'RESET':    return initial();
      default: return state;
    }
  }

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || initial(); } catch (e) { return initial(); } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function dispatch(action) { var s = reduce(load(), action); save(s); return s; }
  function reset() { save(initial()); }

  root.Settlement = { S: S, initial: initial, reduce: reduce, inFlight: inFlight, terminal: terminal, load: load, save: save, dispatch: dispatch, reset: reset };
})(window);
