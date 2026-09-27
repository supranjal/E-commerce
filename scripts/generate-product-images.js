const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "../public/images/products");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createRudrakshaSvg({
  title,
  subtitle,
  mukhiCount,
  isSpecial,
  isTwin,
  isTrunk,
  isMala,
  isBracelet,
  isBox,
}) {
  let innerArt = "";

  if (isMala) {
    // Beaded Rosary Art
    innerArt = `
      <!-- Beaded Necklace Loop -->
      <circle cx="200" cy="180" r="95" fill="none" stroke="#6D4C30" stroke-width="12" stroke-dasharray="14 8" />
      <circle cx="200" cy="180" r="95" fill="none" stroke="#BA9463" stroke-width="4" stroke-dasharray="14 8" />
      <!-- Guru Bead -->
      <circle cx="200" cy="275" r="16" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="2" />
      <!-- Saffron Tassel -->
      <path d="M 195 291 L 188 350 L 212 350 L 205 291 Z" fill="url(#saffronGrad)" />
      <line x1="188" y1="350" x2="182" y2="380" stroke="#D97706" stroke-width="3" />
      <line x1="195" y1="350" x2="195" y2="385" stroke="#F59E0B" stroke-width="3" />
      <line x1="200" y1="350" x2="200" y2="385" stroke="#D97706" stroke-width="3" />
      <line x1="205" y1="350" x2="205" y2="385" stroke="#F59E0B" stroke-width="3" />
      <line x1="212" y1="350" x2="218" y2="380" stroke="#D97706" stroke-width="3" />
    `;
  } else if (isBracelet) {
    // Silver capped bracelet
    innerArt = `
      <circle cx="200" cy="190" r="85" fill="none" stroke="#3E2723" stroke-width="18" stroke-dasharray="24 10" />
      <circle cx="200" cy="190" r="85" fill="none" stroke="#E2E8F0" stroke-width="8" stroke-dasharray="24 10" />
      <!-- Silver Clasp -->
      <rect x="180" y="90" width="40" height="20" rx="6" fill="url(#silverGrad)" stroke="#94A3B8" stroke-width="2" />
      <!-- Center Capped Bead -->
      <circle cx="200" cy="275" r="28" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="3" />
      <path d="M 172 275 Q 200 250 228 275" fill="none" stroke="url(#silverGrad)" stroke-width="8" />
      <path d="M 172 275 Q 200 300 228 275" fill="none" stroke="url(#silverGrad)" stroke-width="8" />
    `;
  } else if (isBox) {
    // Carved Teakwood Box
    innerArt = `
      <!-- Wooden Casket Body -->
      <rect x="90" y="140" width="220" height="150" rx="12" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="4" />
      <!-- Carved Lid -->
      <path d="M 80 140 L 110 90 L 290 90 L 320 140 Z" fill="url(#darkWoodGrad)" stroke="#3E2723" stroke-width="4" />
      <!-- Inner Saffron Velvet Glow -->
      <rect x="105" y="155" width="190" height="120" rx="8" fill="#78350F" opacity="0.6" />
      <!-- Brass Latch -->
      <circle cx="200" cy="150" r="14" fill="url(#goldGrad)" stroke="#78350F" stroke-width="2" />
      <rect x="194" y="150" width="12" height="24" rx="2" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.5" />
    `;
  } else if (isTwin) {
    // Gauri Shankar Twin Conjoined Bead
    innerArt = `
      <!-- Left Conjoined Bead -->
      <circle cx="155" cy="195" r="65" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="3.5" filter="url(#dropShadow)" />
      <!-- Right Conjoined Bead -->
      <circle cx="245" cy="195" r="65" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="3.5" filter="url(#dropShadow)" />
      <!-- Natural Fusion Joint -->
      <ellipse cx="200" cy="195" rx="26" ry="60" fill="url(#darkWoodGrad)" opacity="0.9" />
      <!-- Grooves -->
      <path d="M 155 130 Q 120 195 155 260" fill="none" stroke="#2B1810" stroke-width="3" />
      <path d="M 155 130 Q 180 195 155 260" fill="none" stroke="#2B1810" stroke-width="3" />
      <path d="M 245 130 Q 210 195 245 260" fill="none" stroke="#2B1810" stroke-width="3" />
      <path d="M 245 130 Q 280 195 245 260" fill="none" stroke="#2B1810" stroke-width="3" />
    `;
  } else if (isTrunk) {
    // Ganesh Rudraksha with Natural Trunk
    innerArt = `
      <!-- Main Seed Body -->
      <circle cx="200" cy="205" r="75" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="4" filter="url(#dropShadow)" />
      <!-- Trunk Protrusion -->
      <path d="M 200 130 C 200 70, 260 80, 255 130 C 250 160, 220 160, 200 165 Z" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="3.5" />
      <!-- Mukhi Grooves -->
      <path d="M 200 130 Q 140 205 200 280" fill="none" stroke="#2B1810" stroke-width="3.5" />
      <path d="M 200 130 Q 170 205 200 280" fill="none" stroke="#2B1810" stroke-width="3" />
      <path d="M 200 130 Q 230 205 200 280" fill="none" stroke="#2B1810" stroke-width="3" />
      <path d="M 200 130 Q 260 205 200 280" fill="none" stroke="#2B1810" stroke-width="3.5" />
    `;
  } else {
    // Standard Authentic Single Rudraksha Bead (1 to 14 Mukhi)
    const count = mukhiCount || 5;
    let lines = "";
    
    // Generate organic curved Mukhi lines based on count
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI - Math.PI / 2;
      const xOffset = Math.sin(angle) * 70;
      lines += `<path d="M 200 115 Q ${200 + xOffset * 1.3} 195 200 275" fill="none" stroke="#23130C" stroke-width="${Math.max(2, 4.5 - count * 0.15)}" stroke-linecap="round" />\n`;
      // Highlighting ridge next to cleft
      lines += `<path d="M 200 115 Q ${200 + xOffset * 1.3 - 4} 195 200 275" fill="none" stroke="#BA9463" stroke-width="1.2" opacity="0.6" />\n`;
    }

    // Natural Savar extension for 1 Mukhi
    const savarBase = count === 1 ? `
      <circle cx="200" cy="245" r="45" fill="url(#darkWoodGrad)" stroke="#3E2723" stroke-width="3" />
      <ellipse cx="200" cy="180" rx="55" ry="68" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="4" filter="url(#dropShadow)" />
    ` : `
      <circle cx="200" cy="195" r="82" fill="url(#woodGrad)" stroke="#3E2723" stroke-width="4" filter="url(#dropShadow)" />
    `;

    innerArt = `
      ${savarBase}
      <!-- Organic Surface Tubercles / Thorns -->
      <g fill="#593E2B" opacity="0.7">
        <circle cx="160" cy="160" r="4" />
        <circle cx="240" cy="160" r="4.5" />
        <circle cx="150" cy="210" r="5" />
        <circle cx="250" cy="210" r="4" />
        <circle cx="175" cy="240" r="4" />
        <circle cx="225" cy="240" r="4.5" />
        <circle cx="190" cy="140" r="3.5" />
        <circle cx="210" cy="140" r="3.5" />
      </g>
      <!-- Mukhi Facial Lines -->
      ${lines}
      <!-- Apical & Basal Pores -->
      <circle cx="200" cy="115" r="7" fill="#1C1917" stroke="#BA9463" stroke-width="1.5" />
      <circle cx="200" cy="275" r="7" fill="#1C1917" stroke="#BA9463" stroke-width="1.5" />
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <!-- Background Ambient Glow -->
      <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#2D1E16" />
        <stop offset="60%" stop-color="#19110D" />
        <stop offset="100%" stop-color="#0F0A07" />
      </radialGradient>

      <!-- Realistic Rudraksha Mahogany Wood Texture -->
      <radialGradient id="woodGrad" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stop-color="#BA9463" />
        <stop offset="25%" stop-color="#865F3A" />
        <stop offset="65%" stop-color="#593E2B" />
        <stop offset="90%" stop-color="#3A1E12" />
        <stop offset="100%" stop-color="#23130C" />
      </radialGradient>

      <!-- Darker Joint / Savar Wood -->
      <radialGradient id="darkWoodGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#6D4C30" />
        <stop offset="70%" stop-color="#3A1E12" />
        <stop offset="100%" stop-color="#1A0D07" />
      </radialGradient>

      <!-- Sacred Saffron & Gold Gradients -->
      <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FBBF24" />
        <stop offset="50%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="50%" stop-color="#EAB308" />
        <stop offset="100%" stop-color="#854D0E" />
      </linearGradient>

      <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#CBD5E1" />
        <stop offset="100%" stop-color="#64748B" />
      </linearGradient>

      <!-- Drop Shadow Filter -->
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.75" />
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="400" height="400" fill="url(#bgGrad)" />

    <!-- Sacred Concentric Decorative Aura -->
    <circle cx="200" cy="195" r="145" fill="none" stroke="#CA8A04" stroke-width="1" opacity="0.15" stroke-dasharray="4 6" />
    <circle cx="200" cy="195" r="160" fill="none" stroke="#D97706" stroke-width="0.75" opacity="0.1" />

    <!-- Main Botanical Artwork -->
    ${innerArt}

    <!-- Bottom Elegant Typography Tag -->
    <rect x="25" y="325" width="350" height="52" rx="10" fill="#140D09" fill-opacity="0.85" stroke="#452A1C" stroke-width="1.5" />
    <text x="200" y="347" text-anchor="middle" font-family="'Cinzel', 'Georgia', serif" font-size="14" font-weight="bold" fill="#FEF08A" letter-spacing="1">
      ${title.toUpperCase()}
    </text>
    <text x="200" y="365" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-size="10.5" font-weight="500" fill="#D1B48D">
      ${subtitle}
    </text>

    <!-- Top Origin Guarantee Badge -->
    <g transform="translate(20, 20)">
      <rect width="110" height="24" rx="12" fill="#2B1810" stroke="#CA8A04" stroke-width="1" />
      <circle cx="12" cy="12" r="4" fill="#10B981" />
      <text x="24" y="16" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" fill="#FDE047" letter-spacing="0.5">
        NEPAL ORIGIN
      </text>
    </g>
  </svg>`;
}

const productsToGenerate = [
  { file: "1-mukhi.svg", title: "1 Mukhi Savar", subtitle: "Sankhuwasabha • Natural Savar Joint", mukhiCount: 1 },
  { file: "2-mukhi.svg", title: "2 Mukhi Dwi Mukhi", subtitle: "Sankhuwasabha • Twin Crescent Lines", mukhiCount: 2 },
  { file: "3-mukhi.svg", title: "3 Mukhi Agni", subtitle: "Dingla, Nepal • Triangular Facets", mukhiCount: 3 },
  { file: "4-mukhi.svg", title: "4 Mukhi Brahma", subtitle: "Sankhuwasabha • Quad Cleft Symmetry", mukhiCount: 4 },
  { file: "5-mukhi.svg", title: "5 Mukhi Collector", subtitle: "Dingla, Nepal • 22mm+ Prime Harvest", mukhiCount: 5 },
  { file: "6-mukhi.svg", title: "6 Mukhi Kartikeya", subtitle: "Sankhuwasabha • Hexagonal Lines", mukhiCount: 6 },
  { file: "7-mukhi.svg", title: "7 Mukhi Mahalakshmi", subtitle: "Sankhuwasabha • 7 Facet Clefts", mukhiCount: 7 },
  { file: "8-mukhi.svg", title: "8 Mukhi Ganesh", subtitle: "Dingla, Nepal • 8 Natural Lines", mukhiCount: 8 },
  { file: "9-mukhi.svg", title: "9 Mukhi Navadurga", subtitle: "Sankhuwasabha • 9 Distinct Clefts", mukhiCount: 9 },
  { file: "10-mukhi.svg", title: "10 Mukhi Dashamukhi", subtitle: "Sankhuwasabha • 10 Facet Spherical", mukhiCount: 10 },
  { file: "14-mukhi.svg", title: "14 Mukhi Devamani", subtitle: "Sankhuwasabha • Supreme Rare Specimen", mukhiCount: 14 },
  { file: "gauri-shankar.svg", title: "Gauri Shankar", subtitle: "Sankhuwasabha • Organic Twin Union", isTwin: true },
  { file: "ganesh.svg", title: "Ganesh Rudraksha", subtitle: "Dingla • Natural Trunk Formation", isTrunk: true },
  { file: "japa-mala.svg", title: "108+1 Japa Mala", subtitle: "Authentic Nepali 8mm Beads + Tassel", isMala: true },
  { file: "silver-bracelet.svg", title: "Silver Capped Bracelet", subtitle: "925 Pure Sterling Silver + 5 Mukhi", isBracelet: true },
  { file: "storage-box.svg", title: "Carved Teakwood Box", subtitle: "Handcrafted Himalayan Velvet Casket", isBox: true },
];

for (const p of productsToGenerate) {
  const content = createRudrakshaSvg(p);
  const filePath = path.join(outputDir, p.file);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Generated: ${p.file}`);
}

console.log(" All product assets created successfully in public/images/products/");
