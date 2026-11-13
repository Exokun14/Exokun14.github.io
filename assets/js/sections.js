(() => {
'use strict';
const S = window.SITE; if (!S) return;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = s => document.querySelector(s);
const fill = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
const hide = sel => { const el = $(sel); if (el) el.hidden = true; };

fill('#now-list', S.now.items.map(i => `<div class="card"><h3>${esc(i.label)}</h3><p>${esc(i.text)}</p></div>`).join(''));
const nu = $('#now-updated'); if (nu) nu.textContent = 'Updated ' + S.now.updated;

fill('#timeline', S.timeline.map(t => `<li><span class="yr">${esc(t.year)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join(''));
fill('#cycle-list', S.cycle.map((c, i) => `<li><span class="yr">${String(i + 1).padStart(2, '0')}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`).join(''));
fill('#learning-list', S.learning.map(u => `<div class="card"><h3>${esc(u.title)}</h3><p>${esc(u.text)}</p></div>`).join(''));
fill('#trail-list', S.trails.map(t => `<li><span class="yr">${esc(t.date)}</span><h3>${esc(t.name)}</h3><p>${esc(t.note)}</p></li>`).join(''));
fill('#beyond-list', S.beyond.map(b => `<div class="card"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>`).join(''));

const wt = $('#work-text'); if (wt) wt.textContent = S.work.text;
fill('#work-offers', S.work.offers.map(o => `<li>${esc(o)}</li>`).join(''));

if (S.photos.length) fill('#photos-list', S.photos.map(p => `<figure><img src="${esc(p.src)}" alt="${esc(p.alt || '')}" loading="lazy">${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}</figure>`).join('')); else hide('#photos');
if (S.kind.length) fill('#kind-list', S.kind.map(k => `<blockquote><p>${esc(k.quote)}</p><footer>${esc(k.name)}${k.role ? ', ' + esc(k.role) : ''}</footer></blockquote>`).join('')); else hide('#kind');

fill('#notes-list', S.notes.map(n => `<article class="note" id="${esc(n.id)}"><p class="date">${esc(n.date)}</p><h2>${esc(n.title)}</h2>${n.body.map(p => `<p>${esc(p)}</p>`).join('')}</article>`).join(''));

// Number the visible sections in order (hidden ones are skipped)
let n = 0;
document.querySelectorAll('main > section:not([hidden]) .eyebrow').forEach(e => {
  if (/^\d+$/.test(e.textContent.trim())) e.textContent = String(++n).padStart(2, '0');
});
})();
