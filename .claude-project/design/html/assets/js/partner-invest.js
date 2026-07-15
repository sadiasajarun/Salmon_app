/* ============================================================================
 * Salmon Developers — With Investment mock data (Partner Act 9, P51–P56)
 * ----------------------------------------------------------------------------
 * ⚠️  THE MOST LEGALLY SENSITIVE MODULE IN THE APP. Read before editing.
 *
 * PRINCIPLE: the app is a PASSIVE RECORD-KEEPER for decisions Salmon's staff
 * made offline, after legal sign-off. It computes nothing, promises nothing,
 * pays nothing.
 *
 * HARD PROHIBITIONS (do not add, in EN or BN):
 *   - No return calculator / projected-earnings preview / slider.
 *   - No payout button. The app never disburses.
 *   - No guaranteed-return language: no "guaranteed", "profit", "yield",
 *     "earnings", "payout", used as a promise.
 *   - No commission maths (higher-tier commission is hand-entered on the web
 *     panel, exactly like every other commission).
 *   - No presenting Salmon as a guarantor or investment adviser.
 *
 * Everything below is a DISPLAY of records a staff member typed in. Amounts are
 * facts on the record, never a forecast. A "pending" entry is a record of
 * intent, NOT a guarantee — copy must never let it read as one.
 *
 * The disclaimer copy (P56) is a LEGAL DELIVERABLE from Salmon's counsel. It is
 * intentionally left as a marked placeholder — do NOT fabricate legalese.
 * ==========================================================================*/
(function (root) {
  'use strict';

  // --- The confirmed investment record (Nasrin's share) ---------------------
  // Recorded by staff AFTER offline documentation + payment verification.
  // She did NOT pay through the app. The app only displays this.
  var record = {
    ref: 'INV-2026-0142',
    project: 'Salmon Oasis Park',
    projectBn: 'স্যামন ওয়েসিস পার্ক',
    shareRef: 'SHARE-OP-07',
    amountBdt: 2500000,            // amount recorded by staff (a fact, not a projection)
    recordedUtc: '2026-06-30T09:00:00Z',
    recordedBy: 'Salmon staff (web panel)',
    recordedByBn: 'স্যামন স্টাফ (ওয়েব প্যানেল)',
    status: 'recorded',           // record state only — no "active/earning" language
    __PLACEHOLDER: true           // structure & values pending legal sign-off
  };

  // --- Return schedule: STATUS-ONLY record table ----------------------------
  // Manually recorded entries. The app does NOT calculate, project, or promise
  // any of these. Status is the point; the amount is the recorded figure.
  var RETURN_STATUS = {
    paid:   { en: 'Paid',    bn: 'পরিশোধিত',  cls: 'rs-paid'   },
    pending:{ en: 'Pending', bn: 'অপেক্ষমাণ',  cls: 'rs-pending'},
    onHold: { en: 'On hold', bn: 'স্থগিত',     cls: 'rs-hold'   }
  };

  // Each entry = one row a human typed. `recordedUtc` = when the entry was
  // written down (NOT a "due date" countdown, which would imply certainty).
  var returnSchedule = [
    { id: 'RE-01', periodLabelEn: 'Entry 1', periodLabelBn: 'এন্ট্রি ১', amountBdt: 31250, status: 'paid',    recordedUtc: '2026-04-05T09:00:00Z', recordedBy: 'Salmon staff', note: '' },
    { id: 'RE-02', periodLabelEn: 'Entry 2', periodLabelBn: 'এন্ট্রি ২', amountBdt: 31250, status: 'paid',    recordedUtc: '2026-05-05T09:00:00Z', recordedBy: 'Salmon staff', note: '' },
    { id: 'RE-03', periodLabelEn: 'Entry 3', periodLabelBn: 'এন্ট্রি ৩', amountBdt: 31250, status: 'paid',    recordedUtc: '2026-06-05T09:00:00Z', recordedBy: 'Salmon staff', note: '' },
    { id: 'RE-04', periodLabelEn: 'Entry 4', periodLabelBn: 'এন্ট্রি ৪', amountBdt: 31250, status: 'pending', recordedUtc: '2026-07-01T09:00:00Z', recordedBy: 'Salmon staff', note: 'Recorded as intended — not confirmed.' },
    { id: 'RE-05', periodLabelEn: 'Entry 5', periodLabelBn: 'এন্ট্রি ৫', amountBdt: 31250, status: 'onHold', recordedUtc: '2026-07-01T09:00:00Z', recordedBy: 'Salmon staff', note: 'Held pending Salmon review.' }
  ];

  function entry(id) { return returnSchedule.filter(function (e) { return e.id === id; })[0] || null; }

  // --- Disclaimer (P56) — LEGAL DELIVERABLE, not written here ----------------
  var DISCLAIMER_PLACEHOLDER =
    '[LEGAL COPY REQUIRED — supplied by Salmon’s legal counsel]';

  root.PartnerInvest = {
    record: record,
    RETURN_STATUS: RETURN_STATUS,
    returnSchedule: returnSchedule,
    entry: entry,
    DISCLAIMER_PLACEHOLDER: DISCLAIMER_PLACEHOLDER,
    // Preferred-contact-time options for the enquiry (a request to be contacted).
    contactTimes: [
      { key: 'morning',   en: 'Morning (9am–12pm)',   bn: 'সকাল (৯টা–১২টা)' },
      { key: 'afternoon', en: 'Afternoon (12pm–4pm)', bn: 'দুপুর (১২টা–৪টা)' },
      { key: 'evening',   en: 'Evening (4pm–7pm)',     bn: 'বিকেল (৪টা–৭টা)' }
    ],
    strings: {
      en: {
        module: 'With Investment',
        // A neutral, record-oriented banner shown on P53/P54/P55.
        recordNote: 'This is a record of a decision Salmon made offline. The app does not process payments, calculate anything, or promise a return.',
        enquiryTitle: 'Investment enquiry',
        enquiryLead: 'This is a request to be contacted — not a purchase, not a commitment, not a transaction. Salmon’s staff will follow up offline.',
        interestAmount: 'Interest amount (indicative)',
        interestHelp: 'For discussion only. Nothing is charged and nothing is committed by entering this.',
        preferredTime: 'Preferred contact time',
        notes: 'Notes (optional)',
        projectRef: 'Project / share reference',
        submitEnquiry: 'Submit enquiry',
        enquiryPendingTitle: 'Enquiry received',
        enquiryPendingSub: 'Salmon’s staff will contact you offline. Nothing has been purchased or committed.',
        recordTitle: 'Investment record',
        recordSub: 'Recorded by staff after offline documentation and payment verification. The app displays this record — it did not process the payment.',
        holds: 'What is recorded',
        recordedOn: 'Recorded on', recordedBy: 'Recorded by', reference: 'Reference',
        amountRecorded: 'Amount recorded', project: 'Project', share: 'Share',
        scheduleTitle: 'Return schedule',
        scheduleSub: 'A record of return entries typed in by staff. Status only — the app does not calculate, project, or promise any entry.',
        entryTitle: 'Return entry',
        entryFactLine: 'A fact on the record — recorded by staff. Not a promise about the future.',
        pendingMeans: 'Pending means an entry was recorded as intended. It is not a guarantee.',
        onHoldMeans: 'On hold means Salmon is reviewing this entry. It is not a promise it will be released.',
        readDisclaimer: 'Read the full disclaimer',
        disclaimerTitle: 'Disclaimer',
        disclaimerMustRead: 'Please read before relying on anything in this module.',
        disclaimerWhat: 'What this program is — and is not',
        notGuarantor: 'Salmon is not acting as a guarantor or investment adviser through this app.',
        governedBy: 'Any return is governed by the agreed commercial and legal terms — not by anything shown or calculated in the app.',
        legalBlockLabel: 'Approved disclaimer text',
        legalBlockNote: 'This exact wording must come from Salmon’s legal counsel. It has not been supplied yet.',
        blockerTitle: 'This module cannot ship yet',
        blockerBody: 'With Investment is blocked on legal deliverables: the commercial rules, the return-schedule structure, the higher-tier commission terms, and this disclaimer copy. See OPEN_QUESTIONS.md.',
        acknowledge: 'I have read this'
      },
      bn: {
        module: 'বিনিয়োগসহ',
        recordNote: 'এটি স্যামনের অফলাইনে নেওয়া একটি সিদ্ধান্তের রেকর্ড। অ্যাপ কোনো পেমেন্ট প্রক্রিয়া করে না, কিছু হিসাব করে না, কোনো রিটার্নের প্রতিশ্রুতি দেয় না।',
        enquiryTitle: 'বিনিয়োগ অনুসন্ধান',
        enquiryLead: 'এটি যোগাযোগের একটি অনুরোধ মাত্র — কোনো ক্রয় নয়, প্রতিশ্রুতি নয়, লেনদেন নয়। স্যামনের স্টাফ অফলাইনে যোগাযোগ করবে।',
        interestAmount: 'আগ্রহের পরিমাণ (আনুমানিক)',
        interestHelp: 'শুধু আলোচনার জন্য। এটি লিখলে কোনো চার্জ বা প্রতিশ্রুতি হয় না।',
        preferredTime: 'যোগাযোগের পছন্দের সময়',
        notes: 'নোট (ঐচ্ছিক)',
        projectRef: 'প্রকল্প / শেয়ার রেফারেন্স',
        submitEnquiry: 'অনুসন্ধান জমা দিন',
        enquiryPendingTitle: 'অনুসন্ধান গৃহীত হয়েছে',
        enquiryPendingSub: 'স্যামনের স্টাফ অফলাইনে যোগাযোগ করবে। কিছু কেনা বা প্রতিশ্রুত হয়নি।',
        recordTitle: 'বিনিয়োগ রেকর্ড',
        recordSub: 'অফলাইন ডকুমেন্টেশন ও পেমেন্ট যাচাইয়ের পর স্টাফ কর্তৃক রেকর্ডকৃত। অ্যাপ শুধু এই রেকর্ড দেখায় — পেমেন্ট প্রক্রিয়া করেনি।',
        holds: 'যা রেকর্ড করা আছে',
        recordedOn: 'রেকর্ডের তারিখ', recordedBy: 'রেকর্ড করেছেন', reference: 'রেফারেন্স',
        amountRecorded: 'রেকর্ডকৃত পরিমাণ', project: 'প্রকল্প', share: 'শেয়ার',
        scheduleTitle: 'রিটার্ন সূচি',
        scheduleSub: 'স্টাফ কর্তৃক লেখা রিটার্ন এন্ট্রির রেকর্ড। শুধুমাত্র অবস্থা — অ্যাপ কোনো এন্ট্রি হিসাব, অনুমান বা প্রতিশ্রুতি করে না।',
        entryTitle: 'রিটার্ন এন্ট্রি',
        entryFactLine: 'রেকর্ডের একটি তথ্য — স্টাফ কর্তৃক লেখা। ভবিষ্যতের কোনো প্রতিশ্রুতি নয়।',
        pendingMeans: '“অপেক্ষমাণ” মানে এন্ট্রিটি উদ্দিষ্ট হিসেবে রেকর্ড হয়েছে। এটি কোনো নিশ্চয়তা নয়।',
        onHoldMeans: '“স্থগিত” মানে স্যামন এই এন্ট্রি পর্যালোচনা করছে। এটি ছাড়ের কোনো প্রতিশ্রুতি নয়।',
        readDisclaimer: 'সম্পূর্ণ দাবিত্যাগ পড়ুন',
        disclaimerTitle: 'দাবিত্যাগ',
        disclaimerMustRead: 'এই মডিউলের কিছুর উপর নির্ভর করার আগে অনুগ্রহ করে পড়ুন।',
        disclaimerWhat: 'এই প্রোগ্রাম যা — এবং যা নয়',
        notGuarantor: 'স্যামন এই অ্যাপের মাধ্যমে কোনো গ্যারান্টার বা বিনিয়োগ উপদেষ্টা হিসেবে কাজ করছে না।',
        governedBy: 'যেকোনো রিটার্ন সম্মত বাণিজ্যিক ও আইনি শর্ত দ্বারা নিয়ন্ত্রিত — অ্যাপে দেখানো বা হিসাবকৃত কিছু দ্বারা নয়।',
        legalBlockLabel: 'অনুমোদিত দাবিত্যাগের পাঠ্য',
        legalBlockNote: 'এই সঠিক শব্দগুলো স্যামনের আইন উপদেষ্টা থেকে আসতে হবে। এখনো সরবরাহ করা হয়নি।',
        blockerTitle: 'এই মডিউল এখনো চালু করা যাবে না',
        blockerBody: 'বিনিয়োগসহ প্রোগ্রামটি আইনি ডেলিভারেবলের উপর আটকে আছে: বাণিজ্যিক নিয়ম, রিটার্ন-সূচির কাঠামো, উচ্চ-স্তরের কমিশন শর্ত এবং এই দাবিত্যাগ। দেখুন OPEN_QUESTIONS.md।',
        acknowledge: 'আমি পড়েছি'
      }
    }
  };
})(window);
