/* ============================================================================
 * Salmon Developers — territory cascade (Division › District › Upazila › Union)
 * Bengali-first. Fully populated for Chattogram › Cumilla (Shahin's patch);
 * other divisions are named but their districts are marked "data pending"
 * (structure + completeness undefined by client -> OPEN_QUESTIONS.md).
 * ==========================================================================*/
(function (root) {
  'use strict';
  function u(bn, en) { return { bn: bn, en: en }; }

  var cumilla = {
    bn: 'কুমিল্লা', en: 'Cumilla', key: 'cumilla',
    upazilas: [
      { bn: 'কুমিল্লা সদর', en: 'Cumilla Sadar', key: 'cumilla-sadar', unions: [u('আমড়াতলী','Amratali'), u('দুর্গাপুর','Durgapur'), u('জগন্নাথপুর','Jagannathpur'), u('পাঁচথুবী','Panchthubi')] },
      { bn: 'দেবীদ্বার', en: 'Debidwar', key: 'debidwar', unions: [u('সুবিল','Subil'), u('এলাহাবাদ','Elahabad'), u('রাজামেহার','Rajamehar')] },
      { bn: 'মুরাদনগর', en: 'Muradnagar', key: 'muradnagar', unions: [u('বাঙ্গরা','Bangra'), u('শ্রীকাইল','Srikail'), u('জাহাপুর','Jahapur')] },
      { bn: 'চান্দিনা', en: 'Chandina', key: 'chandina', unions: [u('বরকরই','Barkarai'), u('মাধাইয়া','Madhaiya'), u('এতবারপুর','Etbarpur')] }
    ]
  };
  var dhakaDist = { bn: 'ঢাকা', en: 'Dhaka', key: 'dhaka', upazilas: [
    { bn: 'সাভার', en: 'Savar', key: 'savar', unions: [u('আশুলিয়া','Ashulia'), u('তেঁতুলঝোড়া','Tetuljhora')] },
    { bn: 'ধামরাই', en: 'Dhamrai', key: 'dhamrai', unions: [u('কুশুরা','Kushura'), u('সোমভাগ','Sombhag')] }
  ]};

  var divisions = [
    { bn: 'চট্টগ্রাম', en: 'Chattogram', key: 'chattogram', districts: [cumilla, { bn: 'নোয়াখালী', en: 'Noakhali', key: 'noakhali', upazilas: [], pending: true }, { bn: 'ফেনী', en: 'Feni', key: 'feni', upazilas: [], pending: true }] },
    { bn: 'ঢাকা', en: 'Dhaka', key: 'dhaka', districts: [dhakaDist, { bn: 'গাজীপুর', en: 'Gazipur', key: 'gazipur', upazilas: [], pending: true }] },
    { bn: 'রাজশাহী', en: 'Rajshahi', key: 'rajshahi', districts: [], pending: true },
    { bn: 'খুলনা', en: 'Khulna', key: 'khulna', districts: [], pending: true },
    { bn: 'বরিশাল', en: 'Barishal', key: 'barishal', districts: [], pending: true },
    { bn: 'সিলেট', en: 'Sylhet', key: 'sylhet', districts: [], pending: true },
    { bn: 'রংপুর', en: 'Rangpur', key: 'rangpur', districts: [], pending: true },
    { bn: 'ময়মনসিংহ', en: 'Mymensingh', key: 'mymensingh', districts: [], pending: true }
  ];

  root.Territory = {
    divisions: divisions,
    findDivision: function (k) { return divisions.filter(function (d) { return d.key === k; })[0]; },
    // Shahin's assigned territory (conferred on approval)
    assigned: { divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', districtBn: 'কুমিল্লা', districtEn: 'Cumilla', upazilaBn: 'কুমিল্লা সদর', upazilaEn: 'Cumilla Sadar', unionBn: 'পাঁচথুবী', unionEn: 'Panchthubi' }
  };
})(window);
