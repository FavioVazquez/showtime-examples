/* roadmap bar: reads VIDEO time (its clip starts at 0). Enters on "Four", each step lights on its scene's first frame,
 * leaves with its clip at the end card. Times come from the element's data attributes. Pure function of t. */
(function () {
  'use strict';
  var el = document.getElementById('roadmap');
  if (!el) return;
  var ENTER = parseFloat(el.dataset.enter), STEPS = el.dataset.steps.split(',').map(parseFloat);
  var items = el.querySelectorAll('.st-roadmap-step');
  ST.onSeek(function (t) {
    var k = ST.progress(t, ENTER, ENTER + 0.5, ST.ease.outCubic);
    el.style.opacity = k.toFixed(3);
    el.style.filter = k < 1 ? 'blur(' + ((1 - k) * 8).toFixed(2) + 'px)' : 'none';   // no slide or scale: text stays 32 px and clear of the edge
    for (var i = 0; i < items.length; i++) {
      var on = ST.progress(t, STEPS[i], STEPS[i] + 0.4, ST.ease.outCubic);
      var off = i + 1 < STEPS.length ? ST.progress(t, STEPS[i + 1], STEPS[i + 1] + 0.4, ST.ease.outCubic) : 0;
      var lit = on * (1 - off);
      items[i].style.setProperty('--lit', lit.toFixed(3));
      items[i].classList.toggle('is-lit', lit >= 0.5);
      items[i].classList.toggle('is-done', off >= 0.5);
    }
  });
})();
