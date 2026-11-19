// Chain scrollbar. The native bar is hidden and replaced by a chain with a seal that slides down it.
// Wheel, touch and keyboard scrolling still work as normal. Drag the strip on the right edge to scrub.
(() => {
'use strict';
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const SEAL_H = 27, PAD_TOP = 8, PAD_BOT = 8;       // px
root.classList.add('has-chain');

const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('class', 'chain'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '18');
svg.innerHTML = `<defs>
  <pattern id="chain-tile" width="18" height="28" patternUnits="userSpaceOnUse">
    <rect x="3.5" y="1" width="11" height="22" rx="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <rect x="7.4" y="14" width="3.2" height="22" rx="1.6" fill="currentColor"/>
    <rect x="7.4" y="-14" width="3.2" height="22" rx="1.6" fill="currentColor"/>
  </pattern>
  <clipPath id="chain-clip"><rect id="chain-cut" x="0" y="0" width="18" height="0"/></clipPath>
</defs>
<rect class="ghost" x="0" y="0" width="18" height="100%" fill="url(#chain-tile)"/>
<rect x="0" y="0" width="18" height="100%" fill="url(#chain-tile)" clip-path="url(#chain-clip)"/>`;
const hit = document.createElement('div'); hit.className = 'chain-hit'; hit.setAttribute('aria-hidden', 'true');
const seal = document.createElement('i'); seal.className = 'chain-seal'; seal.setAttribute('aria-hidden', 'true'); seal.textContent = 'C';
document.body.append(svg, hit, seal);
const cut = svg.querySelector('#chain-cut');

let max = 0, vh = 0, lastY = scrollY, angle = 0, av = 0, raf = 0;
const measure = () => {
  vh = innerHeight;
  max = Math.max(0, root.scrollHeight - vh);
  root.classList.toggle('can-scroll', max > 8);
};
const place = () => {
  const y = scrollY, p = max ? Math.min(1, Math.max(0, y / max)) : 0;
  const top = PAD_TOP + p * (vh - PAD_TOP - PAD_BOT - SEAL_H);
  cut.setAttribute('height', top + 4);
  seal.style.top = top + 'px';
  seal.style.transform = `rotate(${angle.toFixed(2)}deg)`;
};
const step = () => {
  raf = 0;
  const y = scrollY, v = y - lastY; lastY = y;
  if (!reduce) {
    const target = Math.max(-16, Math.min(16, -v * .35));
    av += (target - angle) * .1; av *= .84; angle += av;
  }
  place();
  if (!reduce && (Math.abs(av) > .03 || Math.abs(angle) > .05 || v)) raf = requestAnimationFrame(step);
  else { angle = av = 0; place(); }
};
const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
addEventListener('scroll', kick, { passive: true });
addEventListener('resize', () => { measure(); kick(); });
addEventListener('load', () => { measure(); kick(); });
new ResizeObserver(() => { measure(); kick(); }).observe(document.body);

// Drag to scrub
const scrubTo = clientY => {
  const p = (clientY - PAD_TOP - SEAL_H / 2) / (vh - PAD_TOP - PAD_BOT - SEAL_H);
  scrollTo({ top: Math.min(1, Math.max(0, p)) * max, behavior: 'instant' });
};
hit.addEventListener('pointerdown', e => { hit.setPointerCapture(e.pointerId); hit.classList.add('drag'); scrubTo(e.clientY); e.preventDefault(); });
hit.addEventListener('pointermove', e => { if (hit.hasPointerCapture(e.pointerId)) scrubTo(e.clientY); });
const drop = e => { hit.classList.remove('drag'); if (hit.hasPointerCapture(e.pointerId)) hit.releasePointerCapture(e.pointerId); };
hit.addEventListener('pointerup', drop); hit.addEventListener('pointercancel', drop);

measure(); place(); kick();
})();
