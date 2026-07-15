/* ============================================================================
 * Salmon Developers — mock accounts covering every routing outcome (en + bn).
 * Used by the G04 sign-in dev toolbar to demonstrate each branch of
 * auth-router.js. NB: no passwords/PANs — identity only.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var list = [
    { id: 'client-only',     identifier: 'rezaul@example.com',  en: 'Client only (Rezaul)',        bn: 'শুধু ক্রেতা (রেজাউল)',        roles: ['client'] },
    { id: 'partner-approved',identifier: '+8801712345678',      en: 'Partner · approved (Shahin)', bn: 'পার্টনার · অনুমোদিত (শাহিন)', roles: ['partner'], partnerStatus: 'approved', partnerId: 'SDP-CUM-00417' },
    { id: 'partner-pending', identifier: '+8801812345678',      en: 'Partner · pending',           bn: 'পার্টনার · অপেক্ষমাণ',        roles: ['partner'], partnerStatus: 'pending' },
    { id: 'partner-rejected',identifier: '+8801912345678',      en: 'Partner · rejected',          bn: 'পার্টনার · প্রত্যাখ্যাত',      roles: ['partner'], partnerStatus: 'rejected' },
    { id: 'dual',            identifier: 'shahin@example.com',  en: 'Dual role (buyer + partner)', bn: 'উভয় রোল (ক্রেতা + পার্টনার)', roles: ['client', 'partner'], partnerStatus: 'approved', partnerId: 'SDP-CUM-00417' }
  ];
  function find(identifier) {
    if (!identifier) return null;
    var q = String(identifier).trim().toLowerCase();
    return list.filter(function (a) { return a.identifier.toLowerCase() === q; })[0] || null;
  }
  root.AuthAccounts = { list: list, find: find };
})(window);
