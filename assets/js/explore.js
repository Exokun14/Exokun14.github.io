// Trail log, Gallery, Playground and Guestbook. Each block runs only if its page elements exist.
(() => {
'use strict';
const S = window.SITE; if (!S) return;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

// ---------- Trail log ----------
const hikes = $('#hike-list');
if (hikes) {
  const T = S.trails, pad = n => String(n).padStart(2, '0');
  const toughest = T.reduce((a, b) => ((b.tough || 0) > (a.tough || 0) ? b : a), T[0]);
  const days = Math.max(0, Math.floor((Date.now() - new Date(T[0].date)) / 864e5));
  const ago = isNaN(days) ? '' : days === 0 ? 'Today' : days === 1 ? '1 day ago' : days + ' days ago';
  const stat = (k, v) => `<div class="card stat"><small>${esc(k)}</small><h3>${esc(v)}</h3></div>`;
  $('#trail-stats').innerHTML = stat('Climbs logged', T.length) + stat('Latest', T[0].name) + (ago ? stat('Last climb', ago) : '') + stat('Toughest so far', toughest.name);
  hikes.innerHTML = T.map((t, i) => {
    const lvl = Math.min(4, Math.max(1, t.tough || 2));
    const meta = [t.date, t.tag, t.masl ? t.masl.toLocaleString() + ' m' : ''].filter(Boolean).join(' · ');
    const tough = `<span class="tough" role="img" aria-label="Toughness ${lvl} of 4">${[1, 2, 3, 4].map(n => `<i class="${n <= lvl ? 'on' : ''}"></i>`).join('')}</span>`;
    const photo = t.photo ? `<img class="photo" src="${esc(t.photo)}" alt="${esc(t.alt || t.name)}" loading="lazy">` : '';
    return `<li class="hike"><span class="no" aria-hidden="true">${pad(T.length - i)}</span><div><p class="meta">${esc(meta)}</p><h2>${esc(t.name)}</h2><p>${esc(t.note)}</p>${tough}${photo}</div></li>`;
  }).join('');
}

// ---------- Gallery ----------
const grid = $('#g-grid');
if (grid) {
  const photos = (S.photos || []).map(p => ({ src: p.src, title: p.caption || p.alt || 'Photo', alt: p.alt || p.caption || '', kind: 'photo' }));
  const paints = (S.paintings || []).map(p => ({ ...p, kind: 'painting' }));
  const filters = $('#g-filters'), lb = $('#lightbox'), img = $('img', lb), cap = $('figcaption', lb);
  let view = [], cur = 0, from = null;
  const draw = kind => {
    view = kind === 'photo' ? photos : kind === 'painting' ? paints : photos.concat(paints);
    grid.innerHTML = view.map((p, i) => `<li style="--n:${Math.min(i, 12)}"><button class="gx-item" type="button" data-i="${i}" aria-label="View ${esc(p.title)}"><img class="${p.kind === 'painting' && !p.color ? 'ink' : ''}" src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" decoding="async"><span class="cap">${esc(p.title)}</span></button></li>`).join('');
    $$('button', filters).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === kind)));
  };
  const labels = [['all', 'All'], ['painting', 'Paintings']];
  if (photos.length) labels.push(['photo', 'Photos']);
  filters.innerHTML = labels.map(([k, l], i) => `<button type="button" data-k="${k}" aria-pressed="${i === 0}">${l}</button>`).join('');
  if (labels.length < 3) filters.hidden = true;
  filters.addEventListener('click', e => { const b = e.target.closest('button'); if (b) draw(b.dataset.k); });
  const show = i => {
    cur = (i + view.length) % view.length;
    const p = view[cur];
    img.src = p.src; img.alt = p.alt; img.className = p.kind === 'painting' && !p.color ? 'ink' : '';
    cap.innerHTML = `${esc(p.title)}<small>${cur + 1} of ${view.length}</small>`;
  };
  grid.addEventListener('click', e => {
    const b = e.target.closest('.gx-item'); if (!b) return;
    from = b; show(+b.dataset.i);
    if (!lb.open) lb.showModal();
    $('.x', lb).focus();
  });
  $('.x', lb).addEventListener('click', () => lb.close());
  $('.pv', lb).addEventListener('click', () => show(cur - 1));
  $('.nx', lb).addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') lb.close(); });
  lb.addEventListener('close', () => { if (from && from.isConnected) from.focus(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
  });
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });
  draw('all');
}

// ---------- Ink pad ----------
const cv = $('#ink-canvas');
if (cv) {
  const ctx = cv.getContext('2d');
  const hint = $('.pad-hint');
  const strokes = [];
  let color = 'auto', size = +$('#ink-size').value, live = null, dpr = 1;
  const isDark = () => root.classList.contains('nm');
  const resolve = c => c === 'auto' ? (isDark() ? '#E1EAE6' : '#18221F') : c;
  const seg = (s, i) => {
    const p0 = s.pts[i - 1], p1 = s.pts[i], p00 = s.pts[i - 2] || p0;
    const m0 = { x: (p00.x + p0.x) / 2, y: (p00.y + p0.y) / 2 }, m1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    ctx.lineWidth = p0.w;
    ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.quadraticCurveTo(p0.x, p0.y, m1.x, m1.y); ctx.stroke();
  };
  const setup = s => { ctx.strokeStyle = ctx.fillStyle = resolve(s.c); ctx.lineCap = ctx.lineJoin = 'round'; };
  const dot = s => { const p = s.pts[0]; ctx.beginPath(); ctx.arc(p.x, p.y, p.w / 2, 0, 7); ctx.fill(); };
  const paint = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    strokes.forEach(s => { setup(s); if (s.pts.length === 1) dot(s); else for (let i = 1; i < s.pts.length; i++) seg(s, i); });
  };
  const fit = () => {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    paint();
  };
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; };
  cv.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    cv.setPointerCapture(e.pointerId);
    const p = pos(e); p.w = size * .9;
    live = { c: color, pts: [p] }; strokes.push(live);
    setup(live); dot(live);
    hint.classList.add('gone');
  });
  cv.addEventListener('pointermove', e => {
    if (!live) return;
    (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach(ev => {
      const prev = live.pts[live.pts.length - 1], p = pos(ev);
      const d = Math.hypot(p.x - prev.x, p.y - prev.y); if (d < 1.2) return;
      const speed = d / Math.max(1, p.t - prev.t);               // px per ms
      const target = size * Math.min(1.35, Math.max(.3, 1.4 - speed * .55));
      p.w = prev.w * .75 + target * .25;
      live.pts.push(p);
      setup(live); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seg(live, live.pts.length - 1);
    });
  });
  const end = () => { live = null; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  $('#ink-size').addEventListener('input', e => { size = +e.target.value; });
  $('.swatches').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    color = b.dataset.c; $$('.swatches button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  });
  $('#ink-undo').addEventListener('click', () => { strokes.pop(); paint(); if (!strokes.length) hint.classList.remove('gone'); });
  $('#ink-clear').addEventListener('click', () => { strokes.length = 0; paint(); hint.classList.remove('gone'); });
  $('#ink-save').addEventListener('click', () => {
    const out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    const o = out.getContext('2d');
    o.fillStyle = getComputedStyle(cv).backgroundColor; o.fillRect(0, 0, out.width, out.height);
    o.drawImage(cv, 0, 0);
    out.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'ink-pad.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); });
  });
  let rw = 0;
  new ResizeObserver(() => { const w = cv.clientWidth; if (w && w !== rw) { rw = w; fit(); } }).observe(cv);
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ['class'] });
}

// ---------- Memory match ----------
const mg = $('#mem-grid');
if (mg) {
  const pool = (S.paintings || []).filter(p => !p.color);
  const bar = { moves: $('#mem-moves'), time: $('#mem-time'), best: $('#mem-best'), msg: $('#mem-msg') };
  const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let cards, open, moves, found, secs, timer, busy;
  const showBest = () => { const b = +store.get('memBest'); bar.best.textContent = b ? b + ' moves' : '–'; };
  const label = (c, i) => `Card ${i + 1}, ${c.el.classList.contains('done') ? c.p.title + ', matched' : c.el.classList.contains('up') ? c.p.title : 'face down'}`;
  const sync = () => cards.forEach((c, i) => { c.el.setAttribute('aria-label', label(c, i)); });
  const tick = () => { secs++; bar.time.textContent = fmt(secs); };
  const newGame = () => {
    clearInterval(timer); timer = null; open = []; moves = 0; found = 0; secs = 0; busy = false;
    bar.moves.textContent = '0'; bar.time.textContent = '0:00'; bar.msg.textContent = ''; showBest();
    const picks = shuffle(pool.slice()).slice(0, 8);
    cards = shuffle(picks.concat(picks)).map(p => ({ p }));
    mg.innerHTML = cards.map(c => `<button class="mem-card" type="button"><i class="front" aria-hidden="true">C</i><i class="back" aria-hidden="true"><img class="ink" src="${esc(c.p.src)}" alt=""></i></button>`).join('');
    $$('.mem-card', mg).forEach((el, i) => { cards[i].el = el; });
    sync();
  };
  mg.addEventListener('click', e => {
    const el = e.target.closest('.mem-card'); if (!el || busy) return;
    const c = cards.find(x => x.el === el);
    if (el.classList.contains('up') || el.classList.contains('done')) return;
    if (!timer) timer = setInterval(tick, 1000);
    el.classList.add('up'); open.push(c); sync();
    if (open.length < 2) return;
    moves++; bar.moves.textContent = moves;
    const [a, b] = open; open = [];
    if (a.p === b.p) {
      [a, b].forEach(x => { x.el.classList.remove('up'); x.el.classList.add('done'); });
      sync();
      if (++found === 8) {
        clearInterval(timer); timer = null;
        const best = +store.get('memBest');
        const rec = !best || moves < best; if (rec) store.set('memBest', moves);
        showBest();
        bar.msg.textContent = `Cleared in ${moves} moves, ${fmt(secs)}.` + (rec ? ' New best!' : '');
      }
    } else {
      busy = true;
      setTimeout(() => { [a, b].forEach(x => x.el.classList.remove('up')); busy = false; sync(); }, reduce ? 900 : 800);
    }
  });
  $('#mem-restart').addEventListener('click', newGame);
  newGame();
}

// ---------- Guestbook ----------
const gb = $('#gb-list');
if (gb) {
  const { repo, prefix } = S.guestbook;
  const sign = $('#gb-sign');
  sign.href = `https://github.com/${repo}/issues/new?title=${encodeURIComponent(prefix + ' ')}&body=${encodeURIComponent('<!-- Write your message below. This whole issue is shown publicly on the guestbook page. -->\n\n')}`;
  const status = t => { gb.innerHTML = `<p class="ex-status">${t}</p>`; };
  const okUrl = (u, start) => typeof u === 'string' && u.startsWith(start);
  const render = items => {
    if (!items.length) return status('No entries yet. Be the first to sign.');
    gb.innerHTML = items.map((it, i) => {
      const user = it.user || {}, login = user.login || 'visitor';
      const head = String(it.title || '').slice(prefix.length).trim();
      const msg = String(it.body || '').replace(/<!--[\s\S]*?-->/g, '').trim().slice(0, 600);
      const av = okUrl(user.avatar_url, 'https://avatars.githubusercontent.com/') ? `<img src="${esc(user.avatar_url)}${user.avatar_url.includes('?') ? '&' : '?'}s=96" alt="" width="45" height="45" loading="lazy">` : `<span class="av" aria-hidden="true">${esc(login[0].toUpperCase())}</span>`;
      const who = okUrl(user.html_url, 'https://github.com/') ? `<a href="${esc(user.html_url)}" rel="noopener">${esc(login)}</a>` : esc(login);
      const date = new Date(it.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      const src = okUrl(it.html_url, 'https://github.com/') ? `<a class="src" href="${esc(it.html_url)}" rel="noopener">View on GitHub</a>` : '';
      return `<article class="gb-entry" style="--n:${Math.min(i, 10)}">${av}<div><p class="who"><b>${who}</b><time datetime="${esc(it.created_at)}">${esc(date)}</time></p>${head ? `<h3>${esc(head)}</h3>` : ''}${msg ? `<p class="msg">${esc(msg)}</p>` : ''}${src}</div></article>`;
    }).join('');
  };
  const KEY = 'gbCache';
  let cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(KEY)); } catch (e) {}
  if (cached && Date.now() - cached.t < 3e5) render(cached.items);
  else {
    status('Loading entries…');
    fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=100`, { headers: { Accept: 'application/vnd.github+json' } })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(all => {
        const items = all.filter(x => !x.pull_request && typeof x.title === 'string' && x.title.startsWith(prefix));
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), items })); } catch (e) {}
        render(items);
      })
      .catch(() => status('Could not load the entries right now. GitHub may be busy. You can still sign above.'));
  }
}
})();
