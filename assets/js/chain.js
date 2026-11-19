// Chain scrollbar (kusari). The native bar is hidden. A chain hangs from a scroll-rod finial on the right edge,
// the links turn vermilion as you scroll, and a hanko seal with a silk tassel slides down it.
// Wheel, touch and keyboard scrolling still work as normal. Drag the strip on the right edge to scrub.
(() => {
'use strict';
const root = document.documentElement;
const reduce = false /* OS reduce-motion ignored on purpose */;
const NS = 'http://www.w3.org/2000/svg';
const SEAL_H = 26, TAIL = 36, Y0 = 20, BOT = 10;    // px
root.classList.add('has-chain');

const rail = document.createElement('div'); rail.className = 'chain-rail'; rail.setAttribute('aria-hidden', 'true');
const ticks = document.createElement('div'); ticks.className = 'chain-ticks'; ticks.setAttribute('aria-hidden', 'true');

const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('class', 'chain'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '18');
const tile = (id, paint, extra = '') => `<pattern id="${id}" width="18" height="34" patternUnits="userSpaceOnUse">
  <rect x="3" y="1" width="12" height="22" rx="6" fill="none" style="stroke:${paint}" stroke-width="2.2"/>
  <rect x="7.2" y="16" width="3.6" height="22" rx="1.8" style="fill:${paint}"/>
  <rect x="7.2" y="-18" width="3.6" height="22" rx="1.8" style="fill:${paint}"/>${extra}
</pattern>`;
svg.innerHTML = `<defs>
  <linearGradient id="chain-sheen" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" style="stop-color:var(--lit)"/>
    <stop offset=".42" style="stop-color:color-mix(in srgb,var(--lit) 55%,#fff)"/>
    <stop offset="1" style="stop-color:var(--lit)"/>
  </linearGradient>
  ${tile('chain-ghost', 'var(--ink)')}
  ${tile('chain-lit', 'url(#chain-sheen)')}
  <clipPath id="chain-clip"><rect id="chain-cut" x="0" y="0" width="18" height="0"/></clipPath>
</defs>
<rect class="ghost" x="0" y="5" width="18" height="100%" fill="url(#chain-ghost)"/>
<rect x="0" y="5" width="18" height="100%" fill="url(#chain-lit)" clip-path="url(#chain-clip)"/>
<rect x="3" y="0" width="12" height="6" rx="2.5" style="fill:var(--ink)"/>
<rect x="5.5" y="2" width="7" height="1" rx=".5" style="fill:var(--bg)" opacity=".55"/>`;

const hit = document.createElement('div'); hit.className = 'chain-hit'; hit.setAttribute('aria-hidden', 'true');
const seal = document.createElement('i'); seal.className = 'chain-seal'; seal.setAttribute('aria-hidden', 'true');
seal.innerHTML = `<span>C</span><b class="chain-tassel"><svg width="14" height="36" viewBox="0 0 14 36">
  <path d="M7 0v5" style="stroke:var(--seal)" stroke-width="1.4" fill="none"/>
  <rect x="4.5" y="4" width="5" height="6" rx="2.2" style="fill:var(--seal)"/>
  <path d="M5 10h4" style="stroke:var(--bg)" stroke-width=".8" opacity=".7"/>
  <g style="stroke:var(--seal)" stroke-width=".9" fill="none" stroke-linecap="round">
    <path d="M5.2 10Q3.6 22 2.4 35"/><path d="M6.1 10Q5.4 23 4.8 35"/><path d="M7 10V36"/>
    <path d="M7.9 10Q8.6 23 9.2 35"/><path d="M8.8 10Q10.4 22 11.6 35"/>
  </g></svg></b>`;
document.body.append(rail, ticks, svg, hit, seal);
const cut = svg.querySelector('#chain-cut');
const tassel = seal.querySelector('.chain-tassel');

let max = 0, vh = 0, lastY = scrollY, angle = 0, av = 0, ta = 0, tv = 0, raf = 0, lastPetal = 0, petals = 0;
let marks = [];
const track = () => Math.max(1, vh - TAIL - BOT - SEAL_H - Y0);

const measure = () => {
  vh = innerHeight;
  max = Math.max(0, root.scrollHeight - vh);
  root.classList.toggle('can-scroll', max > 8);
  ticks.textContent = ''; marks = [];
  if (max <= 8) return;
  let lastP = 0;
  document.querySelectorAll('main section, body > section').forEach(s => {
    const r = s.getBoundingClientRect(), p = Math.min(1, Math.max(0, (r.top + scrollY) / max));
    if (p < .03 || p > .985 || p - lastP < .035) return;
    lastP = p;
    const t = document.createElement('i');
    t.style.top = (Y0 + p * track() + SEAL_H / 2) + 'px';
    ticks.append(t); marks.push({ p, t, on: false });
  });
};

const petal = (dir) => {
  if (reduce || petals > 12) return;
  petals++;
  const r = seal.getBoundingClientRect(), el = document.createElement('i');
  el.className = 'chain-petal';
  el.style.left = (r.left + r.width / 2 - 4) + 'px'; el.style.top = (r.bottom - 4) + 'px';
  document.body.append(el);
  const dx = -(26 + Math.random() * 90), dy = 70 + Math.random() * 130, rot = (Math.random() - .5) * 540;
  const a = el.animate([
    { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
    { transform: `translate(${dx * .35}px,${dy * .3}px) rotate(${rot * .3}deg)`, opacity: .95, offset: .15 },
    { transform: `translate(${dx * .8}px,${dy * .6 * dir}px) rotate(${rot * .7}deg)`, opacity: .9, offset: .6 },
    { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity: 0 }
  ], { duration: 1700 + Math.random() * 1200, easing: 'cubic-bezier(.3,.1,.4,1)' });
  a.onfinish = a.oncancel = () => { el.remove(); petals--; };
};

const place = () => {
  const y = scrollY, p = max ? Math.min(1, Math.max(0, y / max)) : 0;
  const top = Y0 + p * track();
  cut.setAttribute('height', top + 4);
  seal.style.top = top + 'px';
  seal.style.transform = `rotate(${angle.toFixed(2)}deg)`;
  tassel.style.transform = `rotate(${(ta - angle).toFixed(2)}deg)`;
  for (const m of marks) { const on = p >= m.p - .002; if (on !== m.on) { m.on = on; m.t.classList.toggle('on', on); } }
};
const step = (now) => {
  raf = 0;
  const y = scrollY, v = y - lastY; lastY = y;
  if (!reduce) {
    const target = Math.max(-16, Math.min(16, -v * .35));
    av += (target - angle) * .1; av *= .84; angle += av;
    tv += (angle - ta) * .05; tv *= .9; ta += tv;
    if (Math.abs(v) > 22 && now - lastPetal > 150) { lastPetal = now; petal(v > 0 ? 1 : .6); }
  }
  place();
  const moving = Math.abs(av) > .03 || Math.abs(angle) > .05 || Math.abs(tv) > .02 || Math.abs(ta) > .05;
  if (!reduce && (moving || v)) raf = requestAnimationFrame(step);
  else { angle = av = ta = tv = 0; place(); }
};
const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
addEventListener('scroll', kick, { passive: true });
addEventListener('resize', () => { measure(); kick(); });
addEventListener('load', () => { measure(); kick(); });
new ResizeObserver(() => { measure(); kick(); }).observe(document.body);

// Drag to scrub
const scrubTo = clientY => {
  const p = (clientY - Y0 - SEAL_H / 2) / track();
  scrollTo({ top: Math.min(1, Math.max(0, p)) * max, behavior: 'instant' });
};
hit.addEventListener('pointerdown', e => { hit.setPointerCapture(e.pointerId); hit.classList.add('drag'); scrubTo(e.clientY); e.preventDefault(); });
hit.addEventListener('pointermove', e => { if (hit.hasPointerCapture(e.pointerId)) scrubTo(e.clientY); });
const drop = e => { hit.classList.remove('drag'); if (hit.hasPointerCapture(e.pointerId)) hit.releasePointerCapture(e.pointerId); };
hit.addEventListener('pointerup', drop); hit.addEventListener('pointercancel', drop);

measure(); place(); kick();
})();
