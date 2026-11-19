// About page: scroll-linked reading lines for "How I work" and "The journey".
(() => {
'use strict';
if (matchMedia('(prefers-reduced-motion: reduce)').matches) { document.querySelectorAll('.ab-way li').forEach(li => li.classList.add('on')); return; }
const way = document.querySelector('.ab-way'), tl = document.getElementById('timeline');
const lists = [way, tl].filter(Boolean);
if (!lists.length) return;
lists.forEach(l => l.classList.add('ab-live'));
let raf = 0;
const update = () => {
  raf = 0;
  const vh = innerHeight;
  lists.forEach(l => {
    const r = l.getBoundingClientRect();
    l.style.setProperty('--read', Math.min(1, Math.max(0, (vh * .7 - r.top) / r.height)).toFixed(3));
    [...l.children].forEach(li => li.classList.toggle('on', li.getBoundingClientRect().top < vh * .7));
  });
};
const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
addEventListener('scroll', kick, { passive: true });
addEventListener('resize', kick);
addEventListener('load', kick);
update();
})();
