/* ============================================================
   Generates a branded placeholder visual for each organic product
   that has no photograph yet.

   These are DESIGNED GRAPHICS, not photographs and not stock images.
   Nothing is scraped and no product packaging is depicted, so nothing
   here can misrepresent what the customer receives. Each one is a flat
   SVG built from the site's own palette, so it is tiny, stays crisp at
   any size, and can be swapped for a real photo by dropping a .jpg into
   assets/products/ and pointing the product's `img` field at it.
   ============================================================ */
const fs = require('fs');
global.window = {};
require('/home/claude/slm/js/data.js');
const D = window.SLM;

/* Warm, food-appropriate tones drawn from the new palette — golden
   grain, gold mixes, terracotta spice, deep jaggery laddu. */
const PALETTE = {
  malt:     { deep:'#7E5E22', mid:'#B8913C', soft:'#DCC183', wash:'#F6EEDC' },
  readymix: { deep:'#8A6524', mid:'#C49A4A', soft:'#E3CB92', wash:'#F8F0DE' },
  masala:   { deep:'#8A3A20', mid:'#B85C38', soft:'#DDA07E', wash:'#F8E7DC' },
  laddu:    { deep:'#5A1C2B', mid:'#96334A', soft:'#C88295', wash:'#F3E3E6' }
};

/* deterministic per-product jitter so no two cards look identical */
const seedOf = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const rnd = seed => { let x = seed; return () => (x = (x * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; };

/* ---------- motifs, one per category ---------- */

function grainSprig(c, r) {                       // MALT — sprouted grain ears
  const ears = 3 + Math.round(r());               // 3 or 4 ears
  let g = '';
  for (let i = 0; i < ears; i++) {
    const spread = 82;
    const x = 256 + (i - (ears - 1) / 2) * spread;
    const len = 186 + r() * 34, tilt = (i - (ears - 1) / 2) * 9;
    g += `<g transform="translate(${x},372) rotate(${tilt})">
      <path d="M0 0 V-${len}" stroke="${c.deep}" stroke-width="7" stroke-linecap="round"/>`;
    const pods = 8;
    for (let k = 0; k < pods; k++) {
      const y = -36 - k * (len - 44) / pods, w = 34 - k * 2.6;
      g += `<ellipse cx="-${w * .82}" cy="${y}" rx="${w * .56}" ry="${w * .3}"
              fill="${c.mid}" transform="rotate(-34 -${w * .82} ${y})"/>
            <ellipse cx="${w * .82}" cy="${y}" rx="${w * .56}" ry="${w * .3}"
              fill="${c.soft}" transform="rotate(34 ${w * .82} ${y})"/>`;
    }
    g += `<circle cx="0" cy="-${len}" r="7" fill="${c.mid}"/></g>`;
  }
  return g;
}

function dosaiStack(c, r) {                       // READY MIX — dosai on a tawa
  const layers = 2 + Math.round(r());             // 2 or 3 stacked
  let g = `<ellipse cx="256" cy="368" rx="196" ry="46" fill="${c.deep}" opacity=".16"/>
           <ellipse cx="256" cy="344" rx="192" ry="62" fill="${c.deep}"/>
           <ellipse cx="256" cy="330" rx="180" ry="58" fill="${c.mid}"/>`;
  for (let i = 0; i < layers; i++) {
    const y = 314 - i * 30, rx = 160 - i * 16;
    g += `<ellipse cx="256" cy="${y}" rx="${rx}" ry="${rx * .33}"
            fill="${i % 2 ? c.soft : c.wash}" opacity=".96"/>
          <path d="M${256 - rx * .62} ${y - 2}q${rx * .62} -${22 - i * 3} ${rx * 1.24} 0"
            stroke="${c.mid}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>`;
  }
  for (let k = 0; k < 3; k++)
    g += `<circle cx="${190 + r() * 140}" cy="${232 + r() * 34}" r="${8 + r() * 9}"
            fill="${c.deep}" opacity=".${3 + k}"/>`;
  return g;
}

function spiceBowl(c, r) {                        // MASALA — ground spice in a bowl
  const grains = Array.from({ length: 46 }, () => {
    const a = r() * Math.PI * 2, d = r() * 128;
    return `<circle cx="${256 + Math.cos(a) * d}" cy="${286 + Math.sin(a) * d * .3}"
              r="${1.8 + r() * 3}" fill="${c.deep}" opacity="${.25 + r() * .3}"/>`;
  }).join('');
  return `
    <ellipse cx="256" cy="382" rx="180" ry="40" fill="${c.deep}" opacity=".16"/>
    <path d="M84 300h344a172 96 0 0 1-344 0Z" fill="${c.deep}"/>
    <path d="M96 300h320a160 84 0 0 1-320 0Z" fill="${c.mid}" opacity=".55"/>
    <ellipse cx="256" cy="300" rx="172" ry="52" fill="${c.wash}"/>
    <path d="M108 296q148-118 296 0-24 54-148 54T108 296Z" fill="${c.deep}"/>
    <path d="M124 294q132-100 264 0-20 44-132 44T124 294Z" fill="${c.mid}"/>
    <path d="M156 284q100-72 200 0" fill="${c.soft}" opacity=".92"/>
    ${grains}`;
}

function ladduTrio(c, r) {                        // LADDU — jaggery millet laddus
  const ball = (cx, cy, rad, tone) => {
    let t = '';
    for (let i = 0; i < 22; i++) {
      const a = r() * Math.PI * 2, d = r() * rad * .74;
      t += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}"
              r="${1.8 + r() * 2.6}" fill="${c.deep}" opacity="${.28 + r() * .28}"/>`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${tone}"/>
            <circle cx="${cx - rad * .3}" cy="${cy - rad * .34}" r="${rad * .36}"
                    fill="#fff" opacity=".18"/>${t}`;
  };
  const four = r() > .5;
  return `
    <ellipse cx="256" cy="384" rx="188" ry="38" fill="${c.deep}" opacity=".16"/>
    <path d="M92 320h328a164 68 0 0 1-328 0Z" fill="${c.deep}" opacity=".9"/>
    <ellipse cx="256" cy="320" rx="164" ry="42" fill="${c.wash}"/>
    ${ball(168, 296, 76, c.mid)}
    ${ball(344, 296, 76, c.mid)}
    ${four ? ball(256, 314, 70, c.soft) : ''}
    ${ball(256, 216, 86, c.soft)}`;
}

const MOTIF = { malt:grainSprig, readymix:dosaiStack, masala:spiceBowl, laddu:ladduTrio };

/* ---------- compose ---------- */
function svgFor(p) {
  const base = PALETTE[p.cat];
  const r = rnd(seedOf(p.name));
  /* nudge the tone a little per product so two items in the same
     category never render as the same picture */
  const shift = v => {
    const n = parseInt(v.slice(1), 16);
    const d = Math.round((r() - .5) * 26);
    const cl = x => Math.max(0, Math.min(255, x + d));
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255]
      .map(x => cl(x).toString(16).padStart(2, '0')).join('');
  };
  const c = { deep:shift(base.deep), mid:shift(base.mid),
              soft:shift(base.soft), wash:base.wash };
  const rot = -5 + r() * 10;

  const specks = Array.from({ length: 30 }, () =>
    `<circle cx="${r() * 512}" cy="${r() * 512}" r="${.7 + r() * 1.1}"
       fill="${c.deep}" opacity="${.05 + r() * .07}"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"
  role="img" aria-label="${p.name} — illustration">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FDFBF6"/><stop offset="1" stop-color="${c.wash}"/>
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="42%" r="72%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="${c.deep}" stop-opacity=".10"/>
    </radialGradient>
  </defs>

  <rect width="512" height="512" fill="url(#bg)"/>
  ${specks}

  <!-- plate the motif sits on, so lighting reads the same on every card -->
  <circle cx="256" cy="272" r="214" fill="#fff" opacity=".5"/>
  <circle cx="256" cy="272" r="214" fill="none" stroke="${c.mid}" stroke-width="1.6" opacity=".3"/>
  <circle cx="256" cy="272" r="234" fill="none" stroke="${c.mid}" stroke-width="1" opacity=".15"/>

  <g transform="rotate(${rot.toFixed(2)} 256 272)">${MOTIF[p.cat](c, r)}</g>

  <rect width="512" height="512" fill="url(#vig)"/>

  <!-- gold rule, echoing the eyebrow rule used throughout the site -->
  <path d="M206 462h100" stroke="#B08D3F" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
</svg>`;
}

let n = 0;
for (const p of D.products) {
  // regenerate every illustration; real photographs are .jpg and are skipped
  if (!p.placeholder) continue;
  fs.writeFileSync(`/home/claude/slm/assets/products/p${p.id}.svg`, svgFor(p));
  n++;
}
console.log('generated', n, 'placeholder visuals');
