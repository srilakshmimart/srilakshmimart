/* ============================================================
   CORE — state, persistence, formatting, notifications
   ============================================================ */
window.App = (function () {

  const KEY_CART = 'slm_cart';
  const KEY_WISH = 'slm_wishlist';
  const KEY_ORDERS = 'slm_orders';

  /* ---------- storage (cart/wishlist only; never business catalogue) ---------- */
  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  let cart = read(KEY_CART, []);
  let wishlist = read(KEY_WISH, []);

  const listeners = [];
  const onChange = fn => listeners.push(fn);
  const emit = () => listeners.forEach(fn => fn());

  /* ---------- money ---------- */
  const inr = n => '₹' + Number(n || 0).toLocaleString('en-IN');
  const esc = s => String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  /* ---------- catalogue lookups ---------- */
  const D = window.SLM;

  /** Every purchasable item in one shape, whichever collection it came from. */
  function allItems() {
    const foods = D.products.map(p => ({
      key: 'p' + p.id, id: p.id, kind: 'organic',
      name: p.name, cat: p.cat, emoji: p.emoji, img: p.img || null,
      desc: p.desc, benefits: p.benefits, howto: p.howto,
      sizes: p.sizes, prices: p.prices, price: p.price
    }));
    /* Accessory ids already carry the 'a' prefix in the source data
       (a1, a2 …), so they are used as-is; organic ids are numeric and
       get a 'p' prefix to keep the two id spaces from colliding. */
    const acc = D.accessories.map(p => ({
      key: String(p.id), id: p.id, kind: 'home',
      name: p.name, cat: p.cat, emoji: p.emoji, img: p.img || null,
      desc: p.desc, benefits: [], howto: '',
      sizes: [p.weight], prices: null, price: p.price, weight: p.weight
    }));
    return foods.concat(acc);
  }
  const ITEMS = allItems();
  const byKey = k => ITEMS.find(i => i.key === k);

  /** Price for a chosen size. Organic items map size → price; others are flat. */
  function priceFor(item, size) {
    if (!item.prices) return item.price;
    const grams = parseInt(String(size).replace(/[^0-9]/g, ''), 10);
    const key = String(size).toLowerCase().includes('kg') ? grams * 1000 : grams;
    return item.prices[key] ?? item.price;
  }

  /* ---------- cart ---------- */
  function addToCart(key, size, qty) {
    const item = byKey(key);
    if (!item) return;
    size = size || item.sizes[0];
    qty = Math.max(1, qty || 1);
    const price = priceFor(item, size);
    const found = cart.find(c => c.key === key && c.size === size);
    if (found) found.qty += qty;
    else cart.push({ key, name: item.name, cat: item.cat, emoji: item.emoji,
                     img: item.img, size, price, qty });
    write(KEY_CART, cart); emit();
    // Confirm exactly what went in — quantity, product and the chosen size.
    const many = qty > 1;
    toast(`${many ? qty + ' × ' : ''}${item.name}` +
          `${item.sizes.length > 1 ? ` (${size})` : ''} added to cart`);
  }
  function setQty(idx, qty) {
    if (!cart[idx]) return;
    if (qty <= 0) cart.splice(idx, 1); else cart[idx].qty = qty;
    write(KEY_CART, cart); emit();
  }
  function removeItem(idx) {
    if (!cart[idx]) return;
    const n = cart[idx].name;
    cart.splice(idx, 1); write(KEY_CART, cart); emit();
    toast(`${n} removed`);
  }
  const clearCart = () => { cart = []; write(KEY_CART, cart); emit(); };
  const cartCount = () => cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = () => cart.reduce((s, c) => s + c.price * c.qty, 0);

  /* ---------- wishlist ---------- */
  function toggleWish(key) {
    const i = wishlist.indexOf(key);
    if (i > -1) { wishlist.splice(i, 1); toast('Removed from wishlist'); }
    else { wishlist.push(key); toast('Saved to wishlist'); }
    write(KEY_WISH, wishlist); emit();
  }
  const inWish = key => wishlist.includes(key);

  /* ---------- orders (local record; mirrors the original admin feed) ---------- */
  function saveOrder(o) {
    const list = read(KEY_ORDERS, []);
    list.unshift(o);
    write(KEY_ORDERS, list.slice(0, 400));
  }
  const orders = () => read(KEY_ORDERS, []);

  /* ---------- WhatsApp ---------- */
  const WA = D.brand.whatsapp;
  const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  /**
   * Order message — preserves the original site's structure and Order ID
   * scheme ('SL' + timestamp) so the owner's existing workflow is unchanged.
   */
  function orderMessage(f) {
    const items = cart.map(c =>
      `• ${c.name} (${c.size}) × ${c.qty} = ₹${(c.price * c.qty).toLocaleString('en-IN')}`
    ).join('\n');
    const addr = `${f.address}, ${f.city} - ${f.pincode}, ${f.state}`;
    return `Hello Sri Lakshmi Mart! 🌿\n\n*Order ID:* ${f.orderId}\n*Name:* ${f.name}\n` +
           `*Phone:* ${f.phone}\n\n*Delivery Address:*\n${addr}\n\n*Order Items:*\n${items}\n\n` +
           `*Total: ₹${cartTotal().toLocaleString('en-IN')}*\n\nPlease confirm and dispatch. Thank you! 🙏`;
  }

  /* ---------- toast ---------- */
  function toast(msg, type) {
    const host = document.getElementById('toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'err' ? ' err' : '');
    el.setAttribute('role', 'status');
    el.innerHTML = `<span>${type === 'err' ? '⚠️' : '✓'}</span><span>${esc(msg)}</span>`;
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, 2600);
  }

  /* ---------- scroll reveal ---------- */
  let io;
  function observeReveals(root) {
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  }

  return {
    D, ITEMS, byKey, priceFor,
    get cart() { return cart; }, get wishlist() { return wishlist; },
    addToCart, setQty, removeItem, clearCart, cartCount, cartTotal,
    toggleWish, inWish, saveOrder, orders,
    waLink, orderMessage, toast, inr, esc, onChange, emit, observeReveals
  };
})();
