/* ============================================================================
 * Salmon Developers — SupportChannel seam (WhatsApp Business API | in-app chat)
 * ----------------------------------------------------------------------------
 * The BRD leaves this UNDECIDED and it changes the PRODUCT, not just the code:
 *  - whatsapp: conversation lives on Meta; the user leaves the app; we keep only
 *    a ticket REFERENCE + STATUS. The in-app record is a STUB, never a fake
 *    transcript (rendering a thread we don't hold is a lie -> support incident).
 *  - inapp: full thread, agent identity, statuses, attachments, all ours.
 * Toggle here to review the hub/thread under either configuration.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var KEY = 'salmon_support_channel';
  function get() { try { return localStorage.getItem(KEY) || 'inapp'; } catch (e) { return 'inapp'; } }
  function set(c) { try { localStorage.setItem(KEY, c); } catch (e) {} document.dispatchEvent(new CustomEvent('supportchange', { detail: c })); }

  var rm = {
    name: 'Farhana Islam', role: 'Relationship Manager', initials: 'FI',
    whatsapp: '+8801700000000', email: 'care@salmondevelopersbd.com', hotline: '+8809600000000'
  };
  // Salmon office hours (Dhaka): Sat–Thu 09:00–19:00, Fri 10:00–18:00. (Sun..Sat = 0..6)
  var hoursDhaka = { 6: [9, 19], 0: [9, 19], 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [10, 18] }; // Sat=6,Sun=0..Thu=4,Fri=5
  var ticket = { ref: 'TC-1042', subject: 'Invoice question', status: 'inProgress', lastUpdatedUtc: '2026-07-13T12:00:00Z' };

  root.SupportChannel = { get: get, set: set, rm: rm, hoursDhaka: hoursDhaka, ticket: ticket };
})(window);
