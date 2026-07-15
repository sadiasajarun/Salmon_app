/* ============================================================================
 * Salmon Developers — dev network simulator (Fast / Slow 3G / Flaky / Offline)
 * ----------------------------------------------------------------------------
 * Injects a floating toolbar + a page banner. Every screen that includes this
 * becomes reviewable under each condition.
 *
 * ACCEPTANCE TEST (Act 5/6 brief): payment & booking actions must be blocked
 * when offline — NEVER cached, NEVER optimistic, NEVER silently retried. Money
 * screens call NetSim.blockPay() and refuse to proceed. Media may degrade;
 * money may not.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var KEY = 'salmon_net';
  var LABEL = { fast: 'Fast', slow3g: 'Slow 3G', flaky: 'Flaky', offline: 'Offline' };

  function get() { try { return localStorage.getItem(KEY) || 'fast'; } catch (e) { return 'fast'; } }
  function set(c) { try { localStorage.setItem(KEY, c); } catch (e) {} paint(); document.dispatchEvent(new CustomEvent('netchange', { detail: c })); }
  function isOffline() { return get() === 'offline'; }
  function isFlaky() { return get() === 'flaky'; }
  function latency() { return { fast: 0, slow3g: 1800, flaky: 1000, offline: 0 }[get()] || 0; }
  function willFail() { var c = get(); if (c === 'offline') return true; if (c === 'flaky') return Math.random() < 0.45; return false; }

  // Load an image honoring the current condition (delay + possible failure).
  // MEDIA ONLY — never use this path for money/booking data.
  function loadImg(img, src) {
    var wrap = img.parentNode;
    if (wrap && wrap.classList) wrap.classList.add('skel');
    setTimeout(function () {
      if (willFail()) { if (wrap && wrap.classList) wrap.classList.remove('skel'); img.dispatchEvent(new Event('error')); return; }
      img.onload = function () { img.classList.add('on'); if (wrap && wrap.classList) wrap.classList.remove('skel'); };
      img.src = src;
    }, latency());
  }

  // Absolute payment block. Returns false if offline (caller must abort).
  function requireOnline() { return !isOffline(); }
  function blockPay(msg) {
    var b = document.getElementById('payblock');
    if (!b) { b = document.createElement('div'); b.id = 'payblock'; document.body.appendChild(b); }
    b.textContent = msg || 'You need a connection to pay. Nothing has been charged.';
    b.className = 'show';
    clearTimeout(b._t); b._t = setTimeout(function () { b.className = ''; }, 4000);
  }

  function paint() {
    var bar = document.getElementById('netsim');
    if (!bar) { bar = document.createElement('div'); bar.id = 'netsim'; document.body.appendChild(bar); }
    var c = get();
    bar.innerHTML = '<span class="ns-l">Net</span>' + ['fast', 'slow3g', 'flaky', 'offline'].map(function (k) {
      return '<button class="' + (c === k ? 'on' : '') + '" data-k="' + k + '">' + LABEL[k] + '</button>';
    }).join('');
    Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) { b.onclick = function () { set(b.dataset.k); }; });
    var ban = document.getElementById('netban');
    if (c !== 'fast') {
      if (!ban) { ban = document.createElement('div'); ban.id = 'netban'; document.body.insertBefore(ban, document.body.firstChild); }
      ban.className = 'show ' + c;
      ban.textContent = c === 'offline' ? 'You’re offline. Content you’ve viewed stays readable; payment & booking are blocked.'
        : c === 'flaky' ? 'Weak connection — media may be slow or fail. Payment integrity is unaffected.'
        : 'Slow connection — media loading may take a while.';
    } else if (ban) { ban.className = ''; ban.textContent = ''; }
  }

  root.NetSim = { get: get, set: set, isOffline: isOffline, isFlaky: isFlaky, latency: latency, willFail: willFail, loadImg: loadImg, requireOnline: requireOnline, blockPay: blockPay };

  var css = document.createElement('style');
  css.textContent =
    '#netsim{position:fixed;right:12px;bottom:12px;z-index:9999;background:#1c2733;color:#cfe0ef;border-radius:12px;padding:8px 10px;display:flex;gap:6px;align-items:center;font:12px system-ui}' +
    '#netsim .ns-l{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#7fa0bd;margin-right:2px}' +
    '#netsim button{border:1px solid #35485c;background:#243545;color:#cfe0ef;border-radius:999px;padding:5px 9px;font-size:11px;cursor:pointer}' +
    '#netsim button.on{background:#2f6fed;border-color:#2f6fed;color:#fff}' +
    '#netban{display:none}#netban.show{display:block;text-align:center;font:12px/1.4 system-ui;padding:8px 12px;color:#fff}' +
    '#netban.offline{background:#8a2b30}#netban.slow3g,#netban.flaky{background:#8a6414}' +
    '#payblock{display:none}#payblock.show{display:block;position:fixed;left:50%;bottom:66px;transform:translateX(-50%);z-index:9999;background:#8a2b30;color:#fff;font:13px/1.4 system-ui;font-weight:600;padding:11px 16px;border-radius:12px;max-width:340px;text-align:center;box-shadow:0 8px 24px #0005}';
  function init() { document.head.appendChild(css); paint(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window);
