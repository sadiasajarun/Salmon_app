/* ============================================================================
 * Salmon Developers — Act 2 mock data
 * ----------------------------------------------------------------------------
 * REAL data (name, status, address, tagline, At-A-Glance, image/brochure/video
 * URLs) was fetched from https://salmondevelopersbd.com/projects/<slug>.
 *
 * FABRICATED values are flagged `_ph: [...]` per project and via `__PLACEHOLDER`
 * on price objects. Every fabricated value is also logged in
 * .claude-project/OPEN_QUESTIONS.md for Salmon to confirm. Do not treat any
 * flagged value as real.
 *
 * Statuses on the live site are: "Sale Ongoing", "Under Construction",
 * "Handed Over". The discovery filter needs ongoing / completed / upcoming, so
 * we bucket:  Sale Ongoing + Under Construction -> ongoing ; Handed Over ->
 * completed ; the two list-only projects (no detail page) -> upcoming.
 * The bucket mapping is an assumption (flagged).
 * ==========================================================================*/
(function (root) {
  'use strict';

  // Per-neighbourhood fabricated BDT/sqft rate used to derive placeholder prices.
  var AREA = {
    basundhara: { key: 'basundhara', en: 'Basundhara R/A', bn: 'বসুন্ধরা আ/এ', rate: 13000, lat: 23.8213, lng: 90.4460 },
    banasree:   { key: 'banasree',   en: 'Banasree / Khilgaon', bn: 'বনশ্রী / খিলগাঁও', rate: 10000, lat: 23.7660, lng: 90.4380 },
    rampura:    { key: 'rampura',    en: 'West Rampura', bn: 'পশ্চিম রামপুরা', rate: 8500, lat: 23.7580, lng: 90.4200 },
    badda:      { key: 'badda',      en: 'Badda', bn: 'বাড্ডা', rate: 8000, lat: 23.7900, lng: 90.4270 },
    sanarpar:   { key: 'sanarpar',   en: 'Sanarpar', bn: 'সানারপাড়', rate: 6500, lat: 23.6870, lng: 90.5010 },
    tusardhara: { key: 'tusardhara', en: 'Tusar Dhara R/A', bn: 'তুষার ধারা আ/এ', rate: 6500, lat: 23.8330, lng: 90.3720 }
  };

  var CDN = 'https://admin.salmondevelopersbd.com/uploads/projects/';

  // FABRICATED civic amenities / neighbourhood per area (not on Salmon's site -> __PLACEHOLDER,
  // logged in OPEN_QUESTIONS.md). Keyed by area; attached to each project below. Plausible nearby
  // Dhaka landmarks — do NOT claim precision.
  var HOOD = {
    basundhara: { schools: ['Independent University Bangladesh', 'International School Dhaka'], hospitals: ['Evercare Hospital Dhaka'], transport: ['300 Feet Road', 'Kuril Flyover'], markets: ['Jamuna Future Park'] },
    banasree:   { schools: ['Banasree Ideal School & College'], hospitals: ['Farazy Hospital'], transport: ['Banasree–Rampura Road'], markets: ['Banasree M-Block Market'] },
    rampura:    { schools: ['Ekramunnesa High School'], hospitals: ['Al-Rajhi Hospital'], transport: ['Rampura Bridge', 'City bus routes'], markets: ['Rampura Bazar'] },
    badda:      { schools: ['Bhuiyan Academy'], hospitals: ['AMZ Hospital'], transport: ['Badda Link Road'], markets: ['Gulshan–Badda Link Road shops'] },
    sanarpar:   { schools: ['Sanarpar High School'], hospitals: ['Proyash General Hospital'], transport: ['Dhaka–Chattogram Highway'], markets: ['Sanarpar Bazar'] },
    tusardhara: { schools: ['Tusar Dhara School'], hospitals: ['Sign Board Diagnostic'], transport: ['Sign Board bus stand', 'Dhaka–Narayanganj road'], markets: ['Sign Board Market'] }
  };

  // Deterministic unit-inventory generator (FABRICATED). Distributes a flat
  // count across Available / Reserved / Booked / Sold with a per-project seed so
  // the availability filter has something to filter. No Math.random -> stable.
  function units(count, seed) {
    var STAT = ['available', 'reserved', 'booked', 'sold'];
    // weights vary by seed to give a realistic, varied spread
    var out = [], i, s;
    for (i = 0; i < count; i++) {
      s = (i * 7 + seed * 13) % 10;
      var st = s < 3 ? 'available' : s < 5 ? 'reserved' : s < 8 ? 'booked' : 'sold';
      out.push({ id: 'U' + (i + 1), label: floorLabel(i, count), status: st, __PLACEHOLDER: true });
    }
    return out;
  }
  function floorLabel(i, count) {
    var floor = Math.floor(i / Math.max(1, Math.round(count / 9))) + 1;
    var letter = 'ABCD'[i % 3];
    return floor + letter;
  }
  function availCount(u) { return u.filter(function (x) { return x.status === 'available'; }).length; }

  // FABRICATED construction timeline for ongoing/under-construction projects.
  // Anchored on real blog events where known (Florentine soil test Aug 2025 +
  // land registration Jul 2025; US Tower soil test Jul 2025).
  function progressGeneric() {
    return [
      { date: '2026-06-12', captionEn: 'Floors 6–8 structural work completed', captionBn: '৬–৮ তলার স্ট্রাকচারাল কাজ সম্পন্ন', __PLACEHOLDER: true },
      { date: '2026-03-04', captionEn: 'Superstructure casting underway', captionBn: 'সুপারস্ট্রাকচার ঢালাই চলছে', __PLACEHOLDER: true },
      { date: '2025-11-18', captionEn: 'Ground floor slab cast', captionBn: 'গ্রাউন্ড ফ্লোর স্ল্যাব ঢালাই', __PLACEHOLDER: true },
      { date: '2025-08-20', captionEn: 'Soil test completed', captionBn: 'মাটি পরীক্ষা সম্পন্ন', anchor: true },
      { date: '2025-07-10', captionEn: 'Land registration completed', captionBn: 'জমি নিবন্ধন সম্পন্ন', anchor: true }
    ];
  }

  // ---- helpers to assemble a project record --------------------------------
  function priceRange(area, sqftMin, sqftMax) {
    var r = AREA[area].rate;
    var bdtFrom = Math.round((sqftMin * r) / 100000) * 100000;
    var bdtTo   = Math.round((sqftMax * r) / 100000) * 100000;
    return { amountBdtFrom: bdtFrom, amountBdtTo: bdtTo, displayCurrency: 'AED',
             rateUsed: 0.0362, rateAsOf: '__PLACEHOLDER', rounding: '__PLACEHOLDER', __PLACEHOLDER: true };
  }
  function g(slug, files) { return files.map(function (f) { return CDN + 'gallery/' + f; }); }

  var P = [];

  // 1. Salmon Bellissimo — REAL
  P.push({
    slug: 'salmon-bellissimo', name: 'Salmon Bellissimo', area: 'basundhara',
    address: 'Basundhara R/A', addressBn: 'বসুন্ধরা আ/এ',
    siteStatus: 'Sale Ongoing', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.',
    taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'South', bed: 4, bath: 3, balcony: 3, lift: 1, floors: 'G+9', sqft: [2050], frontRoad: '25ft', landArea: '5 katha', flats: 9 },
    banner: CDN + 'banners/_bdd5ac45-79eb-40d2-8576-f1b6e88bc697.png',
    gallery: g('', ['_105edaed-b71d-4da2-a73b-1f8a07370d81.png', '_fdb65544-a5a2-41bf-911f-89aae23d1a50.png', '_1a14692a-d5ca-46c1-9f3e-fead9043d812.png']),
    amenities: [CDN + 'amenities_images/_88c99538-6b90-4307-b3d9-b094a2a71ce9.png', CDN + 'amenities_images/_7c90c872-db83-472d-96ab-944dd6c49b14.png', CDN + 'amenities_images/_317198ab-d5a9-4d6b-beba-0c478db3b860.png'],
    brochure: CDN + 'pdfs/_066f64b8-e3b7-4fcd-a4c5-34f617f918bf.pdf', brochureSize: '2.4 MB',
    youtube: 'T2bJXt9BzVo',
    price: priceRange('basundhara', 2050, 2050),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama']
  });

  // 2. Salmon Florentine — REAL
  P.push({
    slug: 'salmon-florentine', name: 'Salmon Florentine', area: 'basundhara',
    address: 'Basundhara R/A, Block N', addressBn: 'বসুন্ধরা আ/এ, ব্লক এন',
    siteStatus: 'Under Construction', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'North', bed: 4, bath: 3, balcony: 4, lift: 1, floors: 'G+9', sqft: [2050], frontRoad: '25ft', landArea: '5 katha', flats: 9 },
    banner: CDN + 'ataglanceimages/salmon-florentine_f06aea34-bbd7-4951-878b-a88053d924db_size_.png',
    gallery: g('', ['_97029cfd-fb2d-493f-a59c-e4624ec6f828.png', '_042bbbce-2b13-421f-b5ea-32890d81e2f6.png', '_96dfb977-dc4a-4485-ad44-9232d663c5d6.png']),
    amenities: [CDN + 'amenities_images/_127df303-5cef-4beb-8ed9-e6bfcaeecf31.png'],
    brochure: CDN + 'pdfs/_a49e8880-b242-44cf-bcfe-d29dde1b43cc.pdf', brochureSize: '3.1 MB',
    youtube: '53cV8_OE5Pc',
    price: priceRange('basundhara', 2050, 2050),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama']
  });

  // 3. The ROSSA — REAL  (matches Rezaul's query: Basundhara · 3 bed · 1520 sqft · ongoing · < AED 750k)
  P.push({
    slug: 'the-rossa', name: 'The ROSSA', area: 'basundhara',
    address: 'Basundhara R/A', addressBn: 'বসুন্ধরা আ/এ',
    siteStatus: 'Sale Ongoing', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'North', bed: 3, bath: 3, balcony: 3, lift: 1, floors: 'G+6', sqft: [1520], frontRoad: '25ft', landArea: '3 katha', flats: 6 },
    banner: CDN + 'banners/_75ffcef2-f8d8-46f6-aea5-2af878c412b5.png',
    gallery: g('', ['_6a3853a7-4d1a-4e6b-a4b5-da990f620ae3.png', '_ce816d3c-f80d-45b6-a139-d083262cda4a.png', '_d96ec62f-40a0-4451-975a-cbefc8b64960.png']),
    amenities: [], brochure: CDN + 'pdfs/_44ec90f5-019c-46c4-8181-b67c3f433fcc.pdf', brochureSize: '1.9 MB',
    youtube: 'LhqGLIstwM4',
    price: priceRange('basundhara', 1520, 1520),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama']
  });

  // 4. Salmon Water Fall — REAL
  P.push({
    slug: 'salmon-water-fall', name: 'Salmon Water Fall', area: 'basundhara',
    address: 'Basundhara R/A, N Block', addressBn: 'বসুন্ধরা আ/এ, এন ব্লক',
    siteStatus: 'Sale Ongoing', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'South', bed: 4, bath: 4, balcony: 4, lift: 1, floors: 'G+9', sqft: [2050], frontRoad: '25ft', landArea: '5 katha', flats: 9 },
    banner: CDN + 'banners/_5a445902-6357-491e-865d-6902dd980580.png',
    gallery: g('', ['_3260459a-5805-4698-ab51-b186820e1683.png', '_5b9db820-d178-45dc-a991-2944c6b6cb01.png', '_c1c03621-dfb5-4fcb-a0b4-5f755e21412e.png', '_ac745703-8aaa-4a60-8ec7-0e04f7cb2ea8.jpg']),
    amenities: [], brochure: CDN + 'pdfs/salmon-water-fall_06c8984d-c6f1-45bc-a563-0a2b246cfd08.pdf', brochureSize: '2.7 MB',
    youtube: 'gyEvkOJPDPY',
    price: priceRange('basundhara', 2050, 2050),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama']
  });

  // 5. Salmon Orchard — REAL
  P.push({
    slug: 'salmon-orchard', name: 'Salmon Orchard', area: 'basundhara',
    address: 'Basundhara R/A', addressBn: 'বসুন্ধরা আ/এ',
    siteStatus: 'Under Construction', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'South West', bed: 4, bath: 3, balcony: 3, lift: 1, floors: 'G+9', sqft: [2050], frontRoad: '25ft', landArea: '5 katha', flats: 9 },
    banner: CDN + 'banners/_c1395e6e-4538-4dc4-bcb2-dded6c00f973.png',
    gallery: g('', ['_e8b369e3-8fd0-4e27-a648-8b86b4011886.png', '_6b58336a-824e-459d-835c-02abed824056.png', '_aba9be19-861e-4616-960c-73d78be6cece.png']),
    amenities: [], brochure: null, brochureSize: null,
    youtube: 'd8nXKSbl3hA',
    price: priceRange('basundhara', 2050, 2050),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama', 'brochure-missing']
  });

  // 6. US Tower — REAL
  P.push({
    slug: 'us-tower', name: 'US Tower', area: 'basundhara',
    address: 'Basundhara R/A', addressBn: 'বসুন্ধরা আ/এ',
    siteStatus: 'Under Construction', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'North', bed: 3, bath: 3, balcony: 3, lift: 1, floors: 'G+7', sqft: [1250], frontRoad: '25ft', landArea: '5 katha', flats: 14 },
    banner: CDN + 'banners/_c3f84e57-3583-4caf-8bc2-1d796a71a85c.jpeg',
    gallery: g('', ['_8543bfa4-054b-4081-9f82-0d7115d890d9.jpeg', '_59c4dd22-301f-4abc-8cd3-478a5a760bec.jpeg', '_72365e01-3244-48fc-94d0-b6c451fd4072.jpg']),
    amenities: [CDN + 'amenities_images/_a7fb6745-fe31-4a2d-bed0-e1d9d384dfe4.jpeg'], brochure: null, brochureSize: null,
    youtube: 'MeZhArzXzfk',
    price: priceRange('basundhara', 1250, 1250),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama', 'brochure-missing']
  });

  // 7. Salmon Oasis Park — REAL (multi-config)
  P.push({
    slug: 'salmon-oasis-park', name: 'Salmon Oasis Park', area: 'banasree',
    address: 'Trimohoni, Banasree, Khilgaon', addressBn: 'ত্রিমোহনী, বনশ্রী, খিলগাঁও',
    siteStatus: 'Sale Ongoing', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Condominium / Residential', facing: 'South (Lake view)', bed: '3–4', bath: 3, balcony: '4–5', lift: 6, floors: 'B1+B2+M+G+16', sqft: [1648, 1834, 2022, 2230], frontRoad: '50ft', landArea: '24 katha', flats: 128 },
    banner: CDN + 'banners/salmon-oasis-park_3635d2c6-8615-4fb9-8ea0-6473339d6aba.jpg',
    gallery: g('', ['salmon-oasis-park_dbf138c2-0892-43eb-957b-fd49c292e1f7.jpg', 'salmon-oasis-park_0788cf7c-151b-4372-9a6b-bc32a1ff6a22.jpg', 'salmon-oasis-park_cf7c6c0d-4e39-457a-b26a-4d02e665f8f3.jpg', 'salmon-oasis-park_81ea43de-9bfd-4015-a162-5a2d6fe0836b.jpg']),
    amenities: [], brochure: CDN + 'pdfs/salmon-oasis-park_06ee096f-1363-49bc-bb01-06c2ee310819.pdf', brochureSize: '5.6 MB',
    youtube: '5eBSE0gJWwQ',
    price: priceRange('banasree', 1648, 2230),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama']
  });

  // 8. Zheel View — REAL (completed)
  P.push({
    slug: 'zheel-view', name: 'Zheel View', area: 'rampura',
    address: '35 Ulon, West Rampura', addressBn: '৩৫ উলন, পশ্চিম রামপুরা',
    siteStatus: 'Handed Over', status: 'completed',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'West', bed: 3, bath: 3, balcony: 3, lift: 1, floors: 'G+9', sqft: [1375], frontRoad: '20ft', landArea: '6.57 katha', flats: 27 },
    banner: CDN + 'banners/_83678dd0-d2bc-4e9a-a8c6-e8055d7f086e.jpg',
    gallery: g('', ['_03cc79f3-cc3a-494d-a2c1-f2c9c675b35a.jpg', '_b89ff626-8d08-4156-b8cf-94144a1ed206.png', '_78396f64-8a08-4bd1-8e10-ca7eadbf2638.png', '_31260e62-33a0-4adf-9939-1e7e814701fa.jpg']),
    amenities: [], brochure: CDN + 'pdfs/zheel-view_b9a3aa10-45c3-4f67-92ac-b60b6c7393ee.pdf', brochureSize: '2.2 MB',
    youtube: 'K2p4vBcL_W4',
    price: priceRange('rampura', 1375, 1375),
    _ph: ['price', 'coords', 'units', 'panorama']
  });

  // 9. Dream House — REAL (completed)
  P.push({
    slug: 'dream-house', name: 'Dream House', area: 'badda',
    address: 'North Badda', addressBn: 'উত্তর বাড্ডা',
    siteStatus: 'Handed Over', status: 'completed',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'South West', bed: 3, bath: 3, balcony: 3, lift: 1, floors: 'G+7', sqft: [700, 900], frontRoad: '20ft', landArea: '5 katha', flats: 24 },
    banner: CDN + 'banners/dream-house_1f894265-2d22-4b2d-b095-30d37b12cb1d.jpg',
    gallery: g('', ['dream-house_3d37c2d6-29ed-4f55-b185-7f4b2f532c13.jpg', 'dream-house_3b1feb44-e5fc-4b48-887e-c0039b6f706b.jpg', 'dream-house_8b7c7ed7-8045-4821-b2bf-890508833b25.jpg']),
    amenities: [], brochure: CDN + 'pdfs/dream-house_cbf46300-5a57-4957-8057-cc5ccff3e492.pdf', brochureSize: '1.5 MB',
    youtube: 'dB0qlsG4LDY',
    price: priceRange('badda', 700, 900),
    _ph: ['price', 'coords', 'units', 'panorama']
  });

  // 10. Shopno Neer — REAL (completed)
  P.push({
    slug: 'shopno-neer', name: 'Shopno Neer', area: 'badda',
    address: 'North Badda', addressBn: 'উত্তর বাড্ডা',
    siteStatus: 'Handed Over', status: 'completed',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'East', bed: 3, bath: 3, balcony: 3, lift: 1, floors: 'G+9', sqft: [1267], frontRoad: '18ft', landArea: '6 katha', flats: 27 },
    banner: CDN + 'banners/_2e1eafaf-d107-4e81-b1ca-a0afa2b569f5.png',
    gallery: g('', ['_26224320-c532-4136-b35f-68069d6176a3.png', '_c34512c9-c382-4b64-a413-50da6cb518ab.png', '_0756528e-02b9-4b22-a352-912a2d1b299e.png', '_061c0609-c7bb-46ce-b2e2-00921f9e7ee5.png']),
    amenities: [], brochure: null, brochureSize: null,
    youtube: 'dB0qlsG4LDY',
    price: priceRange('badda', 1267, 1267),
    _ph: ['price', 'coords', 'units', 'panorama', 'brochure-missing']
  });

  // 11. Shopno Bilash — REAL
  P.push({
    slug: 'shopno-bilash', name: 'Shopno Bilash', area: 'badda',
    address: 'East Badda', addressBn: 'পূর্ব বাড্ডা',
    siteStatus: 'Under Construction', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: '20 West / 10 North', bed: 3, bath: 3, balcony: 3, lift: 2, floors: 'G+9', sqft: [1267], frontRoad: '20ft', landArea: '12 katha', flats: 54 },
    banner: CDN + 'banners/shopno-bilash_1b5f12a6-f4dd-4eee-8389-2b181abdfea4.png',
    gallery: g('', ['_e618cd9f-8d67-4137-9a13-0b4bc9710eb9.png', '_eebeebe0-c473-4438-ac84-ade7a78b553f.png', '_e1f7a344-24bb-45fb-80d9-995807629d27.png', '_5945ad96-5de1-42a2-90d3-7e4fd15af70b.png']),
    amenities: [], brochure: CDN + 'pdfs/shopno-bilash_2d175e7a-ab71-4187-af00-45dd7e7ab265.pdf', brochureSize: '3.4 MB',
    youtube: 'LhqGLIstwM4',
    price: priceRange('badda', 1267, 1267),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama']
  });

  // 12. Lake View — REAL (multi-config)
  P.push({
    slug: 'lake-view', name: 'Lake View', area: 'sanarpar',
    address: 'Sanarpar', addressBn: 'সানারপাড়',
    siteStatus: 'Under Construction', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'West', bed: '3–4', bath: 3, balcony: 3, lift: 2, floors: 'G+9', sqft: [1200, 1360, 1500, 1800], frontRoad: '20ft', landArea: '11.89 katha', flats: 36 },
    banner: CDN + 'banners/_08fd7909-341a-4715-8a43-d4b7a63fd702.jpg',
    gallery: g('', ['_f783c39a-5160-41d3-895e-56a82bdaabfb.jpg', '_6e522197-04a5-479a-9bc1-d34bb38ab11e.jpg', '_af178edb-df16-4464-93a6-9902c73866c2.png']),
    amenities: [], brochure: CDN + 'pdfs/lake-view_e26ec12e-4eab-448f-8b50-8e017e472976.pdf', brochureSize: '2.9 MB',
    youtube: null,
    price: priceRange('sanarpar', 1200, 1800),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama', 'video-missing']
  });

  // 13. Tabuk Tower — REAL
  P.push({
    slug: 'tabuk-tower', name: 'Tabuk Tower', area: 'tusardhara',
    address: 'Tusar Dhara R/A, Sign Board', addressBn: 'তুষার ধারা আ/এ, সাইনবোর্ড',
    siteStatus: 'Under Construction', status: 'ongoing',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: 'A timeless masterpiece, blending luxurious modernity and functionality, designed to inspire generations to come.',
    glance: { buildingType: 'Resident', facing: 'South', bed: 3, bath: 3, balcony: 3, lift: 1, floors: 'G+9', sqft: [1250], frontRoad: '20ft', landArea: '6 katha', flats: 27 },
    banner: CDN + 'banners/_9a47675e-ec6f-4911-9b06-116c15cc70bd.png',
    gallery: g('', ['_f39c89e3-f0ec-44b3-b76f-57b42f1dda32.png', '_8c0ee755-886e-42c5-870c-58ef719597be.png', '_bb5d910c-5bcb-4209-908e-202592567536.png', '_bd8bb20e-2814-423e-8a8d-c4d82e257a54.png']),
    amenities: [], brochure: null, brochureSize: null,
    youtube: 'dB0qlsG4LDY',
    price: priceRange('tusardhara', 1250, 1250),
    _ph: ['price', 'coords', 'units', 'progress', 'panorama', 'brochure-missing']
  });

  // 14. Salmon Sweet Melody — LIST ONLY (no detail page). All specifics fabricated/unknown.
  P.push({
    slug: 'salmon-sweet-melody', name: 'Salmon Sweet Melody', area: 'basundhara',
    address: 'Basundhara R/A', addressBn: 'বসুন্ধরা আ/এ',
    siteStatus: 'Coming soon', status: 'upcoming',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: null, listOnly: true,
    glance: null, banner: null, gallery: [], amenities: [], brochure: null, youtube: null,
    price: null,
    _ph: ['status-upcoming', 'all-specs', 'price', 'coords', 'media']
  });

  // 15. Salmon Villa Lone — LIST ONLY (no detail page). All specifics fabricated/unknown.
  P.push({
    slug: 'salmon-villa-lone', name: 'Salmon Villa Lone', area: 'basundhara',
    address: 'Basundhara R/A', addressBn: 'বসুন্ধরা আ/এ',
    siteStatus: 'Coming soon', status: 'upcoming',
    tagline: 'Invite yourself to a pristine seclusion.', taglineBn: 'নিজেকে আমন্ত্রণ জানান এক নিখুঁত নিরিবিলিতে।',
    description: null, listOnly: true,
    glance: null, banner: null, gallery: [], amenities: [], brochure: null, youtube: null,
    price: null,
    _ph: ['status-upcoming', 'all-specs', 'price', 'coords', 'media']
  });

  // attach fabricated coords + unit inventory
  P.forEach(function (p, i) {
    var a = AREA[p.area];
    var off = ((i % 5) - 2) * 0.006, off2 = ((i % 3) - 1) * 0.006;
    p.coords = { lat: +(a.lat + off).toFixed(5), lng: +(a.lng + off2).toFixed(5), __PLACEHOLDER: true };
    if (p.glance && p.glance.flats) {
      p.units = units(p.glance.flats, i + 1);
      p.availableUnits = availCount(p.units);
    } else { p.units = []; p.availableUnits = 0; }
    if (p._ph.indexOf('progress') > -1) p.progress = progressGeneric();
    // 360 placeholder — public-domain equirectangular panorama stand-in
    p.panorama = { src: 'https://pannellum.org/images/alma.jpg', label: 'Placeholder panorama — awaiting Salmon’s Matterport assets', __PLACEHOLDER: true };
    // civic amenities / neighbourhood — only present when the (fabricated) catalogue has it
    p.neighbourhood = HOOD[p.area] ? Object.assign({ __PLACEHOLDER: true }, HOOD[p.area]) : null;
  });

  // UI chrome strings (English + Bengali). Project names/taglines carried on records.
  var STRINGS = {
    en: {
      explore: 'Explore', list: 'List', map: 'Map', filters: 'Filters', clearAll: 'Clear all',
      showing: 'Showing {n} of {total} projects', available: 'Available', reserved: 'Reserved',
      booked: 'Booked', sold: 'Sold', ongoing: 'Ongoing', completed: 'Completed', upcoming: 'Upcoming',
      status: 'Project status', location: 'Location', category: 'Property category', bedrooms: 'Bedrooms',
      area: 'Area size (sqft)', price: 'Price range', availOnly: 'Available only',
      atAGlance: 'At a glance', description: 'Description', amenities: 'Amenities', gallery: 'Gallery',
      video: 'Video', tour: '360° tour', floorPlans: 'Floor plans', progress: 'Construction progress',
      brochure: 'Brochure', seeUnits: 'See available units', flatsAvailable: '{n} of {total} flats available',
      buildingType: 'Building type', facing: 'Land facing', floors: 'Floors', sqft: 'Square feet',
      frontRoad: 'Front road', bed: 'Bed', bath: 'Bath', balcony: 'Balcony', lift: 'Lift', landArea: 'Land area', flats: 'Flats',
      txnNote: 'Priced in BDT. AED shown for reference at an indicative rate.',
      emptyTitle: 'No matches', download: 'Download', share: 'Share', placeholderPano: 'Placeholder panorama — awaiting Salmon’s Matterport assets',
      neighbourhood: 'Neighbourhood', schools: 'Schools', hospitals: 'Hospitals', transport: 'Transport', markets: 'Markets',
      arrangeVisit: 'Arrange a visit', siteVisit: 'Request a site visit', siteVisitDesc: 'See the building in person with a Salmon representative.',
      virtualWalk: 'Guided virtual walkthrough', virtualWalkDesc: 'A screen-shared tour from Dhaka — ideal from abroad.'
    },
    bn: {
      explore: 'অন্বেষণ', list: 'তালিকা', map: 'মানচিত্র', filters: 'ফিল্টার', clearAll: 'সব মুছুন',
      showing: '{total}টির মধ্যে {n}টি প্রকল্প দেখাচ্ছে', available: 'খালি', reserved: 'সংরক্ষিত',
      booked: 'বুকড', sold: 'বিক্রীত', ongoing: 'চলমান', completed: 'সম্পন্ন', upcoming: 'আসন্ন',
      status: 'প্রকল্পের অবস্থা', location: 'অবস্থান', category: 'সম্পত্তির ধরন', bedrooms: 'শয়নকক্ষ',
      area: 'আয়তন (বর্গফুট)', price: 'মূল্যের পরিসর', availOnly: 'শুধু খালি',
      atAGlance: 'এক নজরে', description: 'বিবরণ', amenities: 'সুবিধাসমূহ', gallery: 'গ্যালারি',
      video: 'ভিডিও', tour: '৩৬০° ট্যুর', floorPlans: 'ফ্লোর প্ল্যান', progress: 'নির্মাণ অগ্রগতি',
      brochure: 'ব্রোশিওর', seeUnits: 'খালি ইউনিট দেখুন', flatsAvailable: '{total}টির মধ্যে {n}টি ফ্ল্যাট খালি',
      buildingType: 'ভবনের ধরন', facing: 'জমির মুখ', floors: 'তলা', sqft: 'বর্গফুট',
      frontRoad: 'সামনের রাস্তা', bed: 'বেড', bath: 'বাথ', balcony: 'বারান্দা', lift: 'লিফট', landArea: 'জমির পরিমাণ', flats: 'ফ্ল্যাট',
      txnNote: 'মূল্য বিডিটি-তে। এইডি নির্দেশক হারে শুধু রেফারেন্সের জন্য।',
      emptyTitle: 'কোনো মিল নেই', download: 'ডাউনলোড', share: 'শেয়ার', placeholderPano: 'প্লেসহোল্ডার প্যানোরামা — স্যামনের ম্যাটারপোর্ট অ্যাসেটের অপেক্ষায়',
      neighbourhood: 'আশপাশ', schools: 'স্কুল', hospitals: 'হাসপাতাল', transport: 'পরিবহন', markets: 'বাজার',
      arrangeVisit: 'ভিজিটের ব্যবস্থা করুন', siteVisit: 'সাইট ভিজিটের অনুরোধ', siteVisitDesc: 'স্যামন প্রতিনিধির সাথে সরাসরি ভবনটি দেখুন।',
      virtualWalk: 'গাইডেড ভার্চুয়াল ওয়াকথ্রু', virtualWalkDesc: 'ঢাকা থেকে স্ক্রিন-শেয়ার ট্যুর — বিদেশ থেকে আদর্শ।'
    }
  };

  root.SALMON = {
    projects: P,
    areas: AREA,
    strings: STRINGS,
    categories: [
      { key: 'apartment', en: 'Apartment / flat', bn: 'অ্যাপার্টমেন্ট / ফ্ল্যাট' },
      { key: 'commercial', en: 'Commercial space', bn: 'বাণিজ্যিক স্থান' },
      { key: 'shop', en: 'Shop', bn: 'দোকান' },
      { key: 'land', en: 'Land / plot share', bn: 'জমি / প্লট শেয়ার' },
      { key: 'hospitality', en: 'Hospital / hotel share', bn: 'হাসপাতাল / হোটেল শেয়ার' }
    ],
    // Rezaul's reference query (used to validate the filter pipeline):
    // ongoing · Basundhara · apartment · 3 bed · 1400–1800 sqft · < AED 750,000 · available only  -> expect: The ROSSA
    sampleQuery: { status: 'ongoing', area: 'basundhara', category: 'apartment', bed: 3, sqftMin: 1400, sqftMax: 1800, maxAed: 750000, availableOnly: true }
  };
})(window);
