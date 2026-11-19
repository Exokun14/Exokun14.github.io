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

// Trail log: stylised mountain profile with one dot per peak (oldest on the left).
// `list` is newest first. Peak height comes from `tough` (1 to 4). Used by About and the Trail page.
const trailProfile = (list, labels) => {
  const T = list.slice().reverse(), n = T.length;
  if (!n) return '';
  const X = T.map((_, i) => 600 * (i + .5) / n);
  const Y = T.map(t => Math.max(14, 110 - 29 * (t.tough || 2)));
  const pts = [[0, 124]];
  X.forEach((x, i) => { if (i) pts.push([(X[i - 1] + x) / 2, 114]); pts.push([x, Y[i]]); });
  pts.push([600, 114]);
  let d = 'M' + pts[0].join(',');
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += `C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  const dots = T.map((t, i) => `<g class="peak" style="--i:${i}"><circle class="halo" cx="${X[i]}" cy="${Y[i]}" r="13"/><circle class="dot" cx="${X[i]}" cy="${Y[i]}" r="6"/>${labels ? '' : `<text class="pk-n" x="${X[i]}" y="${Y[i] - 20}" text-anchor="middle">${i + 1}</text>`}</g>`).join('');
  const lab = labels ? `<div class="tlabels" style="grid-template-columns:repeat(${n},1fr)">${T.map((t, i) => `<div class="tl${i === n - 1 ? ' latest' : ''}"><small>${esc(t.date)}</small><b>${esc(t.name)}</b><span>${esc(t.note)}</span></div>`).join('')}</div>` : '';
  return `<svg viewBox="0 0 600 140" role="img" aria-label="Stylised profile of ${n} climb${n === 1 ? '' : 's'}, taller peaks are tougher"><defs><linearGradient id="tfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".28"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path class="area" d="${d}V140H0Z"/><path class="line" pathLength="1" d="${d}"/>${dots}</svg>${lab}<p class="tnote">The taller the peak, the tougher the climb.</p>`;
};
window.trailProfile = trailProfile;
if ($('#trail-list')) {
  const full = !!$('#trail-list.trail-full');
  fill('#trail-list', trailProfile(full ? S.trails : S.trails.slice(0, 3), !full));
}

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
