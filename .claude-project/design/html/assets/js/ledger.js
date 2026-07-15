/* ============================================================================
 * Salmon Developers — customer ledger mock (bookings, installments, payments,
 * invoices). Ties to The ROSSA · Unit A-7. All money in integer BDT minor-free
 * units (whole taka). Amounts/schedule are FABRICATED placeholders (installment
 * count/intervals/penalties undefined by client — see OPEN_QUESTIONS.md).
 *
 * HONESTY: "verified paid" counts only payments the backend verified. A wire
 * sent but not yet finance-verified is `pending`, shown SEPARATELY — never as
 * paid. Channel category is Card/Wallet/Wire/MFS — never a card number/PAN.
 * ==========================================================================*/
(function (root) {
  'use strict';

  var REF = 'SLM-BKG-704218';
  var TOTAL = 19800000, TOKEN = 500000;
  var PER = 1608000; // per-installment (placeholder)

  // 12 monthly installments from 2025-09-20.
  var months = ['2025-09-20','2025-10-20','2025-11-20','2025-12-20','2026-01-20','2026-02-20',
                '2026-03-20','2026-04-20','2026-05-20','2026-06-20','2026-07-20','2026-08-20'];
  // status per §7 InstallmentStatus {upcoming, due, paid, overdue}
  var statuses = ['paid','paid','paid','paid','paid','paid','overdue','due','upcoming','upcoming','upcoming','upcoming'];
  var installments = months.map(function (d, i) {
    return { seq: i + 1, dueUtc: d + 'T14:00:00Z', amountBdt: PER, status: statuses[i] };
  });

  // Payment history (chronological). Channel category only — NEVER a PAN.
  var payments = [
    { dateUtc: '2025-09-05T09:12:00Z', amountBdt: TOKEN, currency: 'BDT', channelCat: 'Card',   ref: 'SLM-PAY-1001', status: 'success', label: 'Token booking' },
    { dateUtc: '2025-09-20T10:03:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'Card',   ref: 'SLM-PAY-1002', status: 'success', forSeq: 1 },
    { dateUtc: '2025-10-20T08:44:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'MFS',    ref: 'SLM-PAY-1003', status: 'success', forSeq: 2 },
    { dateUtc: '2025-11-20T11:20:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'Wallet', ref: 'SLM-PAY-1004', status: 'success', forSeq: 3 },
    { dateUtc: '2025-12-20T09:00:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'Card',   ref: 'SLM-PAY-1005', status: 'success', forSeq: 4 },
    { dateUtc: '2026-01-20T09:00:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'Card',   ref: 'SLM-PAY-1006', status: 'success', forSeq: 5 },
    { dateUtc: '2026-02-20T09:00:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'MFS',    ref: 'SLM-PAY-1007', status: 'success', forSeq: 6 },
    { dateUtc: '2026-04-18T16:30:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'Card',   ref: 'SLM-PAY-1008', status: 'failed',  forSeq: 7 },
    { dateUtc: '2026-07-13T18:10:00Z', amountBdt: PER,   currency: 'BDT', channelCat: 'Wire',   ref: 'SLM-PAY-1009', status: 'pending', forSeq: 8 }
  ];

  var invoices = [
    { id: 'RCPT-2026-0417', kind: 'receipt', title: 'Installment 6 receipt', dateUtc: '2026-02-20T09:00:00Z', sizeMB: '0.4 MB', forSeq: 6, amountBdt: PER },
    { id: 'RCPT-2026-0388', kind: 'receipt', title: 'Installment 5 receipt', dateUtc: '2026-01-20T09:00:00Z', sizeMB: '0.4 MB', forSeq: 5, amountBdt: PER },
    { id: 'RCPT-2025-0221', kind: 'receipt', title: 'Token booking receipt', dateUtc: '2025-09-05T09:12:00Z', sizeMB: '0.3 MB', amountBdt: TOKEN },
    { id: 'INV-2026-0511',  kind: 'invoice', title: 'Installment 7 invoice (overdue)', dateUtc: '2026-03-20T00:00:00Z', sizeMB: '0.3 MB', forSeq: 7, amountBdt: PER },
    { id: 'INV-2026-0540',  kind: 'invoice', title: 'Installment 8 invoice (due)', dateUtc: '2026-04-20T00:00:00Z', sizeMB: '0.3 MB', forSeq: 8, amountBdt: PER }
  ];

  var bookings = [
    { ref: REF, slug: 'the-rossa', unit: 'A-7', status: 'confirmed', totalBdt: TOTAL, tokenBdt: TOKEN, currency: 'BDT', bookedUtc: '2025-09-05T09:12:00Z' },
    { ref: 'SLM-BKG-902144', slug: 'salmon-oasis-park', unit: '12C', status: 'wire_pending', totalBdt: 20000000, tokenBdt: TOKEN, currency: 'BDT', bookedUtc: '2026-07-13T18:00:00Z' }
  ];

  // ---- derived sums (honest) ----
  function sum(arr) { return arr.reduce(function (a, b) { return a + b; }, 0); }
  function verifiedPaidBdt() {
    return TOKEN + sum(installments.filter(function (i) { return i.status === 'paid'; }).map(function (i) { return i.amountBdt; }));
  }
  function pendingBdt() { // sent but not verified (e.g. wire) — shown separately, NOT paid
    return sum(payments.filter(function (p) { return p.status === 'pending'; }).map(function (p) { return p.amountBdt; }));
  }
  function overdueBdt() { return sum(installments.filter(function (i) { return i.status === 'overdue'; }).map(function (i) { return i.amountBdt; })); }
  function outstandingBdt() { return TOTAL - verifiedPaidBdt(); }
  function nextDue() {
    var un = installments.filter(function (i) { return i.status === 'due' || i.status === 'overdue'; })
      .sort(function (a, b) { return a.dueUtc < b.dueUtc ? -1 : 1; });
    return un[0] || null;
  }

  root.LEDGER = {
    tz: 'Asia/Dubai', booking: bookings[0], bookings: bookings,
    installments: installments, payments: payments, invoices: invoices,
    TOTAL: TOTAL, TOKEN: TOKEN, PER: PER,
    verifiedPaidBdt: verifiedPaidBdt, pendingBdt: pendingBdt, overdueBdt: overdueBdt,
    outstandingBdt: outstandingBdt, nextDue: nextDue,
    strings: {
      en: { myBookings:'My bookings', bookingDetail:'Booking detail', tracker:'Installment tracker', schedule:'Payment schedule',
        payHistory:'Payment history', invoices:'Invoices & receipts', total:'Total property price', verifiedPaid:'Verified paid',
        pendingVerify:'Pending verification', outstanding:'Outstanding', nextDue:'Next due', overdue:'Overdue',
        payInstallment:'Pay installment', download:'Download', share:'Share', channel:'Channel', reference:'Reference',
        confirmed:'Confirmed', wirePending:'Wire pending', receipt:'Receipt', invoice:'Invoice' },
      bn: { myBookings:'আমার বুকিং', bookingDetail:'বুকিং বিবরণ', tracker:'কিস্তি ট্র্যাকার', schedule:'পরিশোধ সময়সূচি',
        payHistory:'পেমেন্ট ইতিহাস', invoices:'ইনভয়েস ও রসিদ', total:'মোট সম্পত্তি মূল্য', verifiedPaid:'যাচাইকৃত পরিশোধ',
        pendingVerify:'যাচাইয়ের অপেক্ষায়', outstanding:'বকেয়া', nextDue:'পরবর্তী কিস্তি', overdue:'মেয়াদোত্তীর্ণ',
        payInstallment:'কিস্তি পরিশোধ', download:'ডাউনলোড', share:'শেয়ার', channel:'চ্যানেল', reference:'রেফারেন্স',
        confirmed:'নিশ্চিত', wirePending:'ওয়্যার অপেক্ষমাণ', receipt:'রসিদ', invoice:'ইনভয়েস' }
    }
  };
})(window);
