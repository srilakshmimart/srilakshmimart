/* ============================================================
   HERO — cinematic homemade-spice video

   Video shows whole spices ground by hand in a stone mortar.
   All text is an HTML overlay, never burnt into the footage.
   Utility icons (search / wishlist / cart) sit in the hero's own
   top-right corner rather than in a separate strip above it.
   ============================================================ */
window.Hero = (function () {

  const REDUCED = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  let vid = null;

  function build() {
    const B = App.D.brand;
    return `
    <section class="hero3" id="hero">

      <div class="hero3-media" aria-hidden="true">
        <video id="heroVid" class="hero3-video"
               autoplay muted loop playsinline preload="metadata"
               poster="assets/video/spice-poster.jpg">
          <!-- phones get the smaller encode, never the full-size file -->
          <source src="assets/video/spice-hero-sm.mp4" media="(max-width:768px)" type="video/mp4">
          <source src="assets/video/spice-hero.mp4" type="video/mp4">
        </video>
        <span class="hero3-scrim"></span>
        <span class="hero3-warm"></span>
      </div>

      <div class="hero3-inner">
        <div class="hero3-lede">
          <img class="hero3-logo brand-plate" src="assets/brand/logo-256.png"
               alt="Sri Lakshmi Homemade Products" width="76" height="76">
          <span class="hero3-brand">Sri Lakshmi Mart · Homemade Products</span>
          <h1 class="hero3-head">
            <span>Pure.</span><span>Natural.</span>
            <span>Wholesome.</span><em>Made with love.</em>
          </h1>
          <p class="hero3-sub">Hand-roasted and ground in small batches,
            the way it has always been done at home.</p>
          <div class="hero3-cta">
            <a class="btn btn-gold" href="#/shop/organic/masala">Explore Homemade Products</a>
            <a class="btn btn-clear" href="#/shop/organic">All Organic Foods</a>
          </div>
          <ul class="hero3-trust">
            <li><i class="bi bi-patch-check"></i> FSSAI ${App.esc(B.fssai)}</li>
            <li><i class="bi bi-x-circle"></i> No Preservatives</li>
            <li><i class="bi bi-geo-alt"></i> Uthangarai, Tamil Nadu</li>
          </ul>
        </div>
      </div>
    </section>`;
  }

  function mount() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    vid = document.getElementById('heroVid');

    const play = () => {
      if (!vid || REDUCED) return;
      // play() returns a promise in current browsers, undefined in older ones
      const r = vid.play && vid.play();
      if (r && typeof r.catch === 'function') r.catch(() => {});
    };
    const pause = () => { vid && vid.pause && vid.pause(); };
    if (REDUCED) pause();

    // decoration only — never let it run off screen or in a hidden tab
    const overHero = on => document.body.classList.toggle('at-hero', on);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(en => {
        en.isIntersecting ? play() : pause();
        // the action bar restyles itself while it sits over the video
        overHero(en.isIntersecting && en.intersectionRatio > .4);
      }), { threshold: [.15, .4] }).observe(hero);
    } else { play(); overHero(true); }
    document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());

  }

  function destroy() {
    try { vid && vid.pause && vid.pause(); } catch (e) {}
    document.body.classList.remove('at-hero');   // never strand the light styling
    vid = null;
  }

  return { build, mount, destroy };
})();
