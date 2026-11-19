// Notes page: reading index with a sliding seal marker, per-note reading line, summary line, copy-link buttons.
(() => {
'use strict';
const list = document.getElementById('notes-list'), side = document.getElementById('nx-side');
if (!list || !side) return;
const notes = [...list.querySelectorAll('.nx-note')];
if (!notes.length) return;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Summary line in the hero
const mins = notes.reduce((a, n) => a + +n.dataset.mins, 0);
const intro = document.querySelector('.page-head .intro');
if (intro) {
  const m = document.createElement('p'); m.className = 'nx-meta reveal';
  m.innerHTML = `<span>${notes.length} ${notes.length === 1 ? 'note' : 'notes'}</span><span>${mins} min of reading</span><span>Latest: ${esc(notes[0].dataset.date)}</span>`;
  intro.after(m); if (false /* OS reduce-motion ignored on purpose */ || !document.documentElement.classList.contains('js')) m.classList.add('in'); else requestAnimationFrame(() => setTimeout(() => m.classList.add('in'), 250));
}

// Index
side.innerHTML = `<p class="nx-h">All notes</p><ol class="nx-ol"><i class="nx-mark" aria-hidden="true"></i>${notes.map(n =>
  `<li><a href="#${esc(n.id)}"><b aria-hidden="true">${esc(n.dataset.num)}</b><span>${esc(n.dataset.title)}</span><em>${esc(n.dataset.date)}</em></a></li>`).join('')}</ol>
  <div class="nx-pct" aria-hidden="true"><i></i><span>0% read</span></div>`;
const items = [...side.querySelectorAll('li')], mark = side.querySelector('.nx-mark'), bar = side.querySelector('.nx-pct i'), pct = side.querySelector('.nx-pct span');
let cur = -1;
const setMark = () => { const li = items[Math.max(cur, 0)]; if (!li) return; mark.style.transform = `translateY(${li.offsetTop}px)`; mark.style.height = li.offsetHeight + 'px'; };

let raf = 0;
const update = () => {
  raf = 0;
  const vh = innerHeight; let a = 0;
  notes.forEach((n, i) => {
    const r = n.getBoundingClientRect();
    n.style.setProperty('--read', Math.min(1, Math.max(0, (vh * .62 - r.top) / r.height)).toFixed(3));
    if (r.top < vh * .45) a = i;
  });
  if (a !== cur) {
    cur = a; items.forEach((li, i) => li.classList.toggle('on', i === a)); setMark();
  }
  const f = notes[0].getBoundingClientRect().top, l = notes[notes.length - 1].getBoundingClientRect().bottom;
  const p = Math.min(1, Math.max(0, (vh * .62 - f) / Math.max(1, l - f)));
  bar.style.transform = `scaleX(${p.toFixed(3)})`; pct.textContent = Math.round(p * 100) + '% read';
};
const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
addEventListener('scroll', kick, { passive: true });
addEventListener('resize', () => { setMark(); kick(); });
addEventListener('load', () => { setMark(); kick(); });
update();

// Copy link
list.addEventListener('click', e => {
  const b = e.target.closest('.nx-copy'); if (!b) return;
  const url = location.origin + location.pathname + '#' + b.dataset.id;
  const done = () => { b.textContent = 'Link copied'; b.classList.add('ok'); setTimeout(() => { b.textContent = 'Copy link'; b.classList.remove('ok'); }, 1800); };
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(done, () => { history.replaceState(null, '', '#' + b.dataset.id); done(); });
});
})();
