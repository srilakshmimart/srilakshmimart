/* ============================================================
   Circular category tiles.

   Live categories use a real photograph from the catalogue.
   The four not yet stocked get a designed tile in the brand palette —
   no scraped or stock imagery, and no product is depicted that the
   shop does not actually sell.
   ============================================================ */
const fs = require('fs');

const TILES = {
  organic:   { tone:'#7A263A', wash:'#F3E3E6', motif:'grain'   },
  home:      { tone:'#A24E2E', wash:'#F8E9E0', motif:'kitchen' },
  women:     { tone:'#96334A', wash:'#F5E5E8', motif:'dress'   },
  kids:      { tone:'#C08340', wash:'#F9EEDD', motif:'kite'    },
  jewellery: { tone:'#5A1C2B', wash:'#F0DEE1', motif:'gem'     },
  gifts:     { tone:'#B85C38', wash:'#F8E8DF', motif:'gift'    }
};

const MOTIF = {
  grain: t => {                                   // sprouted grain ear
    let pods = '';
    for (let k = 0; k < 7; k++) {
      const y = 250 - k * 26, w = 40 - k * 3.4;
      pods += `<ellipse cx="${200 - w * .78}" cy="${y}" rx="${w * .54}" ry="${w * .3}"
                 fill="${t}" transform="rotate(-34 ${200 - w * .78} ${y})"/>
               <ellipse cx="${200 + w * .78}" cy="${y}" rx="${w * .54}" ry="${w * .3}"
                 fill="${t}" opacity=".72" transform="rotate(34 ${200 + w * .78} ${y})"/>`;
    }
    return `<path d="M200 292V96" stroke="${t}" stroke-width="8" stroke-linecap="round"/>
            <circle cx="200" cy="92" r="8" fill="${t}"/>${pods}`;
  },
  kitchen: t => `
    <path d="M118 150h124v58a62 62 0 0 1-124 0z" fill="${t}" opacity=".92"/>
    <path d="M242 162h22a26 26 0 0 1 0 52h-22" fill="none" stroke="${t}" stroke-width="11"/>
    <path d="M150 120q0-18 14-26M180 120q0-18 14-26M210 120q0-18 14-26"
          stroke="${t}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>
    <path d="M262 266v56" stroke="${t}" stroke-width="10" stroke-linecap="round"/>
    <path d="M262 266q-16-26 0-52 16 26 0 52z" fill="${t}"/>
    <path d="M140 268h120" stroke="${t}" stroke-width="9" stroke-linecap="round" opacity=".85"/>`,
  dress: t => `
    <path d="M150 92h100l-16 40 44 122a26 26 0 0 1-25 32H147a26 26 0 0 1-25-32l44-122z"
          fill="${t}" opacity=".9"/>
    <path d="M166 92q34 30 68 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <path d="M172 200h56" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`,
  kite: t => `
    <path d="M200 78 288 168 200 258 112 168z" fill="${t}" opacity=".9"/>
    <path d="M200 78v180M112 168h176" stroke="#fff" stroke-width="6" opacity=".85"/>
    <path d="M200 258q26 30 0 56t0 40" fill="none" stroke="${t}" stroke-width="7"
          stroke-linecap="round" opacity=".75"/>`,
  gem: t => `
    <path d="M138 122h124l38 52-100 122L100 174z" fill="${t}" opacity=".92"/>
    <path d="M138 122l24 52h76l24-52M100 174h200M162 174l38 122M238 174l-38 122"
          fill="none" stroke="#fff" stroke-width="5.5" opacity=".85"/>`,
  gift: t => `
    <rect x="112" y="160" width="176" height="132" rx="12" fill="${t}" opacity=".92"/>
    <rect x="100" y="126" width="200" height="46" rx="11" fill="${t}"/>
    <path d="M200 126v166" stroke="#fff" stroke-width="9"/>
    <path d="M200 126c-34-6-52-18-46-34s34-6 46 34c12-40 40-50 46-34s-12 28-46 34z"
          fill="${t}"/>`
};

function tile(key, cfg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"
  role="img" aria-label="${key} category">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FDFBF6"/><stop offset="1" stop-color="${cfg.wash}"/>
    </linearGradient>
  </defs>
  <!-- fills the full square: the container clips it to a circle, so any inner
       ring here would read as a second, smaller disc -->
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="200" cy="200" r="198" fill="#fff" opacity=".42"/>
  <g transform="translate(200 200) scale(1.12) translate(-200 -200)">
    ${MOTIF[cfg.motif](cfg.tone)}
  </g>
</svg>`;
}

let n = 0;
for (const [k, cfg] of Object.entries(TILES)) {
  fs.writeFileSync(`/home/claude/slm/assets/categories/${k}.svg`, tile(k, cfg));
  n++;
}
console.log('generated', n, 'category tiles');
