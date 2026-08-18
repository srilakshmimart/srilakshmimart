/* ============================================================
   ASSISTANT KNOWLEDGE

   A local, keyword-matched FAQ. No external AI service, no API key.
   Every answer is built from window.SLM — the same catalogue the shop
   renders from — so prices and product names cannot drift, and nothing
   here invents business information.
   ============================================================ */
window.AssistantData = (function () {
  const D = window.SLM;

  const money = n => '₹' + Number(n || 0).toLocaleString('en-IN');

  const CAT_LABEL = {
    malt:'Malt', readymix:'Ready Mix', masala:'Masala', laddu:'Laddu',
    kitchen:'Kitchen', cleaning:'Cleaning', beauty:'Beauty', home:'Home', kids:'Kids'
  };

  /* ---------- answers assembled from live data ---------- */
  function categoriesAnswer() {
    const org = D.products.length, acc = D.accessories.length;
    return {
      text: `We have two collections open right now:\n\n` +
            `• Homemade Organic Foods — ${org} products across Malt, Ready Mix, Masala and Laddu\n` +
            `• Home & Kitchen — ${acc} products\n\n` +
            `Women's Clothing, Kids Wear, Jewellery and Gift Items are coming soon.`,
      actions: [ { label:'Shop Organic Foods', route:'#/shop/organic' },
                 { label:'Home & Kitchen', route:'#/shop/home' } ]
    };
  }

  function groupAnswer(cat) {
    const list = D.products.filter(p => p.cat === cat);
    if (!list.length) return null;
    const cheapest = Math.min(...list.map(p => p.price));
    return {
      text: `We make ${list.length} ${CAT_LABEL[cat]} product${list.length > 1 ? 's' : ''}, ` +
            `starting from ${money(cheapest)}:\n\n` +
            list.slice(0, 6).map(p => `• ${p.name} — from ${money(p.price)}`).join('\n') +
            (list.length > 6 ? `\n…and ${list.length - 6} more.` : ''),
      actions: [ { label:`View all ${CAT_LABEL[cat]}`, route:`#/shop/organic/${cat}` } ]
    };
  }

  /* Words that name a whole group. A question containing only one of these
     is asking about the range, not about the one product whose name happens
     to contain the word. */
  const GROUP_WORDS = ['malt','masala','laddu','ladoo','mix','powder','spice','spices',
                       'food','foods','product','products'];

  /** Look for a specific product by name. Returns null when nothing matches. */
  function findProduct(q) {
    const text = q.toLowerCase();
    const all = D.products.concat(D.accessories);
    // longest name that appears in the question wins, so "ragi malt" doesn't
    // match a shorter partial when the full product name is present
    let best = null;
    all.forEach(p => {
      const n = p.name.toLowerCase();
      if (text.includes(n) && (!best || n.length > best.name.length)) best = p;
    });
    // only accept a full-name hit if the question says more than the group word
    if (best) {
      const extra = best.name.toLowerCase().split(/\s+/)
        .filter(word => !GROUP_WORDS.includes(word));
      if (extra.some(word => text.includes(word))) return best;
      best = null;
    }
    // fall back to matching on the distinctive words of a name
    let score = 0;
    all.forEach(p => {
      const words = p.name.toLowerCase().split(/\s+/)
        .filter(w => w.length > 3 && !GROUP_WORDS.includes(w));
      const hits = words.filter(w => text.includes(w)).length;
      if (hits > score && hits >= Math.min(2, words.length)) { score = hits; best = p; }
    });
    return best;
  }

  function productAnswer(p) {
    const isFood = !!p.prices;
    const sizes = isFood && p.sizes.length > 1
      ? ` It comes in ${p.sizes.join(', ')}.` : '';
    const key = (isFood ? 'p' : '') + p.id;
    return {
      text: `${p.name} starts from ${money(p.price)}.${sizes}\n\n${p.desc}`,
      actions: [ { label:`View ${p.name}`, route:`#/product/${key}` } ]
    };
  }

  /* ---------- static intents ---------- */
  const FAQS = [
    { id:'greeting',
      keywords:['hi','hello','hey','vanakkam','good morning','good evening'],
      answer:() => ({ text:`Hello! I can help you find products, check prices, or explain how to order.`,
        actions:[{label:'Browse products', route:'#/shop/organic'}] }) },

    { id:'categories',
      keywords:['categories','category','collections','what do you sell','what do you have',
                'products available','range','catalogue','catalog'],
      answer: categoriesAnswer },

    { id:'organic',
      keywords:['homemade','organic','food','foods','healthy'],
      answer:() => ({
        text:`Our Homemade Organic Foods collection has ${D.products.length} products — ` +
             `sprouted malts, dosai and pongal ready mixes, hand-roasted masalas and ` +
             `jaggery laddus. All made in small batches in Uthangarai.`,
        actions:[{label:'Shop Organic Foods', route:'#/shop/organic'}] }) },

    { id:'malt',     keywords:['malt','malts','health mix','badam','ragi'],
      answer:() => groupAnswer('malt') },
    { id:'readymix', keywords:['ready mix','readymix','dosai','dosa','pongal','mix'],
      answer:() => groupAnswer('readymix') },
    { id:'masala',   keywords:['masala','spice','spices','powder','sambar','rasam','biryani','turmeric'],
      answer:() => groupAnswer('masala') },
    { id:'laddu',    keywords:['laddu','ladoo','sweet','sweets'],
      answer:() => groupAnswer('laddu') },

    { id:'kitchen',
      keywords:['kitchen','home','accessories','utensil','cleaning','beauty'],
      answer:() => ({
        text:`Our Home & Kitchen collection has ${D.accessories.length} products across ` +
             `kitchen tools, home essentials, beauty and cleaning.`,
        actions:[{label:'Shop Home & Kitchen', route:'#/shop/home'}] }) },

    { id:'order',
      keywords:['order','buy','purchase','how do i order','how to order','checkout','place an order'],
      answer:() => ({
        text:`Ordering takes a minute:\n\n1. Open a product and pick your size\n` +
             `2. Choose the quantity and press Add to Cart\n3. Open the cart and go to Checkout\n` +
             `4. Fill in your delivery details\n5. Press "Place Order on WhatsApp"\n\n` +
             `Your order opens in WhatsApp with everything filled in, and we confirm it personally.`,
        actions:[{label:'Start shopping', route:'#/shop/organic'}] }) },

    { id:'contact',
      keywords:['contact','phone','number','whatsapp','call','reach','email','address','where are you',
                'location','located','shop address'],
      answer:() => ({
        text:`You can reach us on WhatsApp at ${D.brand.phoneDisplay}.\n\n` +
             `We're in ${D.brand.location}.`,
        actions:[{label:'Contact page', route:'#/contact'},
                 {label:'Message on WhatsApp',
                  href:`https://wa.me/${D.brand.whatsapp}?text=${encodeURIComponent('Hello Sri Lakshmi Mart!')}`}] }) },

    { id:'fssai',
      keywords:['fssai','licence','license','certified','certification','safe','quality'],
      answer:() => ({
        text:`We're FSSAI licensed under ${D.brand.fssai}. Everything is made in small ` +
             `batches with no preservatives.` }) },

    { id:'price',
      keywords:['price','cost','how much','rate','rates','pricing'],
      answer:() => ({
        text:`Prices depend on the product and size. Organic foods start from ` +
             `${money(Math.min(...D.products.map(p => p.price)))}, and Home & Kitchen from ` +
             `${money(Math.min(...D.accessories.map(p => p.price)))}.\n\n` +
             `Tell me a product name and I'll give you its price.`,
        actions:[{label:'See all products', route:'#/shop/organic'}] }) }
  ];

  const SUGGESTIONS = [
    'What categories do you have?',
    'Show me your masalas',
    'How much is Sprouted Health Mix?',
    'How do I order?',
    'How can I contact you?'
  ];

  const FALLBACK = {
    text:`I don't have that information yet. The team can help you directly — ` +
         `message us on WhatsApp and we'll answer personally.`,
    actions:[{label:'Contact us', route:'#/contact'},
             {label:'WhatsApp',
              href:`https://wa.me/${D.brand.whatsapp}?text=${encodeURIComponent('Hello Sri Lakshmi Mart!')}`}]
  };

  /**
   * Resolve a question to an answer.
   * A named product wins over a general intent, because "how much is
   * Sambar Powder" should quote that product rather than list prices.
   */
  function respond(question) {
    const q = String(question || '').toLowerCase().trim();
    if (!q) return FALLBACK;

    const product = findProduct(q);
    if (product) return productAnswer(product);

    /* Match on whole words, so "hi" cannot fire inside "ship" and "mix"
       cannot fire inside "mixed". Longer phrases outrank single words. */
    const esc = k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // whole-word match, tolerating a plural 's' so "masalas" finds "masala"
    const hasPhrase = k =>
      new RegExp('(^|[^a-z])' + esc(k) + 's?([^a-z]|$)').test(q);

    let best = null, bestScore = 0;
    FAQS.forEach(f => {
      let score = 0;
      f.keywords.forEach(k => { if (hasPhrase(k)) score = Math.max(score, k.length); });
      if (score > bestScore) { bestScore = score; best = f; }
    });
    if (!best) return FALLBACK;
    /* A greeting is only a greeting when it is most of what was said —
       otherwise "hi" inside a longer question would answer the wrong thing. */
    if (best.id === 'greeting' && q.split(/\s+/).length > 3) return FALLBACK;

    const a = best.answer();
    return a || FALLBACK;
  }

  return { respond, SUGGESTIONS, FALLBACK, findProduct };
})();
