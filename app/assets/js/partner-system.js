/* ============================================================================
 * Salmon Developers — Notices + Notifications mock data (Partner Act 12)
 * ----------------------------------------------------------------------------
 * NOTICE BOARD (P72): admin-published notices TARGETED by team / territory /
 * rank / program. Shahin sees only what's aimed at him. The app renders what
 * the backend returns — it does NOT assume every notice is for everyone. The
 * exact targeting attributes + precedence are undefined -> OPEN_QUESTIONS.
 *
 * NOTIFICATION CENTRE (P73): grouped, TIMEZONE-CORRECT, and carries NO FINANCIAL
 * DETAIL in the payload — same rule as the client app. A locked phone on the
 * shop counter must never surface a commission amount. So a commission event
 * says "a commission was approved", never "৳184,000 approved".
 * ==========================================================================*/
(function (root) {
  'use strict';

  // Each notice lists why it reached THIS partner (targeting reason shown).
  var notices = [
    { id: 'NT-88', titleEn: 'Eid office hours', titleBn: 'ঈদের অফিস সময়', bodyEn: 'The Cumilla office will run 10am–4pm during Eid week.', bodyBn: 'ঈদের সপ্তাহে কুমিল্লা অফিস সকাল ১০টা–বিকেল ৪টা চলবে।', targetEn: 'Territory · Cumilla', targetBn: 'এলাকা · কুমিল্লা', publishedUtc: '2026-07-14T06:00:00Z', pin: true },
    { id: 'NT-85', titleEn: 'New units released · The ROSSA', titleBn: 'নতুন ইউনিট · দ্য রোসা', bodyEn: 'Fresh inventory is live for The ROSSA. Check the sales catalogue.', bodyBn: 'দ্য রোসায় নতুন ইনভেন্টরি এসেছে। সেলস ক্যাটালগ দেখুন।', targetEn: 'Program · Zero Investment', targetBn: 'প্রোগ্রাম · জিরো ইনভেস্টমেন্ট', publishedUtc: '2026-07-12T06:00:00Z' },
    { id: 'NT-80', titleEn: 'Silver partner guideline update', titleBn: 'সিলভার পার্টনার নির্দেশিকা আপডেট', bodyEn: 'The consent guideline was updated. See the training library.', bodyBn: 'সম্মতি নির্দেশিকা আপডেট হয়েছে। প্রশিক্ষণ লাইব্রেরি দেখুন।', targetEn: 'Rank · Silver', targetBn: 'র‍্যাঙ্ক · সিলভার', publishedUtc: '2026-07-08T06:00:00Z' }
  ];
  function notice(id) { return notices.filter(function (n) { return n.id === id; })[0] || null; }

  // Notifications — grouped by kind. NO amounts, NO balances. Timezone-correct.
  var GROUPS = ['approval', 'lead', 'task', 'commission', 'settlement', 'meeting', 'notice'];
  var GROUP_LABEL = {
    approval:   { en: 'Approvals',   bn: 'অনুমোদন' },
    lead:       { en: 'Leads',       bn: 'লিড' },
    task:       { en: 'Tasks',       bn: 'কাজ' },
    commission: { en: 'Commission',  bn: 'কমিশন' },
    settlement: { en: 'Settlement',  bn: 'সেটেলমেন্ট' },
    meeting:    { en: 'Meetings',    bn: 'মিটিং' },
    notice:     { en: 'Notices',     bn: 'নোটিশ' }
  };
  var notifications = [
    { id: 'n1', group: 'lead',       en: 'Lead “Rahim Uddin” was contacted', bn: 'লিড “রহিম উদ্দিন”-এর সাথে যোগাযোগ হয়েছে', t: '2026-07-14T09:00:00Z', link: 'lead-detail.page.html?id=LD-3038' },
    { id: 'n2', group: 'commission', en: 'A commission was approved',        bn: 'একটি কমিশন অনুমোদিত হয়েছে', t: '2026-07-13T10:00:00Z', link: 'commission.page.html' }, // NO amount
    { id: 'n3', group: 'task',       en: 'A task is overdue',                bn: 'একটি কাজের সময় পার হয়েছে', t: '2026-07-13T04:00:00Z', link: 'tasks.page.html' },
    { id: 'n4', group: 'settlement', en: 'Your settlement request updated',  bn: 'আপনার সেটেলমেন্ট অনুরোধ আপডেট হয়েছে', t: '2026-07-12T07:30:00Z', link: 'settlement-status.page.html' }, // NO amount
    { id: 'n5', group: 'meeting',    en: 'Meeting confirmed for tomorrow',   bn: 'আগামীকালের মিটিং নিশ্চিত হয়েছে', t: '2026-07-12T05:00:00Z', link: 'meeting-confirmed.page.html' },
    { id: 'n6', group: 'approval',   en: 'A document was verified',          bn: 'একটি নথি যাচাই হয়েছে', t: '2026-07-11T06:00:00Z', link: 'record-status.page.html' },
    { id: 'n7', group: 'notice',     en: 'New notice: Eid office hours',     bn: 'নতুন নোটিশ: ঈদের অফিস সময়', t: '2026-07-14T06:00:00Z', link: 'notice-board.page.html' }
  ];

  root.PartnerSystem = {
    notices: notices, notice: notice,
    GROUPS: GROUPS, GROUP_LABEL: GROUP_LABEL, notifications: notifications,
    strings: {
      en: { noticeBoard: 'Notice board', noticeSub: 'Published by Salmon — you see what’s aimed at your team, territory, rank, or program.',
        targetedTo: 'Sent to', pinned: 'Pinned', notifications: 'Notifications',
        noFinance: 'Amounts are never shown here — open the item to see detail.', all: 'All', markRead: 'Mark all read', empty: 'Nothing yet' },
      bn: { noticeBoard: 'নোটিশ বোর্ড', noticeSub: 'স্যামন প্রকাশিত — আপনার টিম, এলাকা, র‍্যাঙ্ক বা প্রোগ্রামের জন্য যা লক্ষ্য করা, তাই দেখেন।',
        targetedTo: 'প্রাপক', pinned: 'পিন করা', notifications: 'বিজ্ঞপ্তি',
        noFinance: 'এখানে কখনো পরিমাণ দেখানো হয় না — বিস্তারিত দেখতে আইটেম খুলুন।', all: 'সব', markRead: 'সব পঠিত চিহ্নিত', empty: 'এখনো কিছু নেই' }
    }
  };
})(window);
