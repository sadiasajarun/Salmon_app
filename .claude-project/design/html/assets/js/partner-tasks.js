/* ============================================================================
 * Salmon Developers — Tasks & Targets mock data (Partner Act 11, P63–P66)
 * ----------------------------------------------------------------------------
 * Tasks are assigned by managers or team leads. Statuses: assigned / inProgress
 * / complete / overdue. Overdue surfaces. Completion drafts locally and survives
 * a dropped connection (offline-safe input — NOT a money action).
 *
 * Targets are DISPLAY values from the backend. No "you'll hit it if you do X"
 * projection — no rule for that exists (same discipline as the dashboard).
 * Who may assign tasks (leads vs managers only) is undefined -> OPEN_QUESTIONS.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var CKEY = 'salmon_task_completions'; // local completion drafts

  var STATUS = {
    assigned:   { en: 'Assigned',    bn: 'অর্পিত',    cls: 'p-grey'  },
    inProgress: { en: 'In progress', bn: 'চলমান',     cls: 'p-amber' },
    complete:   { en: 'Complete',    bn: 'সম্পন্ন',    cls: 'p-green' },
    overdue:    { en: 'Overdue',     bn: 'সময় পার',   cls: 'p-red'   }
  };
  var ORDER = ['overdue', 'assigned', 'inProgress', 'complete'];

  var tasks = [
    { id: 'TK-5012', titleEn: 'Follow up with Rahim Uddin (lead LD-3041)', titleBn: 'রহিম উদ্দিনের সাথে ফলোআপ (লিড LD-3041)', status: 'overdue',    dueUtc: '2026-07-13T09:00:00Z', assignedByEn: 'Team lead · Shahin', assignedByBn: 'টিম লিড · শাহিন', descEn: 'Call and confirm site-visit interest for The ROSSA.', descBn: 'দ্য রোসার জন্য সাইট-ভিজিটের আগ্রহ নিশ্চিত করতে কল করুন।' },
    { id: 'TK-5008', titleEn: 'Distribute Bellissimo brochure in Amratali', titleBn: 'আমড়াতলীতে বেলিসিমো ব্রোশিওর বিতরণ', status: 'assigned',   dueUtc: '2026-07-18T09:00:00Z', assignedByEn: 'Manager · Cumilla office', assignedByBn: 'ম্যানেজার · কুমিল্লা অফিস', descEn: 'Hand out 20 printed brochures at the weekly bazaar.', descBn: 'সাপ্তাহিক বাজারে ২০টি ছাপা ব্রোশিওর বিতরণ করুন।' },
    { id: 'TK-5003', titleEn: 'Complete Zero-Investment onboarding module', titleBn: 'জিরো-ইনভেস্টমেন্ট অনবোর্ডিং মডিউল সম্পন্ন করুন', status: 'inProgress', dueUtc: '2026-07-20T09:00:00Z', assignedByEn: 'Manager · Training', assignedByBn: 'ম্যানেজার · প্রশিক্ষণ', descEn: 'Read the partner guidelines in the training library.', descBn: 'প্রশিক্ষণ লাইব্রেরিতে পার্টনার নির্দেশিকা পড়ুন।' },
    { id: 'TK-4991', titleEn: 'Submit Oasis Park site photos', titleBn: 'ওয়েসিস পার্কের সাইট ছবি জমা দিন', status: 'complete',   dueUtc: '2026-07-06T09:00:00Z', assignedByEn: 'Team lead · Shahin', assignedByBn: 'টিম লিড · শাহিন', descEn: 'Uploaded 8 progress photos.', descBn: '৮টি অগ্রগতির ছবি আপলোড হয়েছে।' }
  ];
  function task(id) { return tasks.filter(function (t) { return t.id === id; })[0] || null; }
  function counts() { var c = {}; ORDER.forEach(function (k) { c[k] = 0; }); tasks.forEach(function (t) { c[t.status]++; }); return c; }

  function getCompletion(id) { try { return (JSON.parse(localStorage.getItem(CKEY)) || {})[id] || null; } catch (e) { return null; } }
  function saveCompletion(id, note) { try { var m = JSON.parse(localStorage.getItem(CKEY)) || {}; m[id] = { note: note, at: 'draft' }; localStorage.setItem(CKEY, JSON.stringify(m)); } catch (e) {} }

  // Targets — DISPLAY values only.
  var targets = {
    periodEn: 'Q3 2026', periodBn: 'তৃতীয় প্রান্তিক ২০২৬',
    lines: [
      { keyEn: 'Verified conversions', keyBn: 'যাচাইকৃত রূপান্তর', target: 6, achieved: 3, unit: '' },
      { keyEn: 'Leads submitted', keyBn: 'জমাকৃত লিড', target: 30, achieved: 22, unit: '' },
      { keyEn: 'Sales volume', keyBn: 'সেল ভলিউম', target: 1000000, achieved: 620000, unit: 'bdt' }
    ],
    __PLACEHOLDER: true
  };

  root.PartnerTasks = {
    STATUS: STATUS, ORDER: ORDER, tasks: tasks, task: task, counts: counts,
    getCompletion: getCompletion, saveCompletion: saveCompletion, targets: targets,
    strings: {
      en: { tasks: 'Tasks', targets: 'Targets', all: 'All', due: 'Due', assignedBy: 'Assigned by',
        markComplete: 'Mark complete', completionNote: 'Completion note', evidence: 'Attach evidence (optional)',
        submitComplete: 'Submit', complete: 'Complete', empty: 'No tasks here',
        target: 'Target', achieved: 'Achieved', dispNote: 'Figures are supplied by Salmon — shown here, not calculated, with no projection.',
        savedDraft: 'Saved as a draft — it will sync when you’re back online.' },
      bn: { tasks: 'কাজ', targets: 'লক্ষ্য', all: 'সব', due: 'শেষ সময়', assignedBy: 'অর্পণকারী',
        markComplete: 'সম্পন্ন চিহ্নিত করুন', completionNote: 'সম্পন্নের নোট', evidence: 'প্রমাণ সংযুক্ত করুন (ঐচ্ছিক)',
        submitComplete: 'জমা দিন', complete: 'সম্পন্ন', empty: 'এখানে কোনো কাজ নেই',
        target: 'লক্ষ্য', achieved: 'অর্জিত', dispNote: 'সংখ্যাগুলো স্যামন সরবরাহ করে — এখানে শুধু দেখানো, হিসাব বা প্রক্ষেপণ নয়।',
        savedDraft: 'খসড়া হিসেবে সংরক্ষিত — অনলাইনে ফিরলে সিঙ্ক হবে।' }
    }
  };
})(window);
