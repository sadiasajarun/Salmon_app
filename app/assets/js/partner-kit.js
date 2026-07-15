/* ============================================================================
 * Salmon Developers — partner sales-kit content + gating (Act 4)
 * ----------------------------------------------------------------------------
 * Gating is SERVER-SIDE. This module MODELS what the backend would return for
 * THIS partner (rank/program), and the UI only reflects it: locked items are
 * shown "locked-with-reason", never hidden silently, and there is NO client-side
 * unlock. Which content is gated, by which attribute, is UNDEFINED by the client
 * (OPEN_QUESTIONS) — the rank/program rules here are placeholders.
 *
 * Downloaded material is remembered so it can be shown offline (media only —
 * never money/records).
 * ==========================================================================*/
(function (root) {
  'use strict';
  var DL_KEY = 'salmon_kit_downloads';

  var CATS = [
    { key: 'brochures',    en: 'Brochures',            bn: 'ব্রোশিওর',              icon: '📄' },
    { key: 'layouts',      en: 'Layouts / floor plans', bn: 'লেআউট / ফ্লোর প্ল্যান', icon: '⌗' },
    { key: 'images',       en: 'Images',               bn: 'ছবি',                   icon: '🖼' },
    { key: 'videos',       en: 'Videos',               bn: 'ভিডিও',                 icon: '▶' },
    { key: 'scripts',      en: 'Sales scripts',        bn: 'সেলস স্ক্রিপ্ট',        icon: '📝' },
    { key: 'presentations',en: 'Presentations',        bn: 'প্রেজেন্টেশন',          icon: '📊' }
  ];

  function itemsFor(project) {
    var slug = project.slug, name = project.name, items = [];
    if (project.brochure)
      items.push({ id: slug + '-broch', cat: 'brochures', en: name + ' brochure', bn: name + ' ব্রোশিওর', size: project.brochureSize || '2.4 MB', type: 'pdf', url: project.brochure });
    items.push({ id: slug + '-floor',  cat: 'layouts', en: 'Floor plans', bn: 'ফ্লোর প্ল্যান', size: '1.1 MB', type: 'image', link: '../client/floor-plan.page.html?slug=' + slug });
    items.push({ id: slug + '-img',    cat: 'images',  en: 'Gallery pack', bn: 'গ্যালারি প্যাক', size: '8.6 MB', type: 'images', link: '../client/project-gallery.page.html?slug=' + slug });
    if (project.youtube)
      items.push({ id: slug + '-vid', cat: 'videos', en: 'Intro video', bn: 'ইন্ট্রো ভিডিও', size: 'stream', type: 'video', link: '../client/video.page.html?slug=' + slug });
    items.push({ id: slug + '-script', cat: 'scripts', en: 'Basic pitch script', bn: 'বেসিক পিচ স্ক্রিপ্ট', size: '0.3 MB', type: 'pdf' });
    // --- gated (placeholder rules) ---
    items.push({ id: slug + '-deck', cat: 'presentations', en: 'Premium pitch deck', bn: 'প্রিমিয়াম পিচ ডেক', size: '12 MB', type: 'pdf', gate: { by: 'rank', need: 'gold' } });
    items.push({ id: slug + '-winv', cat: 'scripts', en: 'With-Investment brief', bn: 'উইথ-ইনভেস্টমেন্ট ব্রিফ', size: '0.6 MB', type: 'pdf', gate: { by: 'program', need: 'withInvestment' } });
    return items;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function rankOrder(r) { return { silver: 1, gold: 2, platinum: 3 }[r] || 0; }

  // Reflects the backend's decision for this partner. Returns {locked, en, bn}.
  function lockState(item, partner) {
    if (!item.gate) return { locked: false };
    var g = item.gate;
    if (g.by === 'rank' && rankOrder(partner.identity.rank) < rankOrder(g.need))
      return { locked: true, en: 'Available to ' + cap(g.need) + ' partners', bn: cap(g.need) + ' পার্টনারদের জন্য' };
    if (g.by === 'program' && partner.identity.programs.indexOf(g.need) < 0)
      return { locked: true, en: 'With-Investment partners only', bn: 'শুধু উইথ-ইনভেস্টমেন্ট পার্টনার' };
    if (g.by === 'territory' && g.need !== partner.territoryKey)
      return { locked: true, en: 'Available in another territory', bn: 'অন্য টেরিটরির জন্য' };
    return { locked: false };
  }

  // Downloaded (offline-available) set
  function downloads() { try { return JSON.parse(localStorage.getItem(DL_KEY)) || {}; } catch (e) { return {}; } }
  function isDownloaded(id) { return !!downloads()[id]; }
  function setDownloaded(id, v) { var d = downloads(); if (v) d[id] = 1; else delete d[id]; try { localStorage.setItem(DL_KEY, JSON.stringify(d)); } catch (e) {} }

  root.PartnerKit = { CATS: CATS, itemsFor: itemsFor, lockState: lockState, isDownloaded: isDownloaded, setDownloaded: setDownloaded };
})(window);
