/* ============================================================================
 * Salmon Developers — timezone slot rendering
 * ----------------------------------------------------------------------------
 * Staff work DHAKA hours (Asia/Dhaka, UTC+6, no DST): Sat–Thu 09:00–19:00,
 * Fri 10:00–18:00 (short day). Clients live elsewhere (Dubai −2h, Toronto,
 * Sydney...). Every slot is rendered in the CLIENT's timezone with Dhaka time
 * alongside — the client never does the arithmetic.
 *
 * A day may have NO slots inside the client's waking hours (8am–10pm local) —
 * that's the Dhaka/Gulf working-week mismatch, shown honestly, not hidden.
 * Slot duration / buffer / booking horizon are UNDEFINED (placeholders, logged).
 * ==========================================================================*/
(function (root) {
  'use strict';
  var KEY = 'salmon_client_tz';
  var DHAKA = 'Asia/Dhaka';
  var CLIENT_TZS = [
    { id: 'Asia/Dubai', label: 'Dubai (his home)' },
    { id: 'America/Toronto', label: 'Toronto' },
    { id: 'Australia/Sydney', label: 'Sydney' }
  ];
  // Dhaka office hours by short weekday name. Fri is a short day. (Placeholder: hourly slots, 60-min.)
  var HOURS = { Sun: [9, 19], Mon: [9, 19], Tue: [9, 19], Wed: [9, 19], Thu: [9, 19], Fri: [10, 18], Sat: [9, 19] };
  var WAKE = [8, 22]; // client local waking window

  function getTz() { try { return localStorage.getItem(KEY) || 'Asia/Dubai'; } catch (e) { return 'Asia/Dubai'; } }
  function setTz(t) { try { localStorage.setItem(KEY, t); } catch (e) {} document.dispatchEvent(new CustomEvent('tzchange', { detail: t })); }

  function parts(utcMs, tz) {
    var f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
    var o = {}; f.formatToParts(new Date(utcMs)).forEach(function (p) { o[p.type] = p.value; });
    return o; // {weekday, day, month, hour, minute}
  }
  function label12(utcMs, tz) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(utcMs));
  }
  function dayLabel(utcMs, tz) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(utcMs));
  }

  // Dhaka wall-clock (y,m,d,h) -> UTC ms. Dhaka is UTC+6 fixed.
  function dhakaToUtc(y, mo, d, h) { return Date.UTC(y, mo, d, h - 6, 0, 0); }

  // Build `days` days of availability starting from a fixed anchor (prototype-stable).
  function build(clientTz, days) {
    clientTz = clientTz || getTz(); days = days || 10;
    // anchor: 15 Jul 2026, Dhaka. Stable regardless of the reviewer's clock.
    var base = Date.UTC(2026, 6, 15, 12 - 6, 0, 0); // 12:00 Dhaka on 2026-07-15
    var out = [], anyWaking = false;
    for (var i = 0; i < days; i++) {
      var noonUtc = base + i * 86400000;
      var dp = parts(noonUtc, DHAKA);                 // Dhaka calendar of this day
      var y = 2026, mo = monthIdx(dp.month), d = +dp.day, wd = dp.weekday;
      var hrs = HOURS[wd];
      var slots = [];
      if (hrs) {
        for (var h = hrs[0]; h < hrs[1]; h++) {
          var utc = dhakaToUtc(y, mo, d, h);
          var cp = parts(utc, clientTz);
          var ch = +cp.hour;
          var wake = ch >= WAKE[0] && ch < WAKE[1];
          if (wake) anyWaking = true;
          slots.push({ utcMs: utc, clientLabel: label12(utc, clientTz), dhakaLabel: label12(utc, DHAKA), inWaking: wake });
        }
      }
      var wakingCount = slots.filter(function (s) { return s.inWaking; }).length;
      out.push({
        clientDay: dayLabel(noonUtc, clientTz),
        dhakaWeekday: wd,
        isShort: wd === 'Fri',
        hasWaking: wakingCount > 0,
        wakingCount: wakingCount,
        slots: slots
      });
    }
    return { clientTz: clientTz, days: out, anyWaking: anyWaking };
  }
  function monthIdx(m) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m); }

  root.TZ = { DHAKA: DHAKA, CLIENT_TZS: CLIENT_TZS, getTz: getTz, setTz: setTz, build: build, label12: label12, dayLabel: dayLabel };
})(window);
