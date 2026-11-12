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
