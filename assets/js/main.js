(() => {
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

$('#y').textContent = new Date().getFullYear();

// Theme switch (remembers the choice)
$('.theme').addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Split the name into letters for the entrance
const h1 = $('h1');
const name = h1.textContent.trim();
h1.setAttribute('aria-label', name);
h1.innerHTML = [...name].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c}</span>`).join('');

// Intro: seal stamp, curtain lift, then the hero plays
const start = () => document.body.classList.add('ready');
if (reduce) start(); else addEventListener('load', () => setTimeout(start, 1500));
setTimeout(start, 4000);

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .2 });
$$('.reveal, .brush').forEach(el => io.observe(el));

// Scroll: parallax, header, progress bar
const bar = $('.progress'), top = $('.topbar'), copy = $('.hero-copy'), layers = $$('.layer');
let lastY = 0, queued = false;
const onScroll = () => {
  const y = scrollY, max = root.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  top.classList.toggle('solid', y > 40);
  top.classList.toggle('hide', y > lastY && y > 200);
  lastY = y;
  if (!reduce && y < innerHeight * 1.2) {
    layers.forEach(l => l.style.transform = `translate3d(0,${y * l.dataset.speed}px,0)`);
    copy.style.transform = `translate3d(0,${y * .25}px,0)`;
    copy.style.opacity = Math.max(0, 1 - y / (innerHeight * .8));
  }
  queued = false;
};
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Side dots
const dots = $$('.rail a');
const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) dots.forEach(d => d.setAttribute('aria-current', d.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -45% 0px' });
['top', 'work', 'stack', 'contact'].forEach(id => io2.observe(document.getElementById(id)));

// Card tilt with a light that follows the pointer
if (!reduce) $$('.card').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
    c.style.setProperty('--mx', (x + .5) * 100 + '%');
    c.style.setProperty('--my', (y + .5) * 100 + '%');
  });
  c.addEventListener('pointerleave', () => c.style.transform = '');
});

// Ring cursor (mouse only)
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
  const cur = $('.cursor');
  let tx = 0, ty = 0, x = 0, y = 0;
  document.body.classList.add('has-cursor');
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; });
  (function loop() {
    x += (tx - x) * .18; y += (ty - y) * .18;
    cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.card')));
}

// Marquee: clone the word group so it loops seamlessly
const mq = $('.mq');
if (mq) { const c = mq.cloneNode(true); c.setAttribute('aria-hidden', 'true'); mq.after(c); }

// Featured carousel: arrows, dots, drag, keys, autoplay
$$('.carousel').forEach(el => {
  const vp = $('.viewport', el), tr = $('.track', el), sl = $$('.slide', el), bar = $('.bar i', el);
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
    if (auto) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = `fill ${auto}ms linear forwards`; }
  };
  const go = n => { i = (n + sl.length) % sl.length; render(); };
  $('.prev', el).onclick = () => go(i - 1);
  $('.next', el).onclick = () => go(i + 1);
  bar.addEventListener('animationend', () => go(i + 1));
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
});

// Stack row: arrows and mouse drag
$$('.rowwrap').forEach(w => {
  const row = $('.row', w);
  const by = d => row.scrollBy({ left: d * (row.firstElementChild.offsetWidth + 20), behavior: reduce ? 'auto' : 'smooth' });
  $('.prev', w).onclick = () => by(-1); $('.next', w).onclick = () => by(1);
  let sx = 0, sl0 = 0, on = false, moved = false;
  row.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; on = true; moved = false; sx = e.clientX; sl0 = row.scrollLeft; });
  addEventListener('pointermove', e => {
    if (!on) return;
    const d = e.clientX - sx;
    if (Math.abs(d) > 5) { moved = true; row.classList.add('dragging'); }
    if (moved) row.scrollLeft = sl0 - d;
  });
  addEventListener('pointerup', () => { on = false; row.classList.remove('dragging'); });
});

// Drifting petals in the hero
const cv = $('.petals');
if (cv && !reduce) {
  const ctx = cv.getContext('2d');
  let W, H, visible = true;
  const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
  size(); addEventListener('resize', size);
  const make = init => ({ x: Math.random() * W, y: init ? Math.random() * H : -20, s: 4 + Math.random() * 7,
    v: .3 + Math.random() * .6, w: Math.random() * 6.28, r: Math.random() * 6.28, dr: (Math.random() - .5) * .02 });
  const petals = Array.from({ length: 32 }, () => make(true));
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(cv);
  (function draw() {
    if (visible) {
      ctx.clearRect(0, 0, W, H);
      const c = getComputedStyle(root).getPropertyValue('--petal').trim();
      petals.forEach(p => {
        p.w += .01; p.x += p.v * .8 + Math.sin(p.w) * .5; p.y += p.v; p.r += p.dr;
        if (p.y > H + 20 || p.x > W + 20) Object.assign(p, make(false), { x: Math.random() * W * .8 });
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = `rgba(${c},${.15 + p.s / 30})`;
        ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .45, 0, 0, 6.28); ctx.fill(); ctx.restore();
      });
    }
    requestAnimationFrame(draw);
  })();
}
})();
