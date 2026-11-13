// Visitor counter (GoatCounter: free, no cookies, no banner needed).
// 1. Sign up at https://www.goatcounter.com and pick a site code.
// 2. Put that code between the quotes below, save, and push.
// 3. See your visits at https://YOURCODE.goatcounter.com
// While the code is empty, nothing is loaded or counted.
(() => {
  const CODE = 'rencejoven';
  if (!CODE || /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://' + CODE + '.goatcounter.com/count';
  document.head.append(s);
})();
