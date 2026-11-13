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
fill('#cycle-list', S.cycle.map((c, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`).join(''));
fill('#learning-list', S.learning.map(u => `<span class="badge"><b>${esc(u.title)}</b>${esc(u.text)}</span>`).join(''));
fill('#beyond-list', S.beyond.map(b => `<div class="card"><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>`).join(''));

// Trail log: stylised mountain profile with one dot per peak (oldest on the left)
(() => {
  const T = S.trails.slice().reverse();
  const X = [100, 300, 500], Y = [82, 54, 22]; // taller = tougher
  const dots = T.map((t, i) => `<g class="peak" style="--i:${i}"><circle class="halo" cx="${X[i]}" cy="${Y[i]}" r="13"/><circle class="dot" cx="${X[i]}" cy="${Y[i]}" r="6"/></g>`).join('');
  const labels = T.map((t, i) => `<div class="tl${i === T.length - 1 ? ' latest' : ''}"><small>${esc(t.date)}</small><b>${esc(t.name)}</b><span>${esc(t.note)}</span></div>`).join('');
  fill('#trail-list', `<svg viewBox="0 0 600 140" role="img" aria-label="Stylised profile of three climbs"><defs><linearGradient id="tfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".28"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0,124 C40,122 70,94 100,82 S150,116 200,116 S250,68 300,54 S370,108 400,110 S460,36 500,22 S570,100 600,114 V140 H0Z"/><path class="line" pathLength="1" d="M0,124 C40,122 70,94 100,82 S150,116 200,116 S250,68 300,54 S370,108 400,110 S460,36 500,22 S570,100 600,114"/>${dots}</svg><div class="tlabels">${labels}</div><p class="tnote">The taller the peak, the tougher the climb.</p>`);
})();

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
