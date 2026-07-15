/* ============================================================================
 * Salmon Developers — dual-currency model
 * ----------------------------------------------------------------------------
 * HARD RULE (CLAUDE.md §9 + Act 2 brief): every flat is priced in BDT. That is
 * the real price. The display-currency figure (AED for Rezaul) is a convenience
 * shown alongside it — never instead of it, never alone at a moment that matters.
 *
 * The exchange-rate SOURCE and ROUNDING POLICY are undefined by the client.
 * The rate + rounding here are PLACEHOLDERS (see OPEN_QUESTIONS.md). Filters run
 * on the converted value, but the record never loses BDT.
 * ==========================================================================*/
(function (root) {
  'use strict';

  // PLACEHOLDER indicative rate. 1 BDT -> AED. Confirm source + as-of + rounding.
  var RATE = { BDT: 1, AED: 0.0362, USD: 0.0083, GBP: 0.0065 };
  var SYMBOL = { BDT: '৳', AED: 'AED', USD: '$', GBP: '£' };
  var RATE_AS_OF = '__PLACEHOLDER'; // e.g. rate feed timestamp — undefined by client

  function toDisplay(amountBdt, cur) {
    var r = RATE[cur] != null ? RATE[cur] : 1;
    // PLACEHOLDER rounding: nearest 1,000 of the display unit. Real policy TBD.
    return Math.round((amountBdt * r) / 1000) * 1000;
  }
  function fromDisplayToBdt(amountDisplay, cur) {
    var r = RATE[cur] != null ? RATE[cur] : 1;
    return Math.round(amountDisplay / r);
  }
  function groupBn(s, lang) {
    // Indian grouping for BDT (lakh/crore) reads naturally for this audience.
    return s;
  }
  function fmtBdt(n) {
    // Indian digit grouping: 1,23,45,678
    var x = String(Math.round(n));
    var last3 = x.slice(-3), rest = x.slice(0, -3);
    if (rest) rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return '৳ ' + (rest ? rest + ',' + last3 : last3);
  }
  function fmtDisplay(n, cur) {
    if (cur === 'BDT') return fmtBdt(n);
    return SYMBOL[cur] + ' ' + Math.round(n).toLocaleString('en-US');
  }

  /* Returns a dual-currency price record for a project.price object.
     Shape (per brief): { amountBdt, displayAmount, displayCurrency, rateUsed, rateAsOf }.
     For a range, returns from/to for both currencies. */
  function priceModel(price, cur) {
    cur = cur || 'AED';
    if (!price) return null;
    var bFrom = price.amountBdtFrom, bTo = price.amountBdtTo;
    return {
      displayCurrency: cur, rateUsed: RATE[cur], rateAsOf: RATE_AS_OF, __PLACEHOLDER: !!price.__PLACEHOLDER,
      bdtFrom: bFrom, bdtTo: bTo,
      dispFrom: toDisplay(bFrom, cur), dispTo: toDisplay(bTo, cur),
      // The mandatory dual label. Display currency prominent, BDT alongside — always.
      labelFrom: fmtDisplay(toDisplay(bFrom, cur), cur) + '  ·  ' + fmtBdt(bFrom),
      labelTo:   fmtDisplay(toDisplay(bTo, cur), cur) + '  ·  ' + fmtBdt(bTo),
      // convenience combined range string
      range: (bFrom === bTo)
        ? fmtDisplay(toDisplay(bFrom, cur), cur) + '  ·  ' + fmtBdt(bFrom)
        : fmtDisplay(toDisplay(bFrom, cur), cur) + '–' + fmtDisplay(toDisplay(bTo, cur), cur) + '  ·  ' + fmtBdt(bFrom) + '–' + fmtBdt(bTo)
    };
  }

  root.Currency = {
    RATE: RATE, SYMBOL: SYMBOL, RATE_AS_OF: RATE_AS_OF,
    toDisplay: toDisplay, fromDisplayToBdt: fromDisplayToBdt,
    fmtBdt: fmtBdt, fmtDisplay: fmtDisplay, priceModel: priceModel
  };
})(window);
