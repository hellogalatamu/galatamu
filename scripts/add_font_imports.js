const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

// ===== AMARA =====
let amara = fs.readFileSync(path.join(themesDir, 'AmaraTheme.tsx'), 'utf8');

// 1. Add import
if (!amara.includes("import { getFontStyle }")) {
  amara = amara.replace(
    'import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";',
    'import { generateGoogleCalendarLink, generateICalLink } from "@/lib/calendarHelper";\nimport { getFontStyle } from "@/lib/fontStyles";'
  );
}

// 2. Override font-serif-display in the style block
amara = amara.replace(
  /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Playfair\+Display.*?Inter.*?display=swap'\);\s*\n(\s*)\.font-serif-display \{ font-family: 'Playfair Display', serif; \}/s,
  (match, indent) => {
    return `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;600&display=swap');\n${indent}\${getFontStyle(data.font_style) ? \`@import url('\${getFontStyle(data.font_style).googleUrl}');\` : ''}\n${indent}.font-serif-display { font-family: \${getFontStyle(data.font_style)?.fontFamily ?? "'Playfair Display', serif"}; }`;
  }
);

fs.writeFileSync(path.join(themesDir, 'AmaraTheme.tsx'), amara);
console.log('AmaraTheme done');

// ===== ISLAMIC =====
let islamic = fs.readFileSync(path.join(themesDir, 'IslamicTheme.tsx'), 'utf8');

if (!islamic.includes("import { getFontStyle }")) {
  // Find last import line
  const lines = islamic.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  islamic = lines.join('\n');
}

// Override font-amiri in style block
islamic = islamic.replace(
  /\.font-amiri \{ font-family: 'Amiri', Georgia, serif; \}/,
  `\${getFontStyle(data.font_style) ? \`@import url('\${getFontStyle(data.font_style).googleUrl}');\` : ''}\n        .font-amiri { font-family: \${getFontStyle(data.font_style)?.fontFamily ?? "'Amiri', Georgia, serif"}; }`
);

fs.writeFileSync(path.join(themesDir, 'IslamicTheme.tsx'), islamic);
console.log('IslamicTheme done');

// ===== ROYAL =====
let royal = fs.readFileSync(path.join(themesDir, 'RoyalTheme.tsx'), 'utf8');

if (!royal.includes("import { getFontStyle }")) {
  const lines = royal.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  royal = lines.join('\n');
}

// Override font-royal in style block
royal = royal.replace(
  /\.font-royal \{ font-family: 'Cinzel', serif; \}/,
  `\${getFontStyle(data.font_style) ? \`@import url('\${getFontStyle(data.font_style).googleUrl}');\` : ''}\n        .font-royal { font-family: \${getFontStyle(data.font_style)?.fontFamily ?? "'Cinzel', serif"}; }`
);

fs.writeFileSync(path.join(themesDir, 'RoyalTheme.tsx'), royal);
console.log('RoyalTheme done');

// ===== MINIMALIST WHITE =====
let minWhite = fs.readFileSync(path.join(themesDir, 'MinimalistWhiteTheme.tsx'), 'utf8');

if (!minWhite.includes("import { getFontStyle }")) {
  const lines = minWhite.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  minWhite = lines.join('\n');
}

fs.writeFileSync(path.join(themesDir, 'MinimalistWhiteTheme.tsx'), minWhite);
console.log('MinimalistWhiteTheme import done');

// ===== MODERN =====
let modern = fs.readFileSync(path.join(themesDir, 'ModernTheme.tsx'), 'utf8');

if (!modern.includes("import { getFontStyle }")) {
  const lines = modern.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  modern = lines.join('\n');
}

fs.writeFileSync(path.join(themesDir, 'ModernTheme.tsx'), modern);
console.log('ModernTheme import done');

// ===== MIDNIGHT =====
let midnight = fs.readFileSync(path.join(themesDir, 'MidnightTheme.tsx'), 'utf8');

if (!midnight.includes("import { getFontStyle }")) {
  const lines = midnight.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  midnight = lines.join('\n');
}

fs.writeFileSync(path.join(themesDir, 'MidnightTheme.tsx'), midnight);
console.log('MidnightTheme import done');

// ===== ROMANTIC ROSE =====
let romantic = fs.readFileSync(path.join(themesDir, 'RomanticRoseTheme.tsx'), 'utf8');

if (!romantic.includes("import { getFontStyle }")) {
  const lines = romantic.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  romantic = lines.join('\n');
}

fs.writeFileSync(path.join(themesDir, 'RomanticRoseTheme.tsx'), romantic);
console.log('RomanticRoseTheme import done');

// ===== TERRACOTTA =====
let terracotta = fs.readFileSync(path.join(themesDir, 'TerracottaTheme.tsx'), 'utf8');

if (!terracotta.includes("import { getFontStyle }")) {
  const lines = terracotta.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  terracotta = lines.join('\n');
}

fs.writeFileSync(path.join(themesDir, 'TerracottaTheme.tsx'), terracotta);
console.log('TerracottaTheme import done');

// ===== VINTAGE =====
let vintage = fs.readFileSync(path.join(themesDir, 'VintageTheme.tsx'), 'utf8');

if (!vintage.includes("import { getFontStyle }")) {
  const lines = vintage.split('\n');
  const lastImportIdx = lines.reduce((acc, line, idx) => line.startsWith('import ') ? idx : acc, 0);
  lines.splice(lastImportIdx + 1, 0, 'import { getFontStyle } from "@/lib/fontStyles";');
  vintage = lines.join('\n');
}

fs.writeFileSync(path.join(themesDir, 'VintageTheme.tsx'), vintage);
console.log('VintageTheme import done');

console.log('\nAll imports added successfully!');
