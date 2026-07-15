/* ============================================================================
 * Salmon Developers — Notifications mock data (Partner Act 12)
 * ----------------------------------------------------------------------------
 * NOTIFICATION CENTRE (P73): grouped, TIMEZONE-CORRECT, and carries NO FINANCIAL
 * DETAIL in the payload — same rule as the client app. A locked phone on the
 * shop counter must never surface a commission amount. So a commission event
 * says "a commission was approved", never "৳184,000 approved".
 * ==========================================================================*/
(function (root) {
  'use strict';

  // Notifications — grouped by kind. NO amounts, NO balances. Timezone-correct.
  var GROUPS = ['approval', 'lead', 'task', 'commission', 'settlement', 'meeting'];
  var GROUP_LABEL = {
    approval:   { en: 'Approvals',   bn: 'অনুমোদন' },
    lead:       { en: 'Leads',       bn: 'লিড' },
    task:       { en: 'Tasks',       bn: 'কাজ' },
    commission: { en: 'Commission',  bn: 'কমিশন' },
    settlement: { en: 'Settlement',  bn: 'সেটেলমেন্ট' },
    meeting:    { en: 'Meetings',    bn: 'মিটিং' }
  };
  var notifications = [
    { id: 'n1', group: 'lead',       en: 'Lead “Rahim Uddin” was contacted', bn: 'লিড “রহিম উদ্দিন”-এর সাথে যোগাযোগ হয়েছে', t: '2026-07-14T09:00:00Z', link: 'lead-detail.page.html?id=LD-3038' },
    { id: 'n2', group: 'commission', en: 'A commission was approved',        bn: 'একটি কমিশন অনুমোদিত হয়েছে', t: '2026-07-13T10:00:00Z', link: 'commission.page.html' }, // NO amount
    { id: 'n3', group: 'task',       en: 'A task is overdue',                bn: 'একটি কাজের সময় পার হয়েছে', t: '2026-07-13T04:00:00Z', link: 'tasks.page.html' },
    { id: 'n4', group: 'settlement', en: 'Your settlement request updated',  bn: 'আপনার সেটেলমেন্ট অনুরোধ আপডেট হয়েছে', t: '2026-07-12T07:30:00Z', link: 'settlement-status.page.html' }, // NO amount
    { id: 'n5', group: 'meeting',    en: 'Meeting confirmed for tomorrow',   bn: 'আগামীকালের মিটিং নিশ্চিত হয়েছে', t: '2026-07-12T05:00:00Z', link: 'meeting-confirmed.page.html' },
    { id: 'n6', group: 'approval',   en: 'A document was verified',          bn: 'একটি নথি যাচাই হয়েছে', t: '2026-07-11T06:00:00Z', link: 'record-status.page.html' }
  ];

  root.PartnerSystem = {
    GROUPS: GROUPS, GROUP_LABEL: GROUP_LABEL, notifications: notifications,
    strings: {
      en: { notifications: 'Notifications',
        noFinance: 'Amounts are never shown here — open the item to see detail.', all: 'All', markRead: 'Mark all read', empty: 'Nothing yet' },
      bn: { notifications: 'বিজ্ঞপ্তি',
        noFinance: 'এখানে কখনো পরিমাণ দেখানো হয় না — বিস্তারিত দেখতে আইটেম খুলুন।', all: 'সব', markRead: 'সব পঠিত চিহ্নিত', empty: 'এখনো কিছু নেই' }
    }
  };
})(window);
