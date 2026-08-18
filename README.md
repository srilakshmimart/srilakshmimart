# Sri Lakshmi Mart — V2

A rebuild of srilakshmimart.com. **Every product, price, size, description, review,
phone number and licence detail is taken verbatim from your existing site.**
Nothing was invented.

## Run it

It's static — no build step.

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Or upload the whole folder to any host
(GitHub Pages, Netlify, Hostinger, cPanel).

## Structure

```
index.html          shell, SEO, drawers
css/base.css        design tokens (colours, type, spacing, motion)
css/hero.css        homepage video hero
css/widgets.css     floating buttons and chat panel
css/shell.css       navigation, drawers, overlays
css/pages.css       page + component styles
js/data.js          ← ALL product data. Edit prices here.
js/core.js          state, cart, wishlist, WhatsApp message
js/shell.js         navigation, search, drawers
js/hero.js          homepage video hero
js/assistant-data.js local FAQ + catalogue answers
js/widgets.js       back-to-top and assistant UI
js/views.js         pages + router
assets/brand/       the official logo, marks and icons
assets/video/       hero video (two encodes) and posters
assets/products/    organic product photos and illustrations
assets/categories/  drawn icon tile for each of the six categories
assets/acc2x/       cleaned Home & Kitchen photos
source-assets/      originals — NOT part of the website
```

### Editing products

Everything lives in **`js/data.js`**. To change a price, find the product and edit
`prices` (organic items, keyed by grams) or `price` (home & kitchen).

```js
{ "id":1, "name":"Sprouted Health Mix",
  "sizes":["200g","500g","1kg"],
  "prices":{"200":120,"500":280,"1000":520} }
```

## What carried over

| | |
|---|---|
| Organic food products | **29** (Malt 7 · Ready Mix 9 · Masala 7 · Laddu 4… plus variants) |
| Home & Kitchen products | **68** (Kitchen 17 · Home 21 · Beauty 15 · Cleaning 10 · Kids 5) |
| Product photos | **77**, extracted from the old file and saved as real image files |
| Customer reviews | The 3 real ones (Priya Murugan, Suresh Kumar, Anitha Lakshmi) |
| WhatsApp | +91 73052 76415 — same number, same order-message format, same `SL…` order IDs |
| FSSAI | 22425103000163 |

## Notable changes

**Images are now files, not code.** The old `index.html` was 2.8 MB because 77
photos were embedded as base64 inside the HTML. Every page load downloaded all
of them. They're now real `.jpg` files that load lazily — the initial page is
roughly 40× smaller.

**Split into modules.** One 4,394-line file became a shell plus five focused
files, so a price change means editing `js/data.js`, not hunting through markup.

**Real product pages.** Each product now has its own URL (`#/product/p1`) with
sizes, benefits, how-to-use and related items. Previously products only existed
inside a grid.

**Search** across all 97 products (`/` to open, arrow keys to navigate).

**Wishlist** persists between visits.

## Two things that need your decision

1. **Home & Kitchen prices look like placeholders.** All 68 items are priced
   ₹104–₹162, and each is exactly `cost + 100` (e.g. cost ₹17 → price ₹117).
   That pattern suggests a formula rather than real pricing. I kept the values
   exactly as they were — please confirm before you go live.

2. **Two conflicting price lists existed in the old file.** The storefront listed
   Sprouted Health Mix at ₹120; the admin dashboard listed it at ₹350. I used the
   **storefront** prices, since those are what customers were actually shown.
   The admin figures appear to be leftover demo data.

## Omitted on purpose

Your live site currently shows `your@email.com`, `[GST: XXXXXXXXXX — Update this]`,
`[Add Social Links]` and `[Mon–Sat: 9 AM – 7 PM] [Update]`. Rather than publish
placeholders as if they were real, I left them out. Send me the real email, GST
number, hours and social links and I'll add them.

## Admin

`#/admin` shows orders placed through checkout on that device, with CSV export.
It's a convenience view, not a server — WhatsApp remains your source of truth.
The old dashboard's charts ran on hard-coded sample data, so they weren't carried
over; if you want real analytics we'd need orders stored somewhere central
(a Google Sheet would work well, like your billing app).


## Update 1 — quantity selector + images

### Quantity selector

Every product card now carries a stepper and an explicit button:

```
[ − ] [ 1 ] [ + ]   [ Add to Cart ]
```

Nothing is added until **Add to Cart** is pressed. Minimum is 1 (the minus
button disables there rather than failing silently); maximum is 99, or the
stock figure if the catalogue ever carries a `stock` / `qtyAvailable` field.

Products with more than one size show size chips above the stepper. Choosing a
size updates the card's price immediately, and the quantity applies to that
size — pick `1kg`, set 2, and the cart receives 2 × 1kg at ₹520 each.

Selections are held in memory rather than in the DOM, so a card keeps its
quantity while a list re-renders (filtering, sorting), and the same product
shown twice on one page stays in sync.

Confirmation names what was added: **"3 × Sprouted Health Mix (200g) added to cart"**.

Live on every card surface: listing, category filters, home featured, related
products on a product page, and the same component the search results link into.

### Images

**68 Home & Kitchen photos rebuilt.** They were 200×200 supplier thumbnails,
which the browser was stretching almost 3× on retina screens. Each is now
resampled once with a Lanczos filter and lightly sharpened — noticeably crisper.

**Supplier SKU codes removed.** 66 of the 68 had a code burnt into a black box
in the bottom-right corner (`10040`, `10847` …). Customers were seeing those.
The strip is cropped away and the frame rebuilt from the image's own background,
so the square shape is kept and nothing is clipped when the card fills. The red
`2 Pc` / `3 Pc Mix Design` pack labels were left alone — those carry real
information. No product is retouched.

**20 missing product visuals created.** These are designed SVG illustrations
built from the site's own palette — one motif per category (grain ears for malt,
dosai for ready mixes, a spice bowl for masalas, laddus for sweets), with the
tone and arrangement varied per product so no two cards look alike. Nothing was
scraped, no stock photography was used, and no packaging is depicted, so none of
them can misrepresent what arrives.

They're marked in the data:

```js
{ "id":5, "name":"Sprouted Ragi Malt",
  "img":"assets/products/p5.svg", "placeholder":true }
```

To swap in a real photo: drop the `.jpg` into `assets/products/`, point `img` at
it, and delete the `placeholder` flag. Regenerate the illustrations any time with
`node tools/make-placeholders.js`. The 9 real photographs were not touched.

Design, colours, typography, sidebar, homepage and layout are unchanged.


## Update 2 — hero carousel, spacing, palette

### New homepage hero

The old static hero is replaced by a landscape product carousel. Five real
catalogue products, one per collection where the data allows:

| Slide | Collection | Price |
|---|---|---|
| Sprouted Health Mix | Malt | ₹120 |
| Badam Mix | Malt | ₹160 |
| Ragi Dosai Mix | Ready Mix | ₹110 |
| Sambar Powder | Masala | ₹60 |
| Varagu Laddu | Laddu | ₹95 |

Names, prices and descriptions are read from `js/data.js` at render time — the
carousel has no copy of its own, so a price edit shows up here automatically.

Each slide is copy-left / product-right, with the product lifted out of any card
and set into the scene on a soft tinted orb. Collections carry their own
atmosphere — green for malt, gold for ready mix, clay for masala, rose for laddu
— drawn from the same palette so the brand holds together.

**Controls:** previous / next, progress indicators, autoplay (6.2s) that pauses
on hover and on keyboard focus, arrow-key navigation, and touch swipe. The swipe
only claims a gesture once it's clearly horizontal, so vertical page scrolling
still works. Autoplay stops when the hero scrolls out of view or the tab is
hidden, and the timer is cleared when you navigate away.

**The buttons are real.** Each slide has `[ − ] [ 1 ] [ + ]` and **Add to Cart**
wired to the same cart as everywhere else, plus **View Product**. Add 3 from the
hero and the cart receives 3.

Mobile gets its own composition rather than a squeezed desktop one: product
image first, then category, name, description, price, buttons — centred, with
the arrows moved to the bottom.

### Section spacing

Gaps were `clamp(64px, 9vw, 128px)` — 128px between every section on desktop.
Now a three-step scale:

```
--section-y:       clamp(38px, 5vw, 72px)   /* standard   */
--section-y-tight: clamp(28px, 3.4vw, 48px) /* continuing */
--section-y-lg:    clamp(48px, 6vw, 88px)   /* standalone */
```

Consecutive sections also drop to the tight value, so the page reads as grouped
bands instead of evenly spaced islands. Total section padding on the homepage is
down about **53% on desktop and 48% on mobile**, without any section becoming
cramped — the section headings keep their own internal breathing room.

### New palette

| Token | | |
|---|---|---|
| `--primary` | `#1E4636` | deep evergreen — nav, buttons, headings |
| `--primary-dark` | `#12291F` | rail, footer, dark bands |
| `--secondary` | `#8A5A3B` | earthy clay |
| `--accent` | `#C39A4E` | antique gold — rules, badges, price |
| `--accent-ink` | `#8A6520` | text-safe gold |
| `--background` | `#FAF6EE` | warm ivory |
| `--surface` | `#FFFFFF` | cards, drawers |
| `--text` / `--muted-text` | `#1B231C` / `#626E60` | |
| `--border` | `#E6DDCB` | |
| `--success` | `#2F7D52` | |

The greens are deeper and the ground warmer than before, which suits food
photography better and reads as more premium.

Roughly 25 hard-coded colours were still scattered through the component sheets
and would have survived a palette change — those are now tokens, so the site
re-skins from one block. The old variable names are kept as aliases pointing at
the new tokens, which is why the sidebar, cards, cart, drawers, badges, forms and
footer all picked the palette up together.

Every pairing is checked against WCAG AA in the test suite, including gold on
dark and muted text on the ivory ground.

### Note

Your brief listed an **AI Shopping Assistant** among the things not to touch —
there isn't one in this build, so nothing was affected. Happy to add one if you'd
like it.

Product data, reviews, cart, wishlist, search, checkout, WhatsApp ordering and
the quantity selector are all unchanged.


## Update 3 — original logo, branding, spice video hero

### Your logo is now the only logo

The JPEG you sent had a **transparency checkerboard baked into it** — 27px
squares, only 1–15 levels off white. Invisible on white, but it would have shown
as a faint grid against the ivory background.

A plain white-key would have wrecked it: Lakshmi's raised palm and all the fine
linework are near-white *artwork*. So the key runs on the checkerboard's
alternating signature instead — background pixels alternate on the 27px grid,
flat artwork doesn't. The hands and linework came through intact.

Everything in `assets/brand/` is a resize or crop of that one keyed master.
Nothing was redrawn:

```
logo-512/256/128/64.png   full lockup
mark-256/128/64/32.png    emblem only, cropped from the same artwork
favicon.ico               16/32/48
apple-touch-icon.png      180
```

In place at: splash screen, desktop rail (collapsed and expanded), mobile
header, mobile drawer, hero, footer, favicon, Apple touch icon and the social
preview image. The old generated SVG logo is deleted and nothing references it.

**One judgement call.** Your logo's lettering is dark green, so on the dark
sidebar and footer "SRI LAKSHMI" and "HOMEMADE PRODUCTS" disappeared entirely.
Rather than alter the artwork, it sits on a cream disc there (`.brand-plate`) —
the logo is circular, so it reads as intentional. Compared side by side, plated
is legible and bare is not.

### Palette taken from the logo

`--primary #294527` is the green of its lettering and leaves; `--accent #C6A45C`
is the gold of the emblem. The test suite checks both colours actually occur in
the logo's pixels, not merely that they look close.

### Spice video hero

Your video — whole spices, hand-grinding in a stone mortar, fresh powder — is
now the hero background.

- audio stripped (a hero video must be muted; removing the track saves bytes)
- two encodes: **1.1 MB** desktop, **317 KB** mobile, chosen by media query
- poster frame shows instantly; `preload="metadata"` keeps it off the critical path
- `muted` / `loop` / `playsinline` so iOS plays it inline
- pauses when scrolled out of view or the tab is hidden, and honours
  `prefers-reduced-motion`
- a mobile poster is already generated at `assets/video/spice-poster-mobile.jpg`
  if you later want a separate mobile clip

All hero text is an HTML overlay, never burnt into the video.

Contrast was measured against the actual poster frame rather than eyeballed:
white headline text sits at **8:1 at the brightest pixel**, mean 17:1. The first
mobile scrim was so dark the footage vanished, so it was lightened to 0.62
through the middle — still 8.3:1.

Crop holds the mortar at every size: `object-position:50% 50%` desktop,
`56% 50%` tablet, `58% 46%` mobile.

The hero carousel is five real masalas — Sambar ₹60, Biryani ₹70, Rasam ₹55,
Turmeric ₹45, Non Veg ₹70 — each with a working quantity stepper, Add to Cart
and Shop Now.

### Copy

The suggested line "Traditional Taste. Homemade Goodness." isn't anywhere in
your business content, so the hero uses **"Pure · Natural · Handmade"** — the
wording from your own logo — with the real FSSAI number. No invented claims.

### Housekeeping

CSS for the two superseded hero designs was still shipping; it's removed. The
untouched originals (your logo JPEG, the keyed master, the original video, the
68 pre-cleanup supplier thumbnails) now live in `source-assets/`, which is
**not** part of the site — don't upload that folder. Deployed size is 5.7 MB.

### Note

Your brief again listed an **AI Shopping Assistant** among things not to break.
There still isn't one in this build, so nothing was affected.


## Update 4 — compact UI, cleaner hero, new category grid, live reviews

### Hero

The white strip that held Search / Wishlist / Cart above the hero is gone. Those
icons now sit in the hero's own top-right corner in a translucent, blurred pill
with a soft border — visible over the footage without being a white box. They
were also added to the sidebar, so search stays reachable on every other page.

The right-hand product-information box is removed completely — container,
carousel, controls and styles. The hero is one cinematic composition now.

The headline is much stronger: display serif, bold, four stacked lines running
up to 4rem, with a soft shadow so it holds over the video.

```
Pure.
Natural.
Wholesome.
Made with love.
```

That's your own wording — it's the line on your brand image (`assets/bg1.jpg`).
Nothing invented.

Hero height dropped from ~720px to `clamp(400px, 52vh, 520px)`, so the next
section is already visible as the page loads.

### Category section

The collage is gone — no more mixed large/medium/small blocks. Six identical
cards on a 3-column grid (2 on tablet, 1 on phone), each with the same icon,
title, description, availability tag and CTA.

The dark green fills are gone too. Cards now sit on white over the ivory ground,
with each category's colour used only as a faint corner wash, an icon tint and a
hover border. Bright, warm and consistent — and every value comes from the
palette tokens.

### Reviews

Now a real carousel: **rotates every 2.6 seconds**, cross-fading with a slight
slide, with previous/next arrows, pagination dots, and swipe on touch. Rotation
pauses on hover, on keyboard focus, when scrolled out of view and when the tab
is hidden. A manual click restarts the timer rather than fighting it.

Under `prefers-reduced-motion` it doesn't auto-rotate at all and the transition
is disabled — the arrows and dots still work.

Your three real reviews are unchanged: same names, same text, same five stars.
No fourth reviewer invented.

### Compactness

A tighter scale throughout, so 100% zoom reads like the old 80%:

| | before | now |
|---|---|---|
| Section gap (desktop) | 72px | 56px |
| Section gap (mobile) | 38px | 28px |
| `--fs-h1` max | 3.5rem | 2.6rem |
| Body text | 1.02rem | 0.97rem |
| Sidebar rail | 78px | 68px |
| Top bar | 64px | 56px |
| Hero | ~720px | 400–520px |
| Product grid column | 232px | 196px |

Also trimmed: card padding, button padding, the "Why" tiles, the story image
(4:5 → square), stat row, footer padding and link spacing, and the collection
rail.

Estimated homepage height on a 1440×900 desktop is down from roughly 4,320px to
**3,843px** — about **11% less scrolling**, with more products visible per row.

Body text stays at 0.9rem minimum and buttons at 11px vertical padding, so
nothing became small or fiddly to tap.

### Note

Your brief again lists an **AI Shopping Assistant** and an **Offers section**
among things not to break. Neither exists in this build — offers are currently
carried by the announcement ticker, which is untouched. Happy to build either.


## Update 5 — content scale restored, circular category rail

The previous update shrank content when it should only have shrunk space. That's
corrected: **spacing stays tight, components go back to a comfortable size.**

### Restored

| | over-shrunk | now |
|---|---|---|
| `--fs-h1` max | 2.6rem | 3.3rem |
| Body text | .97rem | 1.02rem |
| Product card column | 196px | 238px |
| Product name | .96rem | 1.05rem |
| Product price | 1.08rem | 1.22rem |
| Card padding | 12/13px | 16/17px |
| Quantity button | 26×31 | 34×**44** |
| Add to Cart | 31px tall | **44px** |

Section gaps were **not** touched — still 56px desktop / 28px mobile.

While restoring these I also fixed the tap-target problem the UI/UX audit found
last turn. Every control the customer actually presses is now at least 44px:
quantity buttons, Add to Cart, wishlist heart, review arrows, hero icons, and all
primary buttons. Comfortable and compliant at the same time.

### Category section

Rebuilt as a compact horizontal rail of circular images, inspired by your
reference: picture, name, then count or status. No card backgrounds, no
rectangles, no per-item paragraphs.

```
   (  ○  )      (  ○  )      (  ○  )      (  ○  )
Homemade Foods  Home & Kitchen  Women's    Kids Wear
  29 Products     68 Products  Coming Soon Coming Soon
```

All six fit on one row down to 1024px; below that the row scrolls horizontally
with snap points, showing three to four at a time on a phone. No page overflow.

Imagery: the two live categories lead with **real catalogue photographs** — your
Sprouted Health Mix pack and a Home & Kitchen product. The four not yet stocked
use designed brand tiles (dress, kite, gem, gift) in the palette. Nothing
scraped, no stock photography, and no product shown that you don't sell.

Heading is now **"Shop By Category"** with the descriptive paragraph dropped, to
match the reference's compactness.

### Result

Even with every component back to full size, the page is **shorter than before**,
because the category block did the work:

| | category block | full homepage |
|---|---|---|
| Desktop 1440 | 350px → **189px** (46% shorter) | ~3,917 → ~3,816px |
| Mobile 390 | 570px → **135px** (76% shorter) | ~5,326 → ~5,011px |

That's the principle you asked for: less empty space and shorter containers, not
smaller content.


## Update 6 — logo distortion and category alignment

### Rail logo was being squashed

The logo showed as a vertical oval because the maths didn't work: the rail is
**68px** wide with **22px** padding on each side, leaving only **24px** of space
for a **44px** logo. It got compressed horizontally while keeping its height.

Padding is now 12px, giving exactly 44px, and the mark is pinned with
`flex:0 0 44px` and `aspect-ratio:1` so it can never be squeezed again. The
expanded rail uses 16px, where there is room to spare.

A test now asserts the arithmetic — `rail width − padding ≥ logo width` — so this
particular bug can't come back silently.

### Category row alignment

Two causes, both fixed:

**Different circle sizes.** The tile box was sized with `aspect-ratio` while the
`<img>` inside carried its own `width`/`height` attributes, so the box partly
derived its size from the image. Now width and height are both set explicitly in
CSS and the image simply fills it.

**Labels on different baselines.** The row had no `align-items`, and names that
wrap to two lines ("Women's Clothing") pushed their counts lower than names on
one line. The row is now `align-items:flex-start` and the name block has a fixed
`min-height:2.5em`, so every name and every count sits on the same line across
the row.

### Icons for all six categories

The first two used product photographs while the rest used drawn icons, which is
what made the row look mismatched. All six now use the same drawn treatment —
a grain ear for Homemade Foods and a cup for Home & Kitchen, matching the dress,
kite, gem and gift already there. Product photography belongs on the product
cards.

Row fit is unchanged: one line down to 768px, horizontal scroll below that.


## Update 7 — category alignment, light sidebar, contact layout

### Category alignment, properly this time

The previous fix relied on a `min-height` guess. It's now structural: the rail is
a **grid** whose three rows (image / name / status) belong to the container, and
each tile spans all three via `subgrid`. A name wrapping to two lines can no
longer push its own status line below its neighbours' — the rows are shared, so
alignment is a property of the layout rather than of the content.

A `@supports not (grid-template-rows:subgrid)` block gives fixed row heights for
older browsers, with the same result.

The tile artwork also now fills the full square. Previously each SVG drew its own
inner circle at 75% of the box, which read as a second, smaller disc inside the
container's circular crop and made the tiles look mismatched.

### Sidebar

**No more scrollbar.** Content height went from ~722px to ~578px — it now fits a
720px-tall window without scrolling, where before it overflowed anything under
about 800px. Trimmed: header height, logo 44→42px, item padding 11→8px, icon
1.12→1.02rem, label spacing, group gaps and the footer. `overflow-y:auto` stays
so genuinely short windows still scroll rather than clip.

**New palette.** The near-black green is gone:

| | |
|---|---|
| `--rail-bg` | `#F6F1E6` warm ivory |
| `--rail-bg-2` | `#EFE8D9` header / footer bands |
| `--rail-ink` | `#23291F` charcoal — 13.2:1 |
| `--rail-muted` | `#5E6857` — 5.2:1 |
| `--rail-active` | `#DDE7D6` soft sage |
| `--rail-active-ink` | `#1F3A22` — 9.8:1 |

The mobile drawer moved to the same surface — it reuses the sidebar's item
classes, so leaving it dark would have made its own nav text unreadable. The
splash screen, toasts and ticker stay dark by design.

The logo no longer needs its cream disc on the rail; on ivory the artwork's
dark-green lettering reads directly, so the full lockup is used as-is. The plate
remains on the splash and footer, which are still dark.

### Contact page

Rebuilt: **form left, business details right, map full width beneath both.**

The map now sits outside the two-column block entirely — that's what kept it
pinned under the left column before. It spans the full content width at
`clamp(240px, 30vw, 400px)` tall, dropping to 280–360px on tablet and 240–320px
on mobile. Below 900px the two columns stack: form, then details, then map.

Location, phone, FSSAI and the map target are untouched, and the WhatsApp form
submission is verified end to end in the tests.


## Update 8 — burgundy theme, cleaner nav, assistant

### Complete colour replacement

The green UI is gone. New palette:

| Token | | |
|---|---|---|
| `--primary` | `#7A263A` | burgundy — buttons, price, active nav |
| `--primary-dark` | `#5A1C2B` | footer, dark bands |
| `--secondary` | `#B85C38` | terracotta |
| `--accent` | `#C49A4A` | antique gold |
| `--background` | `#F7F1E7` | warm ivory |
| `--surface` | `#FFFDF8` | cards, drawers |
| `--text` | `#25211D` | espresso |
| `--muted-text` | `#6E655C` | warm taupe |
| `--border` | `#DED4C7` | |

Because the sheets were already tokenised, the whole site re-skins from one
block. Beyond the tokens I also swept: green-black shadow tints, the hero video
scrim and vignette, the old cursor ring, the `theme-color` meta, and a
`.chip-green` benefit tag that was still holding a literal green.

`--success` was green and is now the brand burgundy — a confirmation state is
brand-coloured rather than a signal colour.

**Generated artwork was recoloured too.** The six category tiles now run
burgundy / terracotta / gold, and the twenty product illustrations moved to warm
food-appropriate tones — golden grain, gold mixes, terracotta spice, deep
jaggery laddu — so nothing on the page reads as the old theme.

**The logo is untouched.** A test asserts its original green pixels are still
there, so a future colour pass can't quietly recolour the artwork. WhatsApp keeps
its own `#1FA855`; a test confirms those are the *only* greens left in the code.

Every pairing is contrast-checked, including the sidebar's new soft-burgundy
active state.

### Sidebar and action bar

The "Your Store" group is gone — Search, Wishlist, Cart, About and the duplicate
Contact. The sidebar is now eight shopping destinations: Home, the four
collections, the two coming-soon groups, and Contact.

Those actions had to go somewhere, so the icon cluster moved **out of the hero
into a global action bar** — fixed top-right on every page, not just the
homepage. Search, Wishlist, Cart and now **Contact**. It restyles itself while
sitting over the hero video and returns to the ivory surface elsewhere. On mobile
the top bar takes over and now carries Wishlist as well.

### Floating buttons

Three, stacked, never overlapping — assistant, back to top, WhatsApp. Their
positions are derived from shared `--fab` size and `--fab-gap` values rather than
hard-coded offsets, so they can't collide when sizes change on mobile.

Back to Top appears after 420px of scroll, fades in, and scrolls smoothly to the
top without navigating. It honours `prefers-reduced-motion`.

### Shopping assistant

A floating assistant with a chat panel, suggested questions, Enter-to-send and
Escape-to-close. **No external API and no key** — answers come from a local FAQ
module (`js/assistant-data.js`) that reads the live catalogue, so prices and
product names can never drift from the shop.

It handles product questions ("How much is Sprouted Health Mix?" → the real price
and sizes), category questions, ordering, contact details and FSSAI — all from
existing data. Unknown questions get an honest fallback plus a route to a human;
it never guesses.

Two matching bugs worth noting, both caught by testing rather than assumed away:
"do you **shi**p to mars" was greeting the customer because `hi` matched inside
`ship`, and "show me your masala**s**" returned the single product *Non Veg
Masala* rather than the range. Matching is now whole-word with plural tolerance,
and a group word like "masala" no longer resolves to a product whose name merely
contains it.

## Browser support

Chrome, Edge, Safari, Firefox — current versions. Fully keyboard navigable,
respects `prefers-reduced-motion`, and all text meets WCAG AA contrast.

## Testing

555 automated tests cover data integrity against the original file, variant
pricing, routing, cart/wishlist, the WhatsApp order message, accessibility and
contrast.

**Not verified:** I still cannot run a real browser here, so nothing has been
screenshotted live. Tile widths, row fit and page height were computed from the
CSS rather than measured on screen. Please open it and check: that the six
category circles sit comfortably on one row on your monitor, that the row scrolls
cleanly on your phone, and that the product cards now feel right at 100% zoom.
