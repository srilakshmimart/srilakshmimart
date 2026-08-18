/* ============================================================
   SHELL — navigation, drawers, search, cursor, ticker
   ============================================================ */
window.Shell = (function () {
  const $ = s => document.querySelector(s);
  const D = App.D;

  /* ---------- navigation model (mirrors the client's real categories) ---------- */
  const NAV = [
    { id:'home',      label:'Home',                    icon:'bi-house',        route:'#/' },
    { id:'organic',   label:'Homemade Organic Foods',  icon:'bi-flower1',      route:'#/shop/organic',
      sub:[ {label:'All',       route:'#/shop/organic'},
            {label:'Malt',      route:'#/shop/organic/malt'},
            {label:'Ready Mix', route:'#/shop/organic/readymix'},
            {label:'Masala',    route:'#/shop/organic/masala'},
            {label:'Laddu',     route:'#/shop/organic/laddu'} ] },
    { id:'home-kit',  label:'Home & Kitchen',          icon:'bi-cup-hot',      route:'#/shop/home' },
    { id:'women',     label:"Women's Clothing",        icon:'bi-bag-heart',    route:'#/soon/women' },
    { id:'kids',      label:'Kids Wear',               icon:'bi-balloon',      route:'#/soon/kids' },
    { id:'jewel',     label:'Jewellery',               icon:'bi-gem',          route:'#/soon/jewellery' },
    { id:'gift',      label:'Gift Items',              icon:'bi-gift',         route:'#/soon/gifts' },
    { id:'contact',   label:'Contact',                 icon:'bi-telephone',    route:'#/contact' }
  ];
  /* Search, wishlist, cart and contact live in the top-right action bar,
     so the sidebar stays a clean list of places to shop. */

  /* ---------- build rail markup ---------- */
  function navHTML(compactTips) {
    const item = n => {
      const hasSub = !!n.sub;
      return `
      <div class="rail-block" data-nav="${n.id}">
        <button class="rail-item" data-go="${n.route || ''}" ${hasSub ? `data-sub="${n.id}" aria-expanded="false"` : ''}>
          <span class="rail-ico"><i class="bi ${n.icon}"></i></span>
          <span class="rail-txt">${n.label}</span>
          ${hasSub ? '<span class="rail-caret"><i class="bi bi-chevron-right"></i></span>' : ''}
          ${compactTips ? `<span class="rail-tip">${n.label}</span>` : ''}
        </button>
        ${hasSub ? `<div class="rail-sub" id="sub-${n.id}">
          ${n.sub.map(s => `<button class="rail-sub-item" data-go="${s.route}">${s.label}</button>`).join('')}
        </div>` : ''}
      </div>`;
    };
    return `
      <div class="rail-group">
        <div class="rail-label">Shop</div>
        ${NAV.map(item).join('')}
      </div>
`;
  }

  /* ---------- ticker ---------- */
  function ticker() {
    const set = D.announcements.map(a =>
      `<span class="ticker-item">${App.esc(a)}</span>`).join('');
    return `<div class="ticker" role="region" aria-label="Announcements">
      <div class="ticker-track">${set}${set}</div></div>`;
  }

  /* ---------- state ---------- */
  let railOpen = false;

  function setRail(open) {
    railOpen = open;
    $('#rail').classList.toggle('open', open);
    document.documentElement.style.setProperty('--rail-w-current', open ? '292px' : '78px');
    $('.main').style.marginLeft = window.innerWidth > 1023 ? (open ? '292px' : '78px') : '';
    const btn = $('#railToggle');
    if (btn) {
      btn.setAttribute('aria-label', open ? 'Collapse navigation' : 'Expand navigation');
      btn.querySelector('.rail-txt').textContent = 'Collapse';
    }
  }

  function openDrawer(id) {
    $('#' + id).classList.add('open');
    $('#scrim').classList.add('show');
    document.body.classList.add('no-scroll');
    const f = $('#' + id).querySelector('button,input,a');
    if (f) setTimeout(() => f.focus(), 120);
  }
  function closeAll() {
    ['mdrawer', 'cartDrawer', 'wishDrawer'].forEach(id => $('#' + id)?.classList.remove('open'));
    $('#searchOv')?.classList.remove('open');
    $('#scrim').classList.remove('show');
    document.body.classList.remove('no-scroll');
  }

  /* ---------- render badges + active state ---------- */
  function sync() {
    const c = App.cartCount(), w = App.wishlist.length;
    document.querySelectorAll('[data-count="cart"]').forEach(e => {
      e.textContent = c; e.style.display = c ? '' : 'none';
    });
    document.querySelectorAll('[data-count="wish"]').forEach(e => {
      e.textContent = w; e.style.display = w ? '' : 'none';
    });
    renderCart(); renderWish();
  }

  function markActive(route) {
    document.querySelectorAll('.rail-item[data-go]').forEach(b => {
      const r = b.getAttribute('data-go');
      b.classList.toggle('active', r && r !== '#/' ? route.startsWith(r) : route === '#/');
    });
    document.querySelectorAll('.rail-sub-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-go') === route);
    });
    // auto-expand the organic submenu when inside it
    if (route.startsWith('#/shop/organic')) {
      document.querySelectorAll('#sub-organic').forEach(s => s.classList.add('open'));
      document.querySelectorAll('[data-sub="organic"]').forEach(b => b.setAttribute('aria-expanded','true'));
    }
  }

  /* ---------- cart drawer ---------- */
  function renderCart() {
    const body = $('#cartBody'), foot = $('#cartFoot');
    if (!body) return;
    const cart = App.cart;
    if (!cart.length) {
      body.innerHTML = `<div class="empty"><div class="e-ico">🛒</div>
        <b>Your cart is empty</b>
        <p>Explore our homemade organic range and add something wholesome.</p>
        <button class="btn btn-primary btn-sm" data-go="#/shop/organic">Shop Organic Foods</button></div>`;
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map((c, i) => `
      <div class="citem">
        ${c.img ? `<img class="citem-thumb" src="${c.img}" alt="">`
                : `<div class="citem-thumb">${c.emoji || '📦'}</div>`}
        <div class="citem-info">
          <b>${App.esc(c.name)}</b>
          <span>${App.esc(c.size)}</span>
          <span class="citem-price">${App.inr(c.price * c.qty)}</span>
          <div class="qty" style="margin-top:8px;transform:scale(.86);transform-origin:left">
            <button data-q="${i}" data-d="-1" aria-label="Decrease quantity">−</button>
            <span>${c.qty}</span>
            <button data-q="${i}" data-d="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="citem-rm" data-rm="${i}" aria-label="Remove ${App.esc(c.name)}">✕</button>
      </div>`).join('');
    foot.innerHTML = `
      <div class="cart-tot"><span>Subtotal</span><b>${App.inr(App.cartTotal())}</b></div>
      <div class="cart-tot"><span>Delivery</span><span style="color:var(--muted)">Calculated at checkout</span></div>
      <div class="cart-tot grand"><span>Total</span><span>${App.inr(App.cartTotal())}</span></div>
      <button class="btn btn-primary btn-block" style="margin-top:16px" data-go="#/checkout">
        Proceed to Checkout</button>`;
  }

  /* ---------- wishlist drawer ---------- */
  function renderWish() {
    const body = $('#wishBody');
    if (!body) return;
    const list = App.wishlist.map(App.byKey).filter(Boolean);
    if (!list.length) {
      body.innerHTML = `<div class="empty"><div class="e-ico">♡</div>
        <b>No saved items yet</b>
        <p>Tap the heart on any product to keep it here for later.</p>
        <button class="btn btn-primary btn-sm" data-go="#/shop/organic">Browse Products</button></div>`;
      return;
    }
    body.innerHTML = list.map(p => `
      <div class="citem">
        ${p.img ? `<img class="citem-thumb" src="${p.img}" alt="">`
                : `<div class="citem-thumb">${p.emoji}</div>`}
        <div class="citem-info">
          <b>${App.esc(p.name)}</b>
          <span class="citem-price">${App.inr(p.price)}</span>
          <button class="btn btn-ghost btn-sm" style="margin-top:8px" data-go="#/product/${p.key}">View</button>
        </div>
        <button class="citem-rm" data-unwish="${p.key}" aria-label="Remove from wishlist">✕</button>
      </div>`).join('');
  }

  /* ---------- search ---------- */
  let searchIdx = -1, searchHits = [];
  function runSearch(q) {
    const out = $('#searchInner');
    q = q.trim().toLowerCase();
    if (!q) {
      out.innerHTML = `<p style="color:var(--muted);font-size:.9rem">
        Start typing to search ${App.ITEMS.length} products across our collections.</p>`;
      searchHits = []; return;
    }
    const catName = { malt:'Malt', readymix:'Ready Mix', masala:'Masala', laddu:'Laddu',
                      kitchen:'Kitchen', cleaning:'Cleaning', beauty:'Beauty', home:'Home', kids:'Kids' };
    searchHits = App.ITEMS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (catName[p.cat] || '').toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    ).slice(0, 24);
    searchIdx = -1;
    if (!searchHits.length) {
      out.innerHTML = `<div class="empty"><div class="e-ico">🔍</div>
        <b>No products found</b>
        <p>We couldn't find anything for “${App.esc(q)}”. Try a different word,
        or message us on WhatsApp and we'll help.</p>
        <a class="btn btn-wa btn-sm" href="${App.waLink('Hello Sri Lakshmi Mart, I am looking for: ' + q)}"
           target="_blank" rel="noopener">Ask on WhatsApp</a></div>`;
      return;
    }
    out.innerHTML = searchHits.map((p, i) => `
      <button class="sr-item" data-go="#/product/${p.key}" data-i="${i}">
        ${p.img ? `<img class="sr-thumb" src="${p.img}" alt="">`
                : `<div class="sr-thumb">${p.emoji}</div>`}
        <div class="sr-meta">
          <b>${App.esc(p.name)}</b>
          <span>${catName[p.cat] || p.cat} · ${p.kind === 'organic' ? 'Organic Foods' : 'Home & Kitchen'}</span>
        </div>
        <div class="sr-price">${App.inr(p.price)}</div>
      </button>`).join('');
  }
  function moveSearch(dir) {
    if (!searchHits.length) return;
    searchIdx = (searchIdx + dir + searchHits.length) % searchHits.length;
    const items = document.querySelectorAll('.sr-item');
    items.forEach(el => el.classList.remove('hl'));
    const el = items[searchIdx];
    if (el) { el.classList.add('hl'); el.scrollIntoView({ block:'nearest' }); }
  }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (window.innerWidth < 1024) return;
    const dot = $('#cur'), ring = $('#curRing');
    let x = 0, y = 0, rx = 0, ry = 0;
    addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px,${y}px)`;
    }, { passive:true });
    (function loop() {
      rx += (x - rx) * .16; ry += (y - ry) * .16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    addEventListener('mouseover', e => {
      const t = e.target.closest('a,button,.pcard,[data-go]');
      document.body.classList.remove('cur-link', 'cur-view');
      if (!t) return;
      if (t.classList.contains('pcard')) {
        document.body.classList.add('cur-view');
        ring.querySelector('span').textContent = 'View';
      } else document.body.classList.add('cur-link');
    });
  }

  /* ---------- product-card selection state ----------
     Quantity and size live here rather than in the DOM so a card keeps its
     selection while a list re-renders (filtering, sorting, search), and so the
     same product shown twice on a page stays in sync. */
  const cardQtyMap = new Map();
  const cardSize = new Map();
  const MAX_QTY = 99;

  const cardQty = key => cardQtyMap.get(key) || 1;

  function stockFor(key) {
    const item = App.byKey(key);
    // Respect stock if the catalogue ever carries it; unlimited when absent.
    const s = item && (item.stock ?? item.qtyAvailable);
    return (typeof s === 'number' && s >= 0) ? s : Infinity;
  }

  function setCardQty(key, next, scope) {
    const max = Math.min(MAX_QTY, stockFor(key));
    const q = Math.max(1, Math.min(max, next));          // never below 1
    cardQtyMap.set(key, q);
    (scope || document).querySelectorAll(`[data-qval="${key}"]`)
      .forEach(el => { el.textContent = q; });
    // disable the steppers at their limits so the boundary is visible, not silent
    (scope || document).querySelectorAll(`[data-qstep="${key}"]`).forEach(b => {
      const dir = +b.getAttribute('data-dir');
      b.disabled = dir < 0 ? q <= 1 : q >= max;
    });
    return q;
  }

  /** Re-apply remembered qty/size after any list re-render. */
  function restoreCards(root) {
    (root || document).querySelectorAll('[data-qval]').forEach(el => {
      const key = el.getAttribute('data-qval');
      setCardQty(key, cardQty(key), el.closest('.pcard') || document);
    });
    (root || document).querySelectorAll('.pcard').forEach(card => {
      const chip = card.querySelector('[data-psize]');
      if (!chip) return;
      const key = chip.getAttribute('data-psize');
      const want = cardSize.get(key);
      if (!want) return;
      const item = App.byKey(key);
      card.querySelectorAll(`[data-psize="${key}"]`).forEach(b => {
        const on = b.getAttribute('data-val') === want;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const priceEl = card.querySelector('.pcard-price');
      if (item && priceEl && priceEl.firstChild) {
        priceEl.firstChild.textContent = App.inr(App.priceFor(item, want));
      }
    });
  }

  /* ---------- mount ---------- */
  function mount() {
    $('#rail').innerHTML = `
      <div class="rail-head">
        <img class="rail-logo" src="assets/brand/logo-256.png"
             alt="Sri Lakshmi Homemade Products" width="42" height="42">
        <span class="rail-word">SRI LAKSHMI MART</span>
      </div>
      <nav class="rail-nav" aria-label="Main">${navHTML(true)}</nav>
      <div class="rail-foot">
        <button class="rail-toggle" id="railToggle" aria-label="Expand navigation">
          <span class="rail-ico"><i class="bi bi-chevron-double-right"></i></span>
          <span class="rail-txt">Collapse</span>
        </button>
      </div>`;

    $('#mdrawerBody').innerHTML = navHTML(false);
    $('#tickerHost').innerHTML = ticker();

    /* rail toggle */
    $('#railToggle').addEventListener('click', () => setRail(!railOpen));

    /* submenu accordions (both rail and mobile) */
    document.addEventListener('click', e => {
      const sb = e.target.closest('[data-sub]');
      if (!sb) return;
      const inRail = sb.closest('#rail');
      if (inRail && !railOpen) { setRail(true); }
      const panel = sb.parentElement.querySelector('.rail-sub');
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      sb.setAttribute('aria-expanded', String(open));
    });

    /* global delegated actions */
    document.addEventListener('click', e => {
      const go = e.target.closest('[data-go]');
      if (go && go.getAttribute('data-go')) {
        e.preventDefault(); closeAll();
        location.hash = go.getAttribute('data-go');
        return;
      }
      const act = e.target.closest('[data-act]');
      if (act) {
        const a = act.getAttribute('data-act');
        if (a === 'cart') openDrawer('cartDrawer');
        if (a === 'wishlist') openDrawer('wishDrawer');
        if (a === 'menu') openDrawer('mdrawer');
        if (a === 'search') { $('#searchOv').classList.add('open');
          document.body.classList.add('no-scroll'); setTimeout(()=>$('#searchInput').focus(),90); }
        if (a === 'close') closeAll();
        return;
      }
      const q = e.target.closest('[data-q]');
      if (q) {
        const i = +q.getAttribute('data-q'), d = +q.getAttribute('data-d');
        App.setQty(i, App.cart[i].qty + d); return;
      }
      const rm = e.target.closest('[data-rm]');
      if (rm) { App.removeItem(+rm.getAttribute('data-rm')); return; }
      const uw = e.target.closest('[data-unwish]');
      if (uw) { App.toggleWish(uw.getAttribute('data-unwish')); return; }
      const wish = e.target.closest('[data-wish]');
      if (wish) { e.preventDefault(); e.stopPropagation();
        App.toggleWish(wish.getAttribute('data-wish'));
        wish.classList.toggle('on', App.inWish(wish.getAttribute('data-wish'))); return; }
      /* ---- product-card quantity stepper ---- */
      const qs = e.target.closest('[data-qstep]');
      if (qs) {
        e.preventDefault(); e.stopPropagation();
        const key = qs.getAttribute('data-qstep');
        const dir = +qs.getAttribute('data-dir');
        setCardQty(key, cardQty(key) + dir, qs.closest('.pcard') || document);
        return;
      }

      /* ---- product-card size chips ---- */
      const ps = e.target.closest('[data-psize]');
      if (ps) {
        e.preventDefault(); e.stopPropagation();
        const key = ps.getAttribute('data-psize');
        cardSize.set(key, ps.getAttribute('data-val'));
        const scope = ps.closest('.pcard') || document;
        scope.querySelectorAll(`[data-psize="${key}"]`).forEach(b => {
          const on = b === ps;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        // keep the headline price in step with the chosen size
        const item = App.byKey(key);
        const priceEl = scope.querySelector('.pcard-price');
        if (item && priceEl && priceEl.firstChild) {
          priceEl.firstChild.textContent = App.inr(App.priceFor(item, cardSize.get(key)));
        }
        return;
      }

      const add = e.target.closest('[data-add]');
      if (add) {
        e.preventDefault(); e.stopPropagation();
        const key = add.getAttribute('data-add');
        const item = App.byKey(key);
        if (!item) return;
        const size = cardSize.get(key) || item.sizes[0];
        const qty = cardQty(key);
        App.addToCart(key, size, qty);
        // reset the card so the next customer interaction starts clean
        setCardQty(key, 1, add.closest('.pcard') || document);
        add.classList.add('added');
        setTimeout(() => add.classList.remove('added'), 900);
        return;
      }
    });

    $('#scrim').addEventListener('click', closeAll);

    /* search */
    const si = $('#searchInput');
    si.addEventListener('input', () => runSearch(si.value));
    si.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSearch(1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); moveSearch(-1); }
      if (e.key === 'Enter' && searchIdx > -1) {
        const p = searchHits[searchIdx]; closeAll(); location.hash = '#/product/' + p.key;
      }
    });
    $('#searchClear').addEventListener('click', () => { si.value=''; runSearch(''); si.focus(); });

    /* keyboard */
    addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll();
      if (e.key === '/' && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault();
        $('#searchOv').classList.add('open');
        document.body.classList.add('no-scroll');
        setTimeout(()=>si.focus(), 90);
      }
    });

    addEventListener('resize', () => {
      $('.main').style.marginLeft = window.innerWidth > 1023 ? (railOpen ? '292px':'78px') : '';
    });

    App.onChange(sync);
    sync();
    initCursor();
    runSearch('');
  }

  return { mount, sync, markActive, closeAll, NAV, restoreCards, cardQty };
})();
