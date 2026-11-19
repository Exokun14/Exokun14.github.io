// Kanji hover: after a short dwell the glyph ripples like a pond surface and its
// English meaning surfaces below it as a wavering reflection that settles.
// Mouse: hover. Touch/pen: tap a kanji (tap it again, tap elsewhere, or scroll to dismiss).
// The kanji stay decorative / aria-hidden.
(() => {
'use strict';
const reduce = false /* OS reduce-motion ignored on purpose */;
const DELAY = 420;                         // dwell before the water answers (ms)

// kanji -> [reading, meaning]
const DICT = {
  '私': ['watashi', 'I · myself'], '地': ['chi', 'land · place'], '業': ['gyō', 'work · craft'],
  '力': ['chikara', 'strength'], '開': ['hiraku', 'open'], '流': ['nagare', 'flow'],
  '旅': ['tabi', 'journey'], '道': ['michi', 'the way'], '技': ['waza', 'skill'],
  '学': ['manabu', 'learning'], '遊': ['asobu', 'play'], '径': ['komichi', 'footpath'],
  '随筆': ['zuihitsu', 'essays · “following the brush”'], '聴': ['kiku', 'listen'],
  '簡': ['kan', 'simple · brief'], '主': ['nushi', 'owner · master'], '筆': ['fude', 'brush · writing'],
  '壱': ['ichi', 'one'], '弐': ['ni', 'two'], '参': ['san', 'three'], '肆': ['shi', 'four'],
  '伍': ['go', 'five'], '陸': ['roku', 'six'], '漆': ['shichi', 'seven'], '捌': ['hachi', 'eight'],
  '玖': ['kyū', 'nine'], '拾': ['jū', 'ten']
};
const NUM = ['壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖', '拾'];

// kind: 'tile' = real hover target, 'decor' = pointer-events:none glyph (hit-tested by box)
const SEL = [['.ab-k, .nx-num, .nx-ol li a b', 'tile'], ['.ab-vert, .nx-vert, .nx-ink, .ab-wm', 'decor']];

// Chapter watermarks were a ::before; make them real nodes so they can be hit-tested.
document.querySelectorAll('.ab-ch[data-k]').forEach(s => {
  const i = document.createElement('i');
  i.className = 'ab-wm'; i.setAttribute('aria-hidden', 'true'); i.textContent = s.dataset.k;
  s.prepend(i);
});

// ---- water filters (one for the glyph, one for the label) ----
const NS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
svg.setAttribute('aria-hidden', 'true'); svg.style.position = 'absolute';
svg.innerHTML = ['kjGlyph', 'kjLabel'].map(id =>
  `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
     <feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="4" result="n"/>
     <feDisplacementMap in="SourceGraphic" in2="n" scale="0"/></filter>`).join('');
document.body.appendChild(svg);
const fx = id => {
  const f = svg.querySelector('#' + id);
  return { t: f.querySelector('feTurbulence'), d: f.querySelector('feDisplacementMap') };
};
const FG = fx('kjGlyph'), FL = fx('kjLabel');

// ---- floating label ----
const tip = document.createElement('div');
tip.className = 'kj-tip'; tip.setAttribute('aria-hidden', 'true');
const card = '<span class="kj-read"></span><span class="kj-word"></span>';
// second card is the mirror image on the water
tip.innerHTML = `<div class="kj-card">${card}</div><div class="kj-card kj-refl">${card}</div>`;
document.body.appendChild(tip);
const wordEls = tip.querySelectorAll('.kj-word'), readEls = tip.querySelectorAll('.kj-read');

let cur = null, armed = null, timer = 0, raf = 0, t0 = 0, state = 'idle', mx = 0, my = 0, ptick = 0;

// Optional override on any element: data-read="..." data-mean="..."
const lookup = el => el.dataset.mean
  ? [el.dataset.read || '', el.dataset.mean]
  : DICT[(el.textContent || '').trim()] || null;

// "Real text" test so watermarks don't fire while you read prose on top of them
const overText = (x, y) => {
  const t = document.elementFromPoint(x, y);
  if (!t) return false;
  if (t.closest('a, button, input, textarea, .nx-ol')) return true;
  return [...t.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
};

const hit = (x, y) => {
  for (const [sel, kind] of SEL) {
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom || !r.width) continue;
      if (kind === 'tile') return { el, r, big: false };
      if (!overText(x, y)) return { el, r, big: r.height > 150 };
    }
  }
  // CSS-counter numerals on the "How I work" list (::before squares, not real nodes)
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  for (const ul of document.querySelectorAll('.ab-way')) {
    const lis = [...ul.children];
    for (let i = 0; i < lis.length; i++) {
      const r = lis[i].getBoundingClientRect();
      const box = { left: r.left, right: r.left + 2.4 * rem, top: r.top + 1.35 * rem, bottom: r.top + 3.75 * rem };
      if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom && NUM[i])
        return { el: lis[i], r: { ...box, width: box.right - box.left, height: box.bottom - box.top }, big: false, ch: NUM[i] };
    }
  }
  return null;
};

// ---- animation of the displacement scale (ripple in, sway, settle out) ----
const set = (f, scale, time) => {
  const w = Math.sin(time / 900) * .004;
  f.t.setAttribute('baseFrequency', `${(.012 + w).toFixed(4)} ${(.03 - w).toFixed(4)}`);
  f.d.setAttribute('scale', scale.toFixed(2));
};
const ease = p => 1 - Math.pow(1 - p, 3);
const frame = now => {
  raf = 0;
  const t = now - t0;
  if (state === 'in') {
    const p = Math.min(1, t / 1100);
    // surge then relax to a gentle sway
    set(FG, 22 * Math.sin(Math.PI * Math.min(1, p * 1.6)) * (1 - p * .5) + 5 * ease(p), now);
    set(FL, 16 * (1 - ease(p)), now);
    if (p === 1) state = 'hold';
  } else if (state === 'hold') {
    set(FG, 4.5 + Math.sin(now / 700) * 1.6, now);
    set(FL, 0, now);
  } else if (state === 'out') {
    const p = Math.min(1, t / 600);
    set(FG, 5 * (1 - ease(p)), now);
    if (p === 1) { state = 'idle'; if (cur) { cur.style.filter = cur._f || ''; cur.classList.remove('kj-on'); cur = null; } return; }
  }
  raf = requestAnimationFrame(frame);
};

const ring = (x, y, delay) => {
  const r = document.createElement('i');
  r.className = 'kj-ring'; r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.animationDelay = delay + 'ms';
  document.body.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
};

const open = h => {
  const info = h.ch ? [DICT[h.ch][0], DICT[h.ch][1]] : lookup(h.el);
  if (!info) return;
  if (cur && cur !== h.el) close(true);
  cur = h.el;
  if (!h.ch && !cur.classList.contains('kj-on')) {
    cur._f = cur.style.filter;
    const base = getComputedStyle(cur).filter;
    cur.style.filter = (base && base !== 'none' ? base + ' ' : '') + 'url(#kjGlyph)';
    cur.classList.add('kj-on');
  }
  readEls.forEach(e => { e.textContent = info[0]; });
  wordEls.forEach(e => { e.textContent = info[1]; });
  // anchor: big glyphs answer at the pointer, small ones under the glyph
  const ox = h.big ? mx : h.r.left + h.r.width / 2;
  const oy = h.big ? my : h.r.top + h.r.height / 2;
  tip.style.cssText = 'left:0;top:0;visibility:hidden';
  tip.classList.remove('kj-show');
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = Math.min(Math.max(8, ox - tw / 2), innerWidth - tw - 8);
  let y = h.big ? my + 26 : h.r.bottom + 12;
  if (y + th * 1.7 > innerHeight) y = Math.max(8, (h.big ? my - 26 : h.r.top - 12) - th);
  tip.style.cssText = `left:${x}px;top:${y}px;--ox:${(ox - x).toFixed(0)}px`;
  void tip.offsetWidth;
  tip.classList.add('kj-show');
  if (!reduce) { ring(ox, oy, 0); ring(ox, oy, 220); ring(ox, oy, 440); }
  state = 'in'; t0 = performance.now();
  if (reduce) { set(FG, 0, 0); set(FL, 0, 0); state = 'hold'; }
  else if (!raf) raf = requestAnimationFrame(frame);
};

const close = instant => {
  tip.classList.remove('kj-show');
  if (!cur) return;
  if (instant || reduce) {
    cur.style.filter = cur._f || ''; cur.classList.remove('kj-on'); cur = null; state = 'idle';
    set(FG, 0, 0); set(FL, 0, 0);
    return;
  }
  state = 'out'; t0 = performance.now();
  if (!raf) raf = requestAnimationFrame(frame);
};

const sameTarget = (a, b) => a && b && a.el === b.el && (a.ch || '') === (b.ch || '');

const probe = () => {
  ptick = 0;
  const h = hit(mx, my);
  if (sameTarget(h, armed)) return;              // still on the same glyph; keep dwelling
  clearTimeout(timer); armed = h;
  if (!h) { if (cur) close(); return; }
  if (cur && sameTarget({ el: cur, ch: h.ch }, h)) return;   // already open here
  timer = setTimeout(() => { if (armed) open(armed); }, DELAY);
};

let lastTouch = 0;                                      // taps also fire compat mouse events; ignore them
const move = e => {
  if (e.pointerType === 'touch' || e.pointerType === 'pen' || Date.now() - lastTouch < 800) return;
  mx = e.clientX; my = e.clientY;
  if (!ptick) ptick = requestAnimationFrame(probe);
};
addEventListener('pointermove', move, { passive: true, capture: true });
addEventListener('mousemove', move, { passive: true, capture: true });   // fallback

// ---- touch / pen: tap to open, tap again or elsewhere to close ----
let down = null, hideT = 0;
addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') lastTouch = Date.now(); down = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY }; }, { passive: true });
addEventListener('pointerup', e => {
  if (e.pointerType === 'mouse' || !down) return;
  lastTouch = Date.now();
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10;
  down = null;
  if (moved) return;                                   // it was a scroll/drag
  mx = e.clientX; my = e.clientY;
  clearTimeout(hideT); clearTimeout(timer);
  const h = hit(mx, my);
  if (h && h.el.matches('.nx-ol li a b')) return;      // those are links; let the tap navigate
  const again = h && cur && sameTarget({ el: cur, ch: h.ch }, h);
  if (cur) close();
  armed = null;
  if (!h || again) return;
  armed = h;
  open(h);
  hideT = setTimeout(() => { armed = null; close(); }, 4500);
}, { passive: true });

document.addEventListener('pointerleave', e => { if (e.pointerType === 'touch') return; clearTimeout(timer); armed = null; close(); });
addEventListener('scroll', () => { if (armed || cur) { clearTimeout(timer); clearTimeout(hideT); armed = null; close(true); } }, { passive: true });
addEventListener('blur', () => { clearTimeout(timer); armed = null; close(true); });
})();
