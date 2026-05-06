const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

// ============================================================
// MinimalistWhiteTheme — font-playfair
// ============================================================
let minWhite = fs.readFileSync(path.join(themesDir, 'MinimalistWhiteTheme.tsx'), 'utf8');

minWhite = minWhite.replace(
  `      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
        .font-ultra { font-family: 'Inter', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .tracking-ultra { letter-spacing: 0.8em; }
      \`}</style>`,
  `      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
        \${getFontStyle(data.font_style) ? \`@import url('\${getFontStyle(data.font_style).googleUrl}');\` : ''}
        .font-ultra { font-family: 'Inter', sans-serif; }
        .font-playfair { font-family: \${getFontStyle(data.font_style)?.fontFamily ?? "'Playfair Display', serif"}; }
        .tracking-ultra { letter-spacing: 0.8em; }
      \`}</style>`
);

fs.writeFileSync(path.join(themesDir, 'MinimalistWhiteTheme.tsx'), minWhite);
console.log('MinimalistWhiteTheme done');

// ============================================================
// ModernTheme — check font class names
// ============================================================
let modern = fs.readFileSync(path.join(themesDir, 'ModernTheme.tsx'), 'utf8');
console.log('ModernTheme style block:', modern.includes('<style>') ? 'Found' : 'Not found');
// Find the style block
const modernStyleMatch = modern.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (modernStyleMatch) {
  console.log('ModernTheme style content:', modernStyleMatch[1].substring(0, 200));
}
fs.writeFileSync(path.join(themesDir, 'ModernTheme.tsx'), modern);

// ============================================================
// MidnightTheme — check font class names
// ============================================================
let midnight = fs.readFileSync(path.join(themesDir, 'MidnightTheme.tsx'), 'utf8');
const midnightStyleMatch = midnight.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (midnightStyleMatch) {
  console.log('MidnightTheme style content:', midnightStyleMatch[1].substring(0, 200));
}
fs.writeFileSync(path.join(themesDir, 'MidnightTheme.tsx'), midnight);

// ============================================================
// VintageTheme — check
// ============================================================
let vintage = fs.readFileSync(path.join(themesDir, 'VintageTheme.tsx'), 'utf8');
const vintageStyleMatch = vintage.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (vintageStyleMatch) {
  console.log('VintageTheme style content:', vintageStyleMatch[1].substring(0, 200));
}
fs.writeFileSync(path.join(themesDir, 'VintageTheme.tsx'), vintage);

// ============================================================
// TerracottaTheme — check
// ============================================================
let terracotta = fs.readFileSync(path.join(themesDir, 'TerracottaTheme.tsx'), 'utf8');
const terracottaStyleMatch = terracotta.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (terracottaStyleMatch) {
  console.log('TerracottaTheme style content:', terracottaStyleMatch[1].substring(0, 200));
}
fs.writeFileSync(path.join(themesDir, 'TerracottaTheme.tsx'), terracotta);

// ============================================================
// RomanticRoseTheme — no style block (inline styles), add one
// ============================================================
let romantic = fs.readFileSync(path.join(themesDir, 'RomanticRoseTheme.tsx'), 'utf8');
const romanticStyleMatch = romantic.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (romanticStyleMatch) {
  console.log('RomanticRoseTheme style content:', romanticStyleMatch[1].substring(0, 200));
} else {
  console.log('RomanticRoseTheme: No style block found');
}

console.log('\nDone inspecting!');
