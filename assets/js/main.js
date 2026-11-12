(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement, body = document.body;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
// Lighter tier: Save-Data, low core count, or touch
const lite = !!(navigator.connection && navigator.connection.saveData) || (navigator.hardwareConcurrency || 8) < 4 || !fine;
if (lite) root.classList.add('lite');
const meta = n => ($(`meta[name="${n}"]`) || {}).content || '';
const EMAIL = meta('email'), GH = meta('github');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Theme ----------
const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
const sync = () => root.classList.toggle('nm', dark());
sync();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
const toggleTheme = () => {
  root.dataset.theme = dark() ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  sync();
};
$('.theme').addEventListener('click', toggleTheme);

$('#y').textContent = new Date().getFullYear();
$$('.mail').forEach(a => { a.href = 'mailto:' + EMAIL; a.textContent = EMAIL; });

// ---------- Name entrance ----------
const h1 = $('.hero h1');
if (h1) {
  const name = h1.textContent.trim();
  h1.setAttribute('aria-label', name);
  h1.innerHTML = [...name].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c}</span>`).join('');
}

// ---------- Reveals ----------
const cls = t => t.matches('.diagram') ? 'go' : t.matches('.night') ? 'arrived' : 'in';
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add(cls(e.target)); io.unobserve(e.target); }
}), { threshold: .15 });
const watch = el => io.observe(el);
$$('.reveal, .brush, .night').forEach(watch);

// ---------- Diagrams drawn in ink ----------
const diagram = flow => {
  const n = flow.length, w = 150;
  let out = '';
  flow.forEach((t, i) => {
    const x = i * w + 10, d = i * 2;
    out += `<path pathLength="1" style="--i:${d}" d="M${x},28h116v44h-116Z"/><text style="--i:${d}" x="${x + 58}" y="54" text-anchor="middle">${esc(t)}</text>`;
    if (i < n - 1) out += `<path pathLength="1" style="--i:${d + 1}" d="M${x + 120},50H${x + 146}M${x + 139},44L${x + 146},50L${x + 139},56"/>`;
  });
  return `<svg class="diagram" viewBox="0 0 ${n * w} 100" role="img" aria-label="${esc(flow.join(', then '))}">${out}</svg>`;
};
$$('svg.diagram[data-flow]').forEach(s => {
  const d = document.createElement('div');
  d.innerHTML = diagram(s.dataset.flow.split('|'));
  const n = d.firstChild;
  s.replaceWith(n);
  watch(n);
});

// ---------- Seeded ink-wash scenes ----------
const rng = str => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  let a = h;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
};
const ridge = (r, base, amp, n) => {
  const P = Array.from({ length: n + 1 }, (_, i) => [i * 400 / n, base - r() * amp]);
  return `M0,300V${P[0][1].toFixed(0)}` + P.slice(1).map((p, i) =>
    `Q${((P[i][0] + p[0]) / 2).toFixed(0)},${(Math.min(P[i][1], p[1]) - r() * 28).toFixed(0)} ${p[0].toFixed(0)},${p[1].toFixed(0)}`).join('') + 'V300Z';
};
const scene = seed => {
  const r = rng(seed);
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><circle cx="${(110 + r() * 200).toFixed(0)}" cy="${(55 + r() * 50).toFixed(0)}" r="${(26 + r() * 16).toFixed(0)}" style="fill:var(--seal)" opacity=".85" filter="url(#ink2)"/><path style="fill:var(--c3)" opacity=".5" filter="url(#ink2)" d="${ridge(r, 200, 95, 5 + (r() * 3 | 0))}"/><rect y="160" width="400" height="90" style="fill:url(#mistfade)"/><path style="fill:var(--c3)" filter="url(#ink2)" d="${ridge(r, 255, 55, 4 + (r() * 3 | 0))}"/></svg>`;
};
const vars = p => `--c1:${p.palette[0]};--c2:${p.palette[1]};--c3:${p.palette[2]}`;
const art = p => p.image ? `<div class="art shot"><img src="${esc(p.image)}" alt="" loading="lazy"></div>` : `<div class="art">${scene(p.title)}</div>`;
const slideHTML = (p, i, n) => `<article class="slide" aria-label="${i + 1} of ${n}" style="${vars(p)}">${art(p)}<div class="body"><span class="hanko" aria-hidden="true">${esc(p.seal)}</span><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><span class="tech">${esc(p.tech.join(', '))}</span><button class="btn" type="button" data-open="${esc(p.id)}">Open letter</button></div></article>`;
const envHTML = p => `<button class="env" type="button" data-open="${esc(p.id)}" style="${vars(p)}" aria-label="Open the letter about ${esc(p.title)}">${art(p)}<span class="flap"></span><span class="label"><b>${esc(p.title)}</b><small>${esc(p.year)}</small></span><span class="hanko" aria-hidden="true">${esc(p.seal)}</span></button>`;

// ---------- Letters and palette ----------
let lastFocus = null;
const lock = on => { body.style.overflow = on ? 'hidden' : ''; $$('main, .topbar, footer, .hero').forEach(x => { x.inert = on; }); };
const letterWrap = document.createElement('div');
letterWrap.className = 'letter-wrap';
letterWrap.innerHTML = '<article class="letter" role="dialog" aria-modal="true" aria-label="Project letter"><button class="close" type="button" aria-label="Close letter">×</button><div class="lbody"></div></article>';
const pal = document.createElement('div');
pal.className = 'letter-wrap';
pal.innerHTML = '<div class="palette" role="dialog" aria-modal="true" aria-label="Command palette"><input type="text" placeholder="Type a command" aria-label="Command"><ul></ul></div>';
body.append(letterWrap, pal);
const closeAll = () => {
  if (!letterWrap.classList.contains('open') && !pal.classList.contains('open')) return;
  letterWrap.classList.remove('open'); pal.classList.remove('open'); lock(false);
  if (lastFocus) lastFocus.focus();
};
const openLetter = (p, from) => {
  lastFocus = from || document.activeElement;
  const L = $('.letter', letterWrap);
  L.setAttribute('style', vars(p));
  $('.lbody', L).innerHTML = `<span class="hanko" aria-hidden="true">${esc(p.seal)}</span><p class="eyebrow">${esc(p.year)}, ${esc(p.role)}</p><h2>${esc(p.title)}</h2><div class="lart">${art(p)}</div><p class="lead">${esc(p.summary)}</p><p>${esc(p.details)}</p><ul class="tags">${p.tech.map(t => `<li>${esc(t)}</li>`).join('')}</ul><h3>How it fits together</h3><div class="dwrap">${diagram(p.flow)}</div><div class="llinks">${p.links.map(l => `<a href="${esc(l.url)}">${esc(l.label)}</a>`).join('')}</div>`;
  lock(true);
  letterWrap.classList.add('open');
  $('.close', L).focus();
  const dg = $('.diagram', L);
  if (dg) setTimeout(() => dg.classList.add('go'), 700);
};
$('.close', letterWrap).addEventListener('click', closeAll);
[letterWrap, pal].forEach(w => w.addEventListener('click', e => { if (e.target === w) closeAll(); }));

// copy email with a stamp
const toast = document.createElement('div');
toast.className = 'toast'; toast.setAttribute('role', 'status');
body.append(toast);
const copyEmail = async from => {
  try { await navigator.clipboard.writeText(EMAIL); toast.textContent = 'Copied ' + EMAIL; } catch (e) { toast.textContent = EMAIL; }
  toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
  if (from) { from.classList.remove('stamp'); void from.offsetWidth; from.classList.add('stamp'); }
};
$$('.seal-copy').forEach(b => b.addEventListener('click', () => copyEmail(b)));

// ambient sound (off until you switch it on)
const sbtn = $('.sound');
let ac, master, soundOn = false;
const bootSound = () => {
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
  const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380;
  const lfo = ac.createOscillator(); lfo.frequency.value = .07;
  const lg = ac.createGain(); lg.gain.value = 220; lfo.connect(lg); lg.connect(f.frequency);
  const wg = ac.createGain(); wg.gain.value = .5;
  src.connect(f); f.connect(wg); wg.connect(master); src.start(); lfo.start();
  const scale = [293.66, 329.63, 392, 440, 523.25, 587.33];
  setInterval(() => {
    if (!soundOn || Math.random() < .35) return;
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = 'triangle'; o.frequency.value = scale[Math.random() * scale.length | 0];
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.22, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + 2.4);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.5);
  }, 2400);
};
const setSound = v => {
  soundOn = v; sbtn.setAttribute('aria-pressed', v);
  try { localStorage.setItem('sound', v ? '1' : '0'); } catch (e) {}
  if (v) { bootSound(); ac.resume(); master.gain.setTargetAtTime(.35, ac.currentTime, 1.2); }
  else if (master) master.gain.setTargetAtTime(0, ac.currentTime, .4);
};
const toggleSound = () => setSound(!soundOn);
sbtn.addEventListener('click', toggleSound);
let savedSound = false;
try { savedSound = localStorage.getItem('sound') === '1'; } catch (e) {}
if (savedSound) {
  sbtn.setAttribute('aria-pressed', 'true');
  const resume = e => { removeEventListener('pointerdown', resume); if (!e.target.closest('.sound')) setSound(true); };
  addEventListener('pointerdown', resume);
}

// command palette
const actions = [
  ['Home', () => { location.href = 'index.html'; }],
  ['Projects', () => { location.href = 'projects.html'; }],
  ['About', () => { location.href = 'about.html'; }],
  ['Toggle light or dark theme', toggleTheme],
  ['Copy email address', () => copyEmail()],
  ['Open GitHub', () => window.open(GH, '_blank', 'noopener')],
  ['Toggle ambient sound', toggleSound]
];
const pin = $('input', pal), pul = $('ul', pal);
const fill = q => {
  pul.innerHTML = '';
  actions.filter(a => a[0].toLowerCase().includes(q.toLowerCase())).forEach(a => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.textContent = a[0]; b.onclick = () => { closeAll(); a[1](); };
    li.append(b); pul.append(li);
  });
};
const openPal = () => { lastFocus = document.activeElement; fill(''); pin.value = ''; lock(true); pal.classList.add('open'); pin.focus(); };
pin.addEventListener('input', () => fill(pin.value));
pal.addEventListener('keydown', e => {
  const bs = $$('button', pal), i = bs.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); (bs[i + 1] || bs[0]).focus(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); (i > 0 ? bs[i - 1] : pin).focus(); }
  if (e.key === 'Enter' && document.activeElement === pin && bs[0]) bs[0].click();
});
$('.kbd').addEventListener('click', openPal);
addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPal(); }
  if (e.key === 'Escape') closeAll();
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-open]');
  if (b && window.PROJECTS) openLetter(window.PROJECTS.find(p => p.id === b.dataset.open), b);
});

// ---------- Day cycle and scroll ----------
const sky = $('.sky'), sun = $('.sun');
const stops = [[0, [232, 213, 208], [229, 233, 226]], [.35, [207, 227, 234], [228, 238, 234]], [.7, [236, 214, 192], [240, 226, 208]], [1, [190, 172, 200], [226, 190, 184]]];
const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const paint = p => {
  let i = 0;
  while (i < stops.length - 2 && p > stops[i + 1][0]) i++;
  const [p0, a0, b0] = stops[i], [p1, a1, b1] = stops[i + 1], t = Math.min(1, Math.max(0, (p - p0) / (p1 - p0)));
  sky.style.setProperty('--sky-a', `rgb(${lerp(a0, a1, t)})`);
  sky.style.setProperty('--sky-b', `rgb(${lerp(b0, b1, t)})`);
  const arc = Math.sin(Math.PI * p);
  sun.style.left = (12 + 76 * p) + '%';
  sun.style.top = (80 - 66 * arc) + '%';
  sun.style.transform = `translate(-50%,-50%) scale(${1 + .3 * (1 - arc)})`;
  sun.style.opacity = body.classList.contains('ready') ? String(.5 * Math.max(0, 1 - Math.max(0, p - .82) / .18)) : '0';
};
const bar = $('.progress'), top = $('.topbar'), hero = $('.hero');
const copy = $('.hero-copy'), layers = $$('.layer');
let lastY = 0, queued = false;
const onScroll = () => {
  const y = scrollY, max = root.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, y / max) : 0;
  bar.style.transform = `scaleX(${p})`;
  top.classList.toggle('solid', y > 40);
  top.classList.toggle('hide', y > lastY && y > 200);
  lastY = y;
  paint(p);
  if (hero && !reduce && y < innerHeight * 1.2) {
    layers.forEach(l => { l.style.transform = `translate3d(0,${y * l.dataset.speed}px,0)`; });
    copy.style.transform = `translate3d(0,${y * .25}px,0)`;
    copy.style.opacity = Math.max(0, 1 - y / (innerHeight * .8));
  }
  queued = false;
};
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });

// clear the mist with the pointer
if (hero) hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
});

// ---------- Carousel ----------
const initCarousel = el => {
  const vp = $('.viewport', el), tr = $('.track', el), sl = $$('.slide', el), bar2 = $('.bar i', el);
  const cnt = $('.count', el), box = $('.dots', el);
  const auto = reduce ? 0 : +el.dataset.autoplay || 0;
  let i = 0, dx = 0, down = null, captured = false;
  const dots = sl.map((_, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', `Go to slide ${k + 1}`); b.onclick = () => go(k);
    box.append(b); return b;
  });
  const step = () => sl[0].offsetWidth + (parseFloat(getComputedStyle(tr).columnGap) || 0);
  const render = drag => {
    tr.style.transition = drag ? 'none' : '';
    tr.style.transform = `translateX(${-i * step() + dx}px)`;
    sl.forEach((s, k) => { s.classList.toggle('active', k === i); s.inert = k !== i; });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
    cnt.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(sl.length).padStart(2, '0');
    if (auto) { bar2.style.animation = 'none'; void bar2.offsetWidth; bar2.style.animation = `fill ${auto}ms linear forwards`; }
  };
  const go = n => { i = (n + sl.length) % sl.length; render(); };
  $('.prev', el).onclick = () => go(i - 1);
  $('.next', el).onclick = () => go(i + 1);
  bar2.addEventListener('animationend', () => go(i + 1));
  el.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); });
  vp.addEventListener('pointerdown', e => { down = e.clientX; dx = 0; captured = false; });
  vp.addEventListener('pointermove', e => {
    if (down === null) return;
    dx = e.clientX - down;
    if (Math.abs(dx) > 6 && !captured) { vp.setPointerCapture(e.pointerId); captured = true; }
    if (captured) render(true);
  });
  const end = () => {
    if (down === null) return;
    const m = dx; down = null; dx = 0;
    if (m < -60) go(i + 1); else if (m > 60) go(i - 1); else render();
  };
  vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
  ['pointerenter', 'focusin'].forEach(t => el.addEventListener(t, () => el.classList.add('paused')));
  ['pointerleave', 'focusout'].forEach(t => el.addEventListener(t, () => el.classList.remove('paused')));
  new IntersectionObserver(e => el.classList.toggle('offscreen', !e[0].isIntersecting)).observe(el);
  addEventListener('resize', () => render());
  render();
};

// ---------- Stack row ----------
$$('.rowwrap').forEach(w => {
  const row = $('.row', w);
  const by = d => row.scrollBy({ left: d * (row.firstElementChild.offsetWidth + 20), behavior: reduce ? 'auto' : 'smooth' });
  $('.prev', w).onclick = () => by(-1); $('.next', w).onclick = () => by(1);
  let sx = 0, s0 = 0, on = false, moved = false;
  row.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; on = true; moved = false; sx = e.clientX; s0 = row.scrollLeft; });
  addEventListener('pointermove', e => {
    if (!on) return;
    const d = e.clientX - sx;
    if (Math.abs(d) > 5) { moved = true; row.classList.add('dragging'); }
    if (moved) row.scrollLeft = s0 - d;
  });
  addEventListener('pointerup', () => { on = false; row.classList.remove('dragging'); });
});
$$('.card').forEach(c => {
  if (reduce || lite) return;
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
    c.style.setProperty('--mx', (x + .5) * 100 + '%'); c.style.setProperty('--my', (y + .5) * 100 + '%');
  });
  c.addEventListener('pointerleave', () => { c.style.transform = ''; });
});

// ---------- Marquee ----------
const mq = $('.mq');
if (mq) { const c = mq.cloneNode(true); c.setAttribute('aria-hidden', 'true'); mq.after(c); }

// ---------- Projects data ----------
fetch('data/projects.json', { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(list => {
  window.PROJECTS = list;
  const car = $('.carousel');
  if (car) { $('.track', car).innerHTML = list.map((p, i) => slideHTML(p, i, list.length)).join(''); initCarousel(car); }
  const grid = $('#envelopes');
  if (grid) {
    grid.innerHTML = list.map(envHTML).join('');
    const hit = list.find(p => p.id === location.hash.slice(1));
    if (hit) openLetter(hit);
  }
}).catch(() => {
  const msg = '<p class="intro">Projects could not be loaded. If you opened this file directly, serve the folder instead (for example with npx http-server). On GitHub Pages, check that data/projects.json was pushed.</p>';
  const car = $('.carousel'), grid = $('#envelopes');
  if (car) car.insertAdjacentHTML('afterend', msg);
  if (grid) grid.innerHTML = msg;
});

// ---------- Currently building ----------
const act = $('.activity');
if (act) fetch('data/activity.json').then(r => r.json()).then(items => {
  if (!items.length) return;
  $('ul', act).innerHTML = items.slice(0, 3).map(it => `<li><a href="${esc(it.url)}">${esc(it.repo)}</a><span>${esc(it.msg)}</span><time>${new Date(it.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time></li>`).join('');
  act.hidden = false;
}).catch(() => {});

// ---------- Birds ----------
const flock = $('.birds');
if (flock && !reduce && !lite) {
  for (let k = 0; k < 5; k++) {
    const b = document.createElement('span');
    b.className = 'bird';
    b.style.cssText = `--y:${12 + Math.random() * 30}%;--d:${38 + Math.random() * 25}s;--dl:${k * 7}s`;
    b.innerHTML = '<svg viewBox="0 0 24 12"><path d="M1 8 Q6 1 12 8 Q18 1 23 8"/></svg>';
    flock.append(b);
  }
}

// ---------- Seasonal particles, ink brush and ripples ----------
const fx = $('#fx');
if (fx && !reduce && !lite) {
  const ctx = fx.getContext('2d');
  let W, H;
  const size = () => { W = fx.width = innerWidth; H = fx.height = innerHeight; };
  size(); addEventListener('resize', size);
  const m = new Date().getMonth();
  const season = m >= 2 && m <= 4 ? 'sakura' : m >= 5 && m <= 7 ? 'firefly' : m >= 8 && m <= 10 ? 'maple' : 'snow';
  const half = [[0, -1], [.3, -.4], [.9, -.55], [.55, .05], [.85, .6], [.15, .45], [0, 1.1]];
  const cols = ['#C2410C', '#B3261E', '#D9902B'];
  const mk = init => ({ x: Math.random() * W, y: init ? Math.random() * H : -20, s: 5 + Math.random() * 7, v: .35 + Math.random() * .6,
    w: Math.random() * 6.28, r: Math.random() * 6.28, dr: (Math.random() - .5) * .03, c: cols[Math.random() * 3 | 0], a: Math.random() * 6.28 });
  const ps = Array.from({ length: 28 }, () => mk(true));
  const trail = [], rip = [];
  addEventListener('pointermove', e => { trail.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (trail.length > 40) trail.shift(); });
  addEventListener('pointerdown', e => rip.push({ x: e.clientX, y: e.clientY, t: performance.now() }));
  const frame = now => {
    ctx.clearRect(0, 0, W, H);
    const night = root.classList.contains('nm'), kind = night ? 'firefly' : season;
    ps.forEach(p => {
      p.w += .01;
      if (kind === 'firefly') {
        p.a += (Math.random() - .5) * .2; p.x += Math.cos(p.a) * .35; p.y += Math.sin(p.a) * .35;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const g = .5 + .5 * Math.sin(now / 600 + p.w * 5), R = p.s * 2.2, gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
        gr.addColorStop(0, `rgba(230,255,150,${.9 * g})`); gr.addColorStop(1, 'rgba(230,255,150,0)');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 6.28); ctx.fill();
        return;
      }
      p.x += Math.sin(p.w) * .5 + (kind === 'snow' ? .1 : .5) * p.v; p.y += p.v * (kind === 'snow' ? .8 : 1); p.r += p.dr;
      if (p.y > H + 20 || p.x > W + 20) Object.assign(p, mk(false), { x: Math.random() * W * .9 });
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      if (kind === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.strokeStyle = 'rgba(120,140,155,.35)';
        ctx.beginPath(); ctx.arc(0, 0, p.s * .35, 0, 6.28); ctx.fill(); ctx.stroke();
      } else if (kind === 'sakura') {
        ctx.fillStyle = 'rgba(242,176,196,.85)'; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .5, 0, 0, 6.28); ctx.fill();
      } else {
        ctx.fillStyle = p.c; ctx.globalAlpha = .85; ctx.beginPath();
        half.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x * p.s, y * p.s));
        [...half].reverse().forEach(([x, y]) => ctx.lineTo(-x * p.s, y * p.s));
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    });
    const ink = night ? '225,234,230' : '24,34,31';
    ctx.lineCap = 'round';
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1], b = trail[i], age = now - b.t;
      if (age > 900 || b.t - a.t > 120) continue;
      const k = 1 - age / 900;
      ctx.strokeStyle = `rgba(${ink},${.55 * k})`; ctx.lineWidth = 1 + 7 * k;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let i = rip.length - 1; i >= 0; i--) {
      const r = rip[i], age = now - r.t;
      if (age > 1100) { rip.splice(i, 1); continue; }
      [0, .18].forEach(d => {
        const k = Math.max(0, age / 1100 - d);
        ctx.strokeStyle = `rgba(${ink},${.5 * (1 - k)})`; ctx.lineWidth = 2 * (1 - k) + .5;
        ctx.beginPath(); ctx.arc(r.x, r.y, k * 90, 0, 6.28); ctx.stroke();
      });
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// ---------- Start ----------
const start = () => { if (body.classList.contains('ready')) return; body.classList.add('ready'); onScroll(); };
onScroll();
if (!$('.loader') || reduce) start(); else addEventListener('load', () => setTimeout(start, 1500));
setTimeout(start, 4000);
})();
