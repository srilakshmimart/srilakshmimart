/* ============================================================
   VIEWS + ROUTER
   All copy below is the client's existing content, re-presented.
   ============================================================ */
window.Views = (function () {
  const D = App.D, esc = App.esc, inr = App.inr;
  const view = () => document.getElementById('view');

  const CAT_LABEL = {
    malt: 'Malt', readymix: 'Ready Mix', masala: 'Masala', laddu: 'Laddu',
    kitchen: 'Kitchen', cleaning: 'Cleaning', beauty: 'Beauty', home: 'Home', kids: 'Kids'
  };

  /* ================= shared pieces ================= */

  function productCard(p) {
    const wished = App.inWish(p.key);
    return `
    <article class="pcard reveal" data-tilt>
      <button class="pcard-wish ${wished ? 'on' : ''}" data-wish="${p.key}"
              aria-label="${wished ? 'Remove from' : 'Add to'} wishlist" aria-pressed="${wished}">
        <i class="bi ${wished ? 'bi-heart-fill' : 'bi-heart'}"></i>
      </button>
      <a class="pcard-media" href="#/product/${p.key}" aria-label="View ${esc(p.name)}">
        ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" decoding="async">`
        : `<span class="pcard-emoji" aria-hidden="true">${p.emoji}</span>`}
      </a>
      <div class="pcard-body">
        <span class="pcard-cat">${CAT_LABEL[p.cat] || p.cat}</span>
        <h3 class="pcard-name"><a href="#/product/${p.key}">${esc(p.name)}</a></h3>
        <p class="pcard-desc">${esc(p.desc)}</p>
        <div class="pcard-foot">
          <div class="pcard-price">${inr(p.price)}
            <small>${p.sizes.length > 1 ? `from · ${p.sizes.length} sizes` : esc(p.sizes[0] || '')}</small>
          </div>
        </div>
        ${p.sizes.length > 1 ? `
        <div class="pcard-sizes" role="group" aria-label="Choose size for ${esc(p.name)}">
          ${p.sizes.map((sz, i) => `
            <button class="psize ${i === 0 ? 'on' : ''}" data-psize="${p.key}" data-val="${esc(sz)}"
                    aria-pressed="${i === 0}">${esc(sz)}</button>`).join('')}
        </div>` : ''}
        <div class="pcard-buy">
          <div class="qstep" role="group" aria-label="Quantity for ${esc(p.name)}">
            <button class="qstep-btn" data-qstep="${p.key}" data-dir="-1"
                    aria-label="Decrease quantity">−</button>
            <span class="qstep-val" data-qval="${p.key}" aria-live="polite"
                  aria-label="Quantity">1</span>
            <button class="qstep-btn" data-qstep="${p.key}" data-dir="1"
                    aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-primary btn-sm pcard-cta" data-add="${p.key}"
                  aria-label="Add ${esc(p.name)} to cart">Add to Cart</button>
        </div>
      </div>
    </article>`;
  }

  const crumb = trail => `<nav class="eyebrow" style="margin-bottom:6px" aria-label="Breadcrumb">
      ${trail.map((t, i) => i < trail.length - 1
    ? `<a href="${t.href}" style="color:inherit">${esc(t.label)}</a> <span style="opacity:.5">/</span> `
    : `<span style="color:var(--ink-2)">${esc(t.label)}</span>`).join('')}
    </nav>`;

  /* ================= HOME ================= */
  function home() {
    const featured = D.products.filter(p => p.img).slice(0, 8)
      .map(p => App.byKey('p' + p.id));
    /* Real categories only. Every tile uses the same drawn icon treatment
       so the row reads as one set — product photography belongs on the
       product cards, not here. */
    const cats = [
      {
        c: 'organic', name: 'Homemade Foods', img: 'assets/categories/organic.svg',
        note: D.products.length + ' Products', route: '#/shop/organic', live: true
      },
      {
        c: 'home', name: 'Home & Kitchen', img: 'assets/categories/home.svg',
        note: D.accessories.length + ' Products', route: '#/shop/home', live: true
      },
      {
        c: 'women', name: "Women's Clothing", img: 'assets/categories/women.svg',
        note: 'Coming Soon', route: '#/soon/women', live: false
      },
      {
        c: 'kids', name: 'Kids Wear', img: 'assets/categories/kids.svg',
        note: 'Coming Soon', route: '#/soon/kids', live: false
      },
      {
        c: 'jewel', name: 'Jewellery', img: 'assets/categories/jewellery.svg',
        note: 'Coming Soon', route: '#/soon/jewellery', live: false
      },
      {
        c: 'gift', name: 'Gift Items', img: 'assets/categories/gifts.svg',
        note: 'Coming Soon', route: '#/soon/gifts', live: false
      }
    ];

    const collections = [
      { k: 'malt', n: 'Malt', d: 'Sprouted grain malts, rich in calcium and iron — the wholesome start to a day.' },
      { k: 'readymix', n: 'Ready Mix', d: 'Dosai and pongal mixes made from millets and traditional rice.' },
      { k: 'masala', n: 'Masala', d: 'Hand-roasted spice blends ground fresh, with no artificial colours.' },
      { k: 'laddu', n: 'Laddu', d: 'Millet laddus sweetened with jaggery — a guilt-free traditional sweet.' }
    ].map(c => ({ ...c, items: D.products.filter(p => p.cat === c.k) }));

    return `
    ${Hero.build()}

    <section class="sec shell-wide" id="categories">
      <div class="sec-head center reveal" style="margin-bottom:clamp(18px,2.4vw,30px)">
        <span class="eyebrow">Our Collections</span>
        <h2>Shop By Category</h2>
      </div>
      <div class="cat-rail" role="list">
        ${cats.map((c, i) => `
          <button class="ctile ${c.live ? '' : 'soon'}" data-c="${c.c}" role="listitem"
                  data-go="${c.route}" aria-label="${esc(c.name)} — ${esc(c.note)}">
            <span class="ctile-img"><img src="${c.img}" alt="" loading="lazy"
                  width="150" height="150" decoding="async"></span>
            <span class="ctile-name">${esc(c.name)}</span>
            <span class="ctile-note">${esc(c.note)}</span>
          </button>`).join('')}
      </div>
    </section>

    <section class="sec shell-wide" style="padding-top:0">
      <div class="sec-head reveal">
        <span class="eyebrow">Signature Range</span>
        <h2>Our Best Loved Products</h2>
        <p>Handcrafted using traditional recipes — wholesome goodness for your family.</p>
      </div>
      <div class="p-grid">${featured.map(productCard).join('')}</div>
      <div style="margin-top:22px" class="reveal">
        <a class="btn btn-ghost" href="#/shop/organic">View all ${D.products.length} organic products →</a>
      </div>
    </section>

    <section class="sec" style="background:var(--forest-deep);color:var(--on-dark)">
      <div class="shell-wide">
        <div class="sec-head reveal" style="max-width:640px">
          <span class="eyebrow" style="color:var(--gold-light)">Homemade · Fresh · Natural</span>
          <h2 style="color:#fff">The Organic Foods Collection</h2>
          <p style="color:rgba(234,229,216,.78)">Four traditional families of products,
             each made in small batches from ingredients we source ourselves.</p>
        </div>
        <div class="rail-scroll">
          ${collections.map(c => `
            <a class="reveal" href="#/shop/organic/${c.k}" style="
               background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
               border-radius:var(--r-lg);padding:18px;display:block;transition:background .3s">
              <div style="font-size:1.7rem;margin-bottom:10px">${c.items[0]?.emoji || '🌿'}</div>
              <h3 style="color:#fff;font-size:1.24rem">${esc(c.n)}</h3>
              <p style="font-size:.84rem;color:rgba(234,229,216,.7);margin-top:7px;line-height:1.5">
                ${esc(c.d)}</p>
              <div style="margin-top:13px;font-size:.78rem;color:var(--gold-light);font-weight:600">
                ${c.items.length} products →</div>
            </a>`).join('')}
        </div>
      </div>
    </section>

    <section class="sec shell-wide">
      <div class="sec-head center reveal">
        <span class="eyebrow">Why Choose Us</span>
        <h2>The Sri Lakshmi Promise</h2>
      </div>
      <div class="why-grid reveal">
        ${[
        ['🏠', 'Homemade Quality', 'Each product is made in small batches, ensuring consistent quality and the personal touch factory products can never replicate.'],
        ['📜', 'Traditional Recipes', 'Our recipes are rooted in centuries-old Tamil culinary wisdom, preserved and passed down through generations.'],
        ['🌾', 'Premium Ingredients', 'We source the finest organic ingredients directly from trusted local farmers, ensuring purity and nutritional excellence.'],
        ['✅', 'FSSAI Certified', `Licensed under FSSAI (${D.brand.fssai}), our products meet rigorous national food safety standards for your peace of mind.`],
        ['🤲', 'Carefully Prepared', 'Every item is prepared with meticulous care, maintaining hygiene and quality standards at every step of production.'],
        ['💚', 'Trusted Service', 'We build lasting relationships through honest pricing, reliable delivery, and genuine after-sales support across all our services.']
      ].map(([i, t, d]) => `
          <div class="why-item"><div class="why-ico">${i}</div><h4>${t}</h4><p>${d}</p></div>`).join('')}
      </div>
    </section>

    ${reviewsSection()}

    <section class="sec shell-wide">
      <div class="story">
        <div class="story-visual reveal"><img src="assets/bg2.jpg" alt="Sri Lakshmi Mart products" loading="lazy"></div>
        <div class="reveal" data-d="1">
          <span class="eyebrow">Our Story</span>
          <h2 style="font-size:var(--fs-h1);margin:10px 0 14px">A Vision Beyond the Ordinary</h2>
          <p class="lede">Our journey began with a vision to create meaningful experiences and deliver
            exceptional value across multiple industries. What started as a passion-driven initiative
            has evolved into a dynamic organization committed to quality, innovation, and customer satisfaction.</p>
          <p class="lede" style="margin-top:11px">Today, we proudly offer a diverse range of services
            tailored to meet the evolving needs of our customers. Through dedication, creativity, and a
            customer-first approach, we continue to build lasting relationships and deliver solutions
            that make a positive impact.</p>
          <div class="stat-row">
            <div class="stat"><b>100%</b><span>Natural Ingredients</span></div>
            <div class="stat"><b>FSSAI</b><span>Certified & Licensed</span></div>
            <div class="stat"><b>0</b><span>Artificial Preservatives</span></div>
            <div class="stat"><b>${D.products.length + D.accessories.length}</b><span>Products Available</span></div>
          </div>
          <a class="btn btn-ghost" style="margin-top:20px" href="#/about">Read our full story →</a>
        </div>
      </div>
    </section>

    ${waBanner()}`;
  }

  /* ================= REVIEWS (client-provided, verbatim) ================= */
  const REVIEWS = [
    {
      t: 'The Ragi Malt is absolutely divine! My children love it every morning. You can taste the difference of real, homemade goodness. Will never go back to store-bought.',
      n: 'Priya Murugan', l: 'Dharmapuri, Tamil Nadu', i: 'PM'
    },
    {
      t: 'I ordered the Murungai Malt and Sambar Powder together. The quality and freshness is unmatched. WhatsApp ordering was so simple and delivery was prompt.',
      n: 'Suresh Kumar', l: 'Krishnagiri, Tamil Nadu', i: 'SK'
    },
    {
      t: 'The Nut Laddu is a healthy treat for my elderly parents. Pure ingredients, no artificial flavours, and it tastes exactly like what my grandmother used to make!',
      n: 'Anitha Lakshmi', l: 'Salem, Tamil Nadu', i: 'AL'
    }
  ];
  function reviewsSection() {
    return `
    <section class="sec" style="background:var(--background-alt)">
      <div class="shell-wide">
        <div class="rev-wrap">
          <div class="reveal">
            <span class="eyebrow">Customer Love</span>
            <h2 style="font-size:var(--fs-h1);margin:11px 0 12px">What Families Say</h2>
            <p class="lede">Real words from families across Tamil Nadu who cook with our products.</p>
            <div class="rev-ctrl">
              <button class="rev-arrow" id="revPrev" aria-label="Previous review">
                <i class="bi bi-chevron-left"></i></button>
              <div class="rev-dots" id="revDots" role="tablist" aria-label="Choose a review">
                ${REVIEWS.map((r, i) => `<button class="rev-dot ${i ? '' : 'on'}" data-rev="${i}"
                   role="tab" aria-selected="${!i}"
                   aria-label="Review from ${esc(r.n)}"></button>`).join('')}
              </div>
              <button class="rev-arrow" id="revNext" aria-label="Next review">
                <i class="bi bi-chevron-right"></i></button>
            </div>
          </div>
          <div class="rev-stage reveal" data-d="1" id="revStage" aria-live="polite">
            ${REVIEWS.map((r, i) => `
              <div class="rev-feature ${i ? '' : 'on'}" data-slide="${i}"
                   role="tabpanel" aria-hidden="${i ? 'true' : 'false'}">${reviewCard(i)}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>`;
  }
  function reviewCard(i) {
    const r = REVIEWS[i];
    return `<span class="rev-quote" aria-hidden="true">&ldquo;</span>
      <div class="rev-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p class="rev-text">${esc(r.t)}</p>
      <div class="rev-who">
        <div class="rev-av">${r.i}</div>
        <div><b>${esc(r.n)}</b><span>${esc(r.l)}</span></div>
      </div>`;
  }

  /* Auto-rotating review carousel.
     Text and ratings come from REVIEWS above, which is the client's own
     content — the carousel only changes which one is on screen. */
  function wireReviews() {
    const stage = document.getElementById('revStage');
    if (!stage) return;
    const cards = [...stage.querySelectorAll('.rev-feature')];
    const dots = [...document.querySelectorAll('#revDots .rev-dot')];
    if (cards.length < 2) return;

    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    let i = 0, timer = null;

    function show(n) {
      i = (n + cards.length) % cards.length;
      cards.forEach((c, k) => {
        c.classList.toggle('on', k === i);
        c.setAttribute('aria-hidden', String(k !== i));
      });
      dots.forEach((d, k) => {
        d.classList.toggle('on', k === i);
        d.setAttribute('aria-selected', String(k === i));
      });
    }
    const start = () => { if (!reduced && !timer) timer = setInterval(() => show(i + 1), 2600); };
    const stop = () => { clearInterval(timer); timer = null; };
    // a manual choice restarts the clock so it never cuts the reader off
    const jump = n => { show(n); stop(); start(); };

    document.getElementById('revNext').onclick = () => jump(i + 1);
    document.getElementById('revPrev').onclick = () => jump(i - 1);
    document.getElementById('revDots').addEventListener('click', e => {
      const b = e.target.closest('[data-rev]');
      if (b) jump(+b.getAttribute('data-rev'));
    });

    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', e => { if (!stage.contains(e.relatedTarget)) start(); });

    /* swipe, one review at a time on a phone */
    let x0 = null, y0 = null, moved = false;
    stage.addEventListener('touchstart', e => {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; moved = false; stop();
    }, { passive: true });
    stage.addEventListener('touchmove', e => {
      if (x0 === null) return;
      const dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
      if (!moved && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) moved = true;
    }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 !== null && moved) {
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) jump(dx < 0 ? i + 1 : i - 1);
      }
      x0 = y0 = null; start();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(en => en.isIntersecting ? start() : stop()),
        { threshold: .25 }).observe(stage);
    } else start();
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    Views._revStop = stop;
  }

  const waBanner = () => `
    <section class="sec-tight">
      <div class="shell">
        <div class="reveal" style="background:linear-gradient(140deg,var(--primary),var(--primary-dark));
             border-radius:var(--r-xl);padding:clamp(24px,3.4vw,42px);text-align:center;color:#fff">
          <span class="eyebrow" style="color:var(--gold-light);justify-content:center">Order Directly</span>
          <h2 style="font-size:var(--fs-h1);margin:11px 0 10px;color:#fff">Order on WhatsApp</h2>
          <p style="color:rgba(234,229,216,.8);max-width:48ch;margin:0 auto 20px">
            Message us your order and we'll confirm dispatch personally —
            the simplest way to shop with us.</p>
          <a class="btn btn-wa" target="_blank" rel="noopener"
             href="${App.waLink('Hello Sri Lakshmi Mart, I would like to place an order.')}">
            <i class="bi bi-whatsapp"></i> ${esc(D.brand.phoneDisplay)}</a>
        </div>
      </div>
    </section>`;

  /* ================= SHOP ================= */
  let shopState = { kind: 'organic', cat: 'all', sort: 'default', q: '' };

  function shop(kind, cat) {
    shopState.kind = kind;
    shopState.cat = cat || 'all';
    const isOrganic = kind === 'organic';
    const filters = isOrganic
      ? [['all', 'All'], ['malt', 'Malt'], ['readymix', 'Ready Mix'], ['masala', 'Masala'], ['laddu', 'Laddu']]
      : [['all', 'All'], ['kitchen', 'Kitchen'], ['cleaning', 'Cleaning'], ['beauty', 'Beauty'], ['home', 'Home'], ['kids', 'Kids']];

    return `
    <div class="shell-wide" style="padding-top:var(--sp-6)">
      ${crumb([{ label: 'Home', href: '#/' }, { label: isOrganic ? 'Homemade Organic Foods' : 'Home & Kitchen' }])}
      <div class="sec-head" style="margin-bottom:var(--sp-5)">
        <h2>${isOrganic ? 'Homemade Organic Foods' : 'Home & Kitchen Accessories'}</h2>
        <p>${isOrganic
        ? 'Crafted with traditional recipes, premium ingredients, and the love of a homemade kitchen.'
        : 'Premium quality kitchen tools, home essentials, beauty & lifestyle products at great prices.'}</p>
      </div>
      <div class="fbar">
        ${filters.map(([k, l]) => `<button class="fchip ${shopState.cat === k ? 'on' : ''}"
           data-filter="${k}">${l}</button>`).join('')}
        <div class="spacer"></div>
        <select class="fsel" id="sortSel" aria-label="Sort products">
          <option value="default">Sort: Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="az">Name: A–Z</option>
        </select>
      </div>
      <div class="p-grid" id="shopGrid"></div>
    </div>`;
  }

  function renderShop() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    let list = App.ITEMS.filter(p => p.kind === (shopState.kind === 'organic' ? 'organic' : 'home'));
    if (shopState.cat !== 'all') list = list.filter(p => p.cat === shopState.cat);
    const s = shopState.sort;
    if (s === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (s === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (s === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = list.length
      ? list.map(productCard).join('')
      : `<div class="empty" style="grid-column:1/-1"><div class="e-ico">📦</div>
          <b>No products in this filter</b>
          <p>Try another category, or browse everything in this collection.</p>
          <button class="btn btn-primary btn-sm" data-filter="all">Show all</button></div>`;
    App.observeReveals(grid);
    Shell.restoreCards(grid);
    requestAnimationFrame(() => grid.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
  }

  /* ================= PRODUCT DETAIL ================= */
  let pdp = { size: null, qty: 1 };

  function product(key) {
    const p = App.byKey(key);
    if (!p) return notFound();
    pdp = { size: p.sizes[0], qty: 1 };
    const isOrganic = p.kind === 'organic';
    const related = App.ITEMS.filter(x => x.kind === p.kind && x.cat === p.cat && x.key !== p.key).slice(0, 4);

    return `
    <div class="shell-wide" style="padding-top:var(--sp-6)">
      ${crumb([{ label: 'Home', href: '#/' },
    { label: isOrganic ? 'Organic Foods' : 'Home & Kitchen', href: isOrganic ? '#/shop/organic' : '#/shop/home' },
    { label: p.name }])}
      <div class="pdp" style="margin-top:var(--sp-5)">
        <div class="pdp-media">
          <div class="pdp-main">
            ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" id="pdpImg">`
        : `<span class="big-emoji" aria-hidden="true">${p.emoji}</span>`}
          </div>
        </div>
        <div>
          <span class="eyebrow">${CAT_LABEL[p.cat] || p.cat}</span>
          <h1>${esc(p.name)}</h1>
          <div class="pdp-price" id="pdpPrice">${inr(App.priceFor(p, pdp.size))}</div>
          <p class="lede">${esc(p.desc)}</p>

          ${p.benefits?.length ? `
          <div class="pdp-block"><h4>Key Benefits</h4>
            <div class="ben-list">${p.benefits.map(b => `<span class="chip chip-green">${esc(b)}</span>`).join('')}</div>
          </div>` : ''}

          <div class="pdp-block">
            <h4>${isOrganic ? 'Available Sizes' : 'Pack Size'}</h4>
            <div class="size-row" id="sizeRow">
              ${p.sizes.map((s, i) => `
                <button class="size-btn ${i === 0 ? 'on' : ''}" data-size="${esc(s)}">
                  ${esc(s)}<small>${inr(App.priceFor(p, s))}</small></button>`).join('')}
            </div>
          </div>

          <div class="pdp-block">
            <h4>Quantity</h4>
            <div class="qty-row">
              <div class="qty">
                <button id="qMinus" aria-label="Decrease quantity">−</button>
                <span id="qVal">1</span>
                <button id="qPlus" aria-label="Increase quantity">+</button>
              </div>
              <span style="color:var(--muted);font-size:var(--fs-sm)" id="lineTotal">
                Total ${inr(App.priceFor(p, pdp.size))}</span>
            </div>
          </div>

          <div class="pdp-actions">
            <button class="btn btn-primary" id="pdpAdd"><i class="bi bi-bag-plus"></i> Add to Cart</button>
            <a class="btn btn-wa" id="pdpWa" target="_blank" rel="noopener"
               href="${App.waLink(`Hello Sri Lakshmi Mart, I am interested in ${p.name}.`)}">
               <i class="bi bi-whatsapp"></i> Order on WhatsApp</a>
            <button class="btn btn-ghost" data-wish="${p.key}" style="flex:0 0 auto;min-width:auto;padding-inline:18px"
                    aria-label="Save to wishlist"><i class="bi bi-heart"></i></button>
          </div>

          ${p.howto ? `
          <div class="pdp-block"><h4>How to Use</h4>
            <p style="color:var(--ink-2)">${esc(p.howto)}</p></div>` : ''}

          ${p.weight ? `
          <div class="pdp-block"><h4>Details</h4>
            <p style="color:var(--ink-2)">Weight: ${esc(p.weight)}</p></div>` : ''}

          <div class="pdp-block">
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <span class="chip chip-gold">FSSAI ${esc(D.brand.fssai)}</span>
              <span class="chip">Made in Uthangarai</span>
            </div>
          </div>
        </div>
      </div>

      ${related.length ? `
      <section class="sec" style="padding-bottom:var(--section-y)">
        <div class="sec-head"><span class="eyebrow">You may also like</span>
          <h2 style="font-size:var(--fs-h2)">More from ${CAT_LABEL[p.cat] || p.cat}</h2></div>
        <div class="p-grid">${related.map(productCard).join('')}</div>
      </section>` : ''}
    </div>`;
  }

  function wirePdp(key) {
    const p = App.byKey(key); if (!p) return;
    const price = () => App.priceFor(p, pdp.size);
    const sync = () => {
      document.getElementById('pdpPrice').textContent = inr(price());
      document.getElementById('qVal').textContent = pdp.qty;
      document.getElementById('lineTotal').textContent = 'Total ' + inr(price() * pdp.qty);
      document.getElementById('pdpWa').href = App.waLink(
        `Hello Sri Lakshmi Mart, I am interested in ${p.name} (${pdp.size}) × ${pdp.qty}.`);
    };
    document.getElementById('sizeRow')?.addEventListener('click', e => {
      const b = e.target.closest('[data-size]'); if (!b) return;
      pdp.size = b.getAttribute('data-size');
      document.querySelectorAll('#sizeRow .size-btn').forEach(x => x.classList.remove('on'));
      b.classList.add('on'); sync();
    });
    document.getElementById('qMinus').onclick = () => { pdp.qty = Math.max(1, pdp.qty - 1); sync(); };
    document.getElementById('qPlus').onclick = () => { pdp.qty = Math.min(99, pdp.qty + 1); sync(); };
    document.getElementById('pdpAdd').onclick = () => App.addToCart(key, pdp.size, pdp.qty);
  }

  /* ================= CHECKOUT ================= */
  function checkout() {
    if (!App.cart.length) {
      return `<div class="shell" style="padding-top:var(--sp-7)">
        <div class="empty"><div class="e-ico">🛒</div><b>Your cart is empty</b>
        <p>Add a few products before checking out.</p>
        <button class="btn btn-primary btn-sm" data-go="#/shop/organic">Start Shopping</button></div></div>`;
    }
    return `
    <div class="shell" style="padding-top:var(--sp-6);padding-bottom:var(--section-y)">
      ${crumb([{ label: 'Home', href: '#/' }, { label: 'Checkout' }])}
      <div class="sec-head" style="margin-bottom:var(--sp-6)"><h2>Checkout</h2>
        <p>Fill in your delivery details — we'll confirm your order over WhatsApp.</p></div>
      <div class="contact-grid">
        <div>
          <h3 style="font-size:1.1rem;margin-bottom:18px">Delivery Details</h3>
          <div class="field"><label for="ck-name">Full Name <span class="req">*</span></label>
            <input id="ck-name" autocomplete="name" required></div>
          <div class="field"><label for="ck-phone">WhatsApp Number <span class="req">*</span></label>
            <input id="ck-phone" inputmode="numeric" autocomplete="tel" placeholder="10-digit number" required></div>
          <div class="field"><label for="ck-address">Street / Area <span class="req">*</span></label>
            <input id="ck-address" autocomplete="street-address" required></div>
          <div class="field-row">
            <div class="field"><label for="ck-city">City / Town <span class="req">*</span></label>
              <input id="ck-city" autocomplete="address-level2" required></div>
            <div class="field"><label for="ck-pincode">Pincode <span class="req">*</span></label>
              <input id="ck-pincode" inputmode="numeric" autocomplete="postal-code" required></div>
          </div>
          <div class="field"><label for="ck-state">State <span class="req">*</span></label>
            <input id="ck-state" autocomplete="address-level1" value="Tamil Nadu" required></div>
          <p style="font-size:var(--fs-xs);color:var(--muted);margin-top:8px">
            All fields are required. Your details are sent only to Sri Lakshmi Mart on WhatsApp.</p>
        </div>
        <div>
          <div style="background:var(--surface);border:1px solid var(--line-soft);
               border-radius:var(--r-lg);padding:24px;position:sticky;top:90px">
            <h3 style="font-size:1.1rem;margin-bottom:16px">Order Summary</h3>
            ${App.cart.map(c => `
              <div style="display:flex;justify-content:space-between;gap:12px;padding-block:9px;
                   border-bottom:1px solid var(--line-soft);font-size:.88rem">
                <span>${esc(c.name)} <span style="color:var(--muted)">(${esc(c.size)}) × ${c.qty}</span></span>
                <b style="white-space:nowrap">${inr(c.price * c.qty)}</b></div>`).join('')}
            <div class="cart-tot grand"><span>Total</span><span>${inr(App.cartTotal())}</span></div>
            <button class="btn btn-wa btn-block" style="margin-top:18px" id="placeOrder">
              <i class="bi bi-whatsapp"></i> Place Order on WhatsApp</button>
            <p style="font-size:var(--fs-xs);color:var(--muted);margin-top:12px;text-align:center">
              Opens WhatsApp with your order pre-filled. Delivery is confirmed by our team.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function wireCheckout() {
    const btn = document.getElementById('placeOrder');
    if (!btn) return;
    btn.onclick = () => {
      const g = id => (document.getElementById(id)?.value || '').trim();
      const bad = id => { const el = document.getElementById(id); el.classList.add('bad'); el.focus(); };
      document.querySelectorAll('.field input').forEach(i => i.classList.remove('bad'));

      const name = g('ck-name');
      const phone = g('ck-phone').replace(/\D/g, '');
      const address = g('ck-address'), city = g('ck-city');
      const pincode = g('ck-pincode').replace(/\D/g, ''), state = g('ck-state');

      if (!name) { App.toast('Please enter your name', 'err'); return bad('ck-name'); }
      if (phone.length < 10) { App.toast('Enter a valid 10-digit WhatsApp number', 'err'); return bad('ck-phone'); }
      if (!address) { App.toast('Please enter your street / area', 'err'); return bad('ck-address'); }
      if (!city) { App.toast('Please enter your city / town', 'err'); return bad('ck-city'); }
      if (pincode.length < 6) { App.toast('Enter a valid 6-digit pincode', 'err'); return bad('ck-pincode'); }
      if (!state) { App.toast('Please enter your state', 'err'); return bad('ck-state'); }

      const orderId = 'SL' + Date.now();       // preserves the original ID scheme
      const msg = App.orderMessage({ orderId, name, phone, address, city, pincode, state });

      App.saveOrder({
        id: orderId, customer: name, phone,
        loc: `${address}, ${city} - ${pincode}, ${state}`,
        products: App.cart.map(c => ({ name: c.name, cat: c.cat, qty: c.qty, price: c.price })),
        date: new Date().toISOString().split('T')[0],
        amount: App.cartTotal(), payment: 'Pending', status: 'Pending'
      });

      window.open(App.waLink(msg), '_blank', 'noopener');
      App.clearCart();
      location.hash = '#/thanks/' + orderId;
    };
  }

  const thanks = id => `
    <div class="shell" style="padding-block:var(--section-y-lg)">
      <div class="empty">
        <div class="e-ico" style="font-size:3.4rem">🌿</div>
        <b style="font-size:1.6rem">Thank you for your order</b>
        <p>Your order <strong>${esc(id)}</strong> has been sent to us on WhatsApp.
           We'll confirm dispatch shortly.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" data-go="#/shop/organic">Continue Shopping</button>
          <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener"
             href="${App.waLink('Hello Sri Lakshmi Mart, I have a question about order ' + id)}">
             Message us</a>
        </div>
      </div>
    </div>`;

  /* ================= ABOUT ================= */
  const about = () => `
    <div class="shell-wide" style="padding-top:var(--sp-6)">
      ${crumb([{ label: 'Home', href: '#/' }, { label: 'About Us' }])}
      <div class="sec-head" style="margin-bottom:var(--sp-7)">
        <span class="eyebrow">Our Story</span>
        <h2>Where Vision Meets Excellence</h2>
      </div>
      <div class="story">
        <div class="story-visual reveal"><img src="assets/bg1.jpg" alt="Sri Lakshmi Mart organic products" loading="lazy"></div>
        <div class="reveal" data-d="1">
          <p class="lede">Our journey began with a vision to create meaningful experiences and deliver
            exceptional value across multiple industries. What started as a passion-driven initiative
            has evolved into a dynamic organization committed to quality, innovation, and customer satisfaction.</p>
          <p class="lede" style="margin-top:11px">Today, we proudly offer a diverse range of services
            tailored to meet the evolving needs of our customers. Through dedication, creativity, and a
            customer-first approach, we continue to build lasting relationships and deliver solutions
            that make a positive impact.</p>
          <p class="lede" style="margin-top:11px">Our mission is to provide excellence in every service
            we offer while maintaining the highest standards of integrity, reliability, and innovation.</p>
          <div class="stat-row">
            <div class="stat"><b>100%</b><span>Natural Ingredients</span></div>
            <div class="stat"><b>FSSAI</b><span>Certified & Licensed</span></div>
            <div class="stat"><b>0</b><span>Artificial Preservatives</span></div>
            <div class="stat"><b>${D.products.length + D.accessories.length}</b><span>Products Available</span></div>
          </div>
        </div>
      </div>
      <section class="sec">
        <div class="sec-head"><span class="eyebrow">Our Values</span>
          <h2 style="font-size:var(--fs-h2)">What we stand for</h2></div>
        <div style="display:flex;gap:11px;flex-wrap:wrap">
          ${['Integrity', 'Quality', 'Innovation', 'Trust', 'Reliability', 'Customer First']
      .map(v => `<span class="chip" style="padding:9px 18px;font-size:.85rem">${v}</span>`).join('')}
        </div>
      </section>
      <section class="sec" style="padding-top:0">
        <div class="why-grid">
          ${[
      ['🏠', 'Homemade Quality', 'Each product is made in small batches, ensuring consistent quality and the personal touch factory products can never replicate.'],
      ['📜', 'Traditional Recipes', 'Our recipes are rooted in centuries-old Tamil culinary wisdom, preserved and passed down through generations.'],
      ['🌾', 'Premium Ingredients', 'We source the finest organic ingredients directly from trusted local farmers, ensuring purity and nutritional excellence.'],
      ['✅', 'FSSAI Certified', `Licensed under FSSAI (${D.brand.fssai}), our products meet rigorous national food safety standards for your peace of mind.`],
      ['🤲', 'Carefully Prepared', 'Every item is prepared with meticulous care, maintaining hygiene and quality standards at every step of production.'],
      ['💚', 'Trusted Service', 'We build lasting relationships through honest pricing, reliable delivery, and genuine after-sales support across all our services.']
    ].map(([i, t, d]) => `<div class="why-item"><div class="why-ico">${i}</div><h4>${t}</h4><p>${d}</p></div>`).join('')}
        </div>
      </section>
    </div>`;

  /* ================= CONTACT =================
     Form left, business details right, map full width beneath both.
     Every value below is the client's real information. */
  const contact = () => `
    <div class="shell-wide" style="padding-top:var(--sp-5)">
      ${crumb([{ label: 'Home', href: '#/' }, { label: 'Contact Us' }])}
      <div class="sec-head" style="margin-bottom:var(--sp-5)">
        <span class="eyebrow">Find Us</span><h2>Get In Touch</h2>
        <p>We'd love to hear from you. Message us on WhatsApp or visit us in Uthangarai.</p>
      </div>

      <div class="cx-top">
        <div class="cx-form">
          <h3>Send us a Message</h3>
          <p class="cx-form-sub">Have a question or want to place a custom order?
            Send us your details and we'll get back to you shortly.</p>
          <div class="field"><label for="cf-name">Your Name</label>
          <input id="cf-name" autocomplete="name"></div>

          <div class="field"><label for="cf-phone">Phone Number</label>
            <input id="cf-phone" inputmode="numeric" autocomplete="tel"></div>

          <div class="field"><label for="cf-msg">Message</label>
            <textarea id="cf-msg" rows="2"></textarea></div>
            
          <button class="btn btn-primary btn-block" id="cfSend" type="button">
            <i class="bi bi-send"></i> Submit</button>
        </div>

        <aside class="cx-info">
          <div class="cx-card"><div class="cx-ico"><i class="bi bi-geo-alt"></i></div><div>
            <h5>Our Location</h5><p>Uthangarai, Krishnagiri District,<br>Tamil Nadu, India</p></div></div>
          <div class="cx-card"><div class="cx-ico"><i class="bi bi-whatsapp"></i></div><div>
            <h5>WhatsApp &amp; Phone</h5>
            <p><a href="${App.waLink('Hello Sri Lakshmi Mart!')}" target="_blank" rel="noopener"
                  style="color:var(--primary)">${esc(D.brand.phoneDisplay)}</a></p></div></div>
          <div class="cx-card"><div class="cx-ico"><i class="bi bi-patch-check"></i></div><div>
            <h5>FSSAI License</h5><p>${esc(D.brand.fssai)}</p></div></div>
          <a class="btn btn-wa btn-block" target="_blank" rel="noopener"
             href="${App.waLink('Hello Sri Lakshmi Mart, I would like to know more about your products.')}">
             <i class="bi bi-whatsapp"></i> Chat on WhatsApp</a>
        </aside>
      </div>
    </div>

    <div class="shell-wide" style="padding-bottom:var(--section-y)">
      <div class="map-frame">
        <iframe title="Sri Lakshmi Mart location — Uthangarai, Krishnagiri" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=Uthangarai,%20Krishnagiri,%20Tamil%20Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
      </div>
    </div>`;

  function wireContact() {
    const b = document.getElementById('cfSend'); if (!b) return;

    const WEB3FORMS_ACCESS_KEY =
      'b08c2b9e-5d51-4b02-921a-65f09f4af581';

    const GOOGLE_SHEETS_WEB_APP_URL =
      'https://script.google.com/macros/s/AKfycby1D5hoYaMCHfSOwypC8r7YS_3JC9FieZvw7QUH609hBPaRJtFVvKjBynQDUVlN6Wo/exec';

    b.onclick = async () => {
      const n = document.getElementById('cf-name')?.value.trim() || '';
      const p = document.getElementById('cf-phone')?.value.trim() || '';
      const m = document.getElementById('cf-msg')?.value.trim() || '';

      if (!n) {
        App.toast('Please enter your name', 'err');
        document.getElementById('cf-name')?.focus();
        return;
      }
      if (!p) {
        App.toast('Please enter your phone number', 'err');
        document.getElementById('cf-phone')?.focus();
        return;
      }
      if (!m) {
        App.toast('Please write a message first', 'err');
        document.getElementById('cf-msg')?.focus();
        return;
      }

      const originalHTML = b.innerHTML;
      b.disabled = true;
      b.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';

      try {
        const web3Data = new FormData();
        web3Data.append('access_key', WEB3FORMS_ACCESS_KEY);
        web3Data.append('name', n);
        web3Data.append('phone', p);
        web3Data.append('message', m);
        web3Data.append('subject', 'New Contact Enquiry - Sri Lakshmi Mart');
        web3Data.append('from_name', 'Sri Lakshmi Mart Website');

        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3Data
        });
        const web3Result = await web3Response.json();
        if (!web3Result.success) {
          throw new Error(web3Result.message || 'Email submission failed');
        }

        await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            name: n,
            phone: p,
            email: '',
            subject: 'Website Contact Enquiry',
            message: m
          })
        });

        App.toast('Successfully submitted');
        document.getElementById('cf-name').value = '';
        document.getElementById('cf-phone').value = '';
        document.getElementById('cf-msg').value = '';
      } catch (err) {
        console.error('Contact form error:', err);
        App.toast('Unable to submit. Please try again.', 'err');
      } finally {
        b.disabled = false;
        b.innerHTML = originalHTML;
      }
    };
  }

  /* ================= COMING SOON ================= */
  const SOON = {
    women: {
      ico: '👗', t: "Women's Clothing",
      d: "Our premium women's collection — elegant sarees, salwar suits, and contemporary ethnic wear — will be available soon. A curated fashion experience is on its way."
    },
    kids: {
      ico: '🧒', t: 'Kids Wear',
      d: 'Comfortable, colourful, and quality clothing for your little ones is on its way. Traditional and contemporary styles for every occasion.'
    },
    jewellery: {
      ico: '💍', t: 'Jewellery',
      d: 'Our exquisite jewellery collection — traditional and contemporary pieces for every celebration — will be unveiled soon. Elegance redefined.'
    },
    gifts: {
      ico: '🎁', t: 'Gift Items',
      d: 'Thoughtfully curated gift sets for every festive season and loved one — our gift collection is being prepared with the same care we put into everything.'
    }
  };
  function soon(k) {
    const s = SOON[k]; if (!s) return notFound();
    return `<div class="soon"><div class="soon-inner">
      <div class="soon-ico">${s.ico}</div>
      <span class="chip chip-gold" style="margin-bottom:16px">Coming Soon</span>
      <h1>${esc(s.t)}</h1>
      <p>${esc(s.d)}</p>
      <div class="soon-cta">
        <a class="btn btn-wa" target="_blank" rel="noopener"
           href="${App.waLink(`Hello Sri Lakshmi Mart, I am interested in your ${s.t} collection. Please notify me when it launches.`)}">
           <i class="bi bi-whatsapp"></i> Notify me on WhatsApp</a>
        <button class="btn btn-ghost" data-go="#/">← Back to Home</button>
      </div>
    </div></div>`;
  }

  const notFound = () => `<div class="shell" style="padding-block:var(--section-y-lg)">
    <div class="empty"><div class="e-ico">🌾</div><b>Page not found</b>
    <p>The page you're looking for doesn't exist.</p>
    <button class="btn btn-primary btn-sm" data-go="#/">Back to Home</button></div></div>`;

  const policy = k => {
    const P = {
      privacy: ['Privacy Policy', 'We collect only the details you provide when placing an order — your name, phone number and delivery address — and use them solely to fulfil and deliver that order. Orders are placed through WhatsApp, and your details are shared only with Sri Lakshmi Mart. We do not sell or share your information with third parties.'],
      terms: ['Terms of Service', 'By placing an order with Sri Lakshmi Mart you agree that product availability, pricing and delivery timelines are confirmed by our team over WhatsApp at the time of order. All products are prepared fresh in small batches.'],
      refund: ['Refund Policy', 'If a product reaches you damaged or is not as described, message us on WhatsApp within 48 hours of delivery with a photograph and we will arrange a replacement or refund.'],
      shipping: ['Shipping Policy', 'We dispatch from Uthangarai, Krishnagiri District. Delivery charges and timelines are confirmed for your location when your order is acknowledged on WhatsApp.']
    }[k];
    if (!P) return notFound();
    return `<div class="shell" style="padding-block:var(--section-y) var(--section-y-lg);max-width:760px">
      ${crumb([{ label: 'Home', href: '#/' }, { label: P[0] }])}
      <h1 style="font-size:var(--fs-h1);margin:14px 0 22px">${P[0]}</h1>
      <p class="lede">${P[1]}</p>
      <p class="lede" style="margin-top:20px">For anything else, message us at
        <a href="${App.waLink('Hello Sri Lakshmi Mart!')}" target="_blank" rel="noopener"
           style="color:var(--forest);font-weight:600">${esc(D.brand.phoneDisplay)}</a>.</p>
    </div>`;
  };

  /* ================= ADMIN ================= */
  function admin() {
    const orders = App.orders();
    const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
    const customers = new Set(orders.map(o => o.phone)).size;
    const avg = orders.length ? Math.round(revenue / orders.length) : 0;
    return `
    <div class="adm-wrap">
      <div class="adm-bar">
        <h1>Dashboard</h1>
        <span class="chip">Private · Store owner</span>
        <div class="spacer" style="margin-left:auto"></div>
        <button class="btn btn-ghost btn-sm" id="admExport"><i class="bi bi-download"></i> Export CSV</button>
        <button class="btn btn-ghost btn-sm" data-go="#/">← Storefront</button>
      </div>
      <div class="kpis">
        <div class="kpi"><span>Total Revenue</span><b>${inr(revenue)}</b>
          <small>${orders.length} order${orders.length === 1 ? '' : 's'}</small></div>
        <div class="kpi"><span>Orders</span><b>${orders.length}</b><small>All time</small></div>
        <div class="kpi"><span>Customers</span><b>${customers}</b><small>Unique numbers</small></div>
        <div class="kpi"><span>Average Order</span><b>${inr(avg)}</b><small>Per order</small></div>
      </div>
      <div class="tbl-wrap">
        <div class="tbl-head"><h3>Order History</h3>
          <span class="chip" style="margin-left:auto">${orders.length} records</span></div>
        ${orders.length ? `<div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Delivery</th>
            <th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${orders.map(o => `<tr>
            <td><b>${esc(o.id)}</b></td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>
            <td style="max-width:260px">${esc(o.loc)}</td><td>${esc(o.date)}</td>
            <td><b>${inr(o.amount)}</b></td>
            <td><span class="pill wait">${esc(o.status)}</span></td></tr>`).join('')}
          </tbody></table></div>`
        : `<div class="empty"><div class="e-ico">📋</div><b>No orders yet</b>
            <p>Orders placed through the storefront checkout will appear here.</p></div>`}
      </div>
      <p style="font-size:var(--fs-xs);color:var(--muted);margin-top:20px;max-width:70ch">
        Records are stored in this browser only and reflect orders placed from this device.
        WhatsApp remains the source of truth for order confirmation.</p>
    </div>`;
  }

  function wireAdmin() {
    const b = document.getElementById('admExport'); if (!b) return;
    b.onclick = () => {
      const rows = [['Order ID', 'Customer', 'Phone', 'Delivery', 'Date', 'Amount', 'Status'],
      ...App.orders().map(o => [o.id, o.customer, o.phone, o.loc, o.date, o.amount, o.status])];
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = `sri-lakshmi-mart-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click(); URL.revokeObjectURL(a.href);
      App.toast('Orders exported');
    };
  }

  /* ================= FOOTER ================= */
  const footer = () => `
    <footer class="foot">
      <div class="shell-wide">
        <div class="foot-grid">
          <div class="foot-brand">
            <img class="brand-plate" src="assets/brand/logo-256.png"
                 alt="Sri Lakshmi Homemade Products" width="92" height="92" loading="lazy">
            <h5 style="color:#fff;font-family:var(--font-display);font-size:1.05rem;letter-spacing:.08em;
                 text-transform:none;margin-bottom:10px">SRI LAKSHMI MART</h5>
            <p style="color:var(--gold-light);font-size:var(--fs-xs);letter-spacing:.1em;margin-bottom:12px">
              ${esc(D.brand.tagline)}</p>
            <p>A premium shopping destination for families. Handcrafted with love, tradition,
               and the finest natural ingredients from Uthangarai, Krishnagiri District.</p>
            <div class="foot-fssai"><span>FSSAI License No.</span><b>${esc(D.brand.fssai)}</b></div>
          </div>
          <div><h5>Quick Links</h5>
            <a href="#/">Home</a><a href="#/about">About Us</a>
            <a href="#/shop/organic">Organic Foods</a><a href="#/contact">Contact</a></div>
          <div><h5>Categories</h5>
            <a href="#/shop/organic">Organic Foods</a><a href="#/shop/home">Home & Kitchen</a>
            <a href="#/soon/women">Women's Clothing</a><a href="#/soon/kids">Kids Wear</a>
            <a href="#/soon/jewellery">Jewellery</a><a href="#/soon/gifts">Gift Items</a></div>
          <div><h5>Policies</h5>
            <a href="#/policy/privacy">Privacy Policy</a><a href="#/policy/terms">Terms of Service</a>
            <a href="#/policy/refund">Refund Policy</a><a href="#/policy/shipping">Shipping Policy</a>
            <h5 style="margin-top:22px">Contact</h5>
            <a href="${App.waLink('Hello Sri Lakshmi Mart!')}" target="_blank" rel="noopener">
              <i class="bi bi-whatsapp"></i> ${esc(D.brand.phoneDisplay)}</a></div>
        </div>
        <div class="foot-bot">
          <span>© ${new Date().getFullYear()} Sri Lakshmi Mart. All rights reserved.</span>
          <span>${esc(D.brand.location)}</span>
        </div>
      </div>
    </footer>`;

  /* ================= ROUTER ================= */
  function render() {
    const hash = location.hash || '#/';
    const parts = hash.replace(/^#\//, '').split('/').filter(Boolean);
    const v = view();
    let html = '', after = null, needsFooter = true;

    switch (parts[0]) {
      case undefined:
      case '': html = home(); after = wireHome; break;
      case 'shop':
        html = shop(parts[1] || 'organic', parts[2]);
        after = () => { renderShop(); wireShop(); };
        break;
      case 'product': html = product(parts[1]); after = () => wirePdp(parts[1]); break;
      case 'checkout': html = checkout(); after = wireCheckout; break;
      case 'thanks': html = thanks(parts[1] || ''); break;
      case 'about': html = about(); break;
      case 'contact': html = contact(); after = wireContact; break;
      case 'soon': html = soon(parts[1]); break;
      case 'policy': html = policy(parts[1]); break;
      case 'admin': html = admin(); after = wireAdmin; needsFooter = false; break;
      default: html = notFound();
    }

    Hero.destroy();                       // never leave a timer running off-page
    if (Views._revStop) { Views._revStop(); Views._revStop = null; }
    v.innerHTML = `<div class="view">${html}${needsFooter ? footer() : ''}</div>`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    App.observeReveals(v);
    Shell.restoreCards(v);
    Shell.markActive(hash);
    document.title = pageTitle(parts) + ' | Sri Lakshmi Mart';
    if (after) after();
  }

  function pageTitle(p) {
    const m = {
      shop: 'Shop', product: 'Product', checkout: 'Checkout', about: 'About Us',
      contact: 'Contact', soon: 'Coming Soon', admin: 'Dashboard', policy: 'Policies', thanks: 'Thank You'
    };
    return m[p[0]] || 'Healthy · Homemade · Traditional · Organic';
  }

  function wireHome() {
    Hero.mount();

    wireReviews();
    tilt();
  }

  function wireShop() {
    document.querySelector('.fbar')?.addEventListener('click', e => {
      const b = e.target.closest('[data-filter]'); if (!b) return;
      shopState.cat = b.getAttribute('data-filter');
      document.querySelectorAll('.fchip').forEach(c =>
        c.classList.toggle('on', c.getAttribute('data-filter') === shopState.cat));
      const base = shopState.kind === 'organic' ? '#/shop/organic' : '#/shop/home';
      history.replaceState(null, '', shopState.cat === 'all' ? base : base + '/' + shopState.cat);
      renderShop();
    });
    document.getElementById('sortSel')?.addEventListener('change', e => {
      shopState.sort = e.target.value; renderShop();
    });
    tilt();
  }

  /* subtle 3D tilt on product cards (desktop, fine pointer) */
  function tilt() {
    if (!matchMedia('(hover:hover) and (pointer:fine) and (min-width:1024px)').matches) return;
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
      if (card._tilt) return; card._tilt = true;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - .5;
        const dy = (e.clientY - r.top) / r.height - .5;
        card.style.transform =
          `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  return { render, renderShop };
})();
