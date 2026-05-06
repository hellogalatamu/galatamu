const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

// ============================================================
// ModernTheme — font-mono-tech
// ============================================================
let modern = fs.readFileSync(path.join(themesDir, 'ModernTheme.tsx'), 'utf8');

modern = modern.replace(
  `        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap');\r\n        .font-mono-tech { font-family: 'JetBrains Mono', monospace; }`,
  `        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap');\r\n        \${getFontStyle(data.font_style) ? \`@import url('\${getFontStyle(data.font_style).googleUrl}');\` : ''}\r\n        .font-mono-tech { font-family: \${getFontStyle(data.font_style)?.fontFamily ?? "'JetBrains Mono', monospace"}; }`
);

fs.writeFileSync(path.join(themesDir, 'ModernTheme.tsx'), modern);
console.log('ModernTheme done');

// ============================================================
// VintageTheme — font-paper (Playfair Display)
// ============================================================
let vintage = fs.readFileSync(path.join(themesDir, 'VintageTheme.tsx'), 'utf8');

// Find and replace the style block for Vintage
vintage = vintage.replace(
  `        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap');\n        .font-paper`,
  `        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap');\n        \${getFontStyle(data.font_style) ? \`@import url('\${getFontStyle(data.font_style).googleUrl}');\` : ''}\n        .font-paper`
);

// Also override the font-paper font-family definition
vintage = vintage.replace(
  /\.font-paper \{ font-family: 'Playfair Display', serif; \}/,
  `.font-paper { font-family: \${getFontStyle(data.font_style)?.fontFamily ?? "'Playfair Display', serif"}; }`
);

fs.writeFileSync(path.join(themesDir, 'VintageTheme.tsx'), vintage);
console.log('VintageTheme done');

// ============================================================
// RomanticRoseTheme — No style block. Add one after the outer div opening
// ============================================================
let romantic = fs.readFileSync(path.join(themesDir, 'RomanticRoseTheme.tsx'), 'utf8');

// RomanticRose uses inline font-serif class from Tailwind. We inject a style block 
// and a custom class .font-romantic that overrides the display font.
// Find the first <div className...> in the return and add a <style> after it

const romanticDivStart = `  return (
    <div className={\`bg-[#fff1f2] min-h-screen text-[#881337] font-serif selection:bg-[#fb7185] selection:text-white \${previewMode ? 'relative' : ''}\`}>`;

const romanticDivReplacement = `  const customFont = getFontStyle(data.font_style);

  return (
    <div className={\`bg-[#fff1f2] min-h-screen text-[#881337] font-serif selection:bg-[#fb7185] selection:text-white \${previewMode ? 'relative' : ''}\`}>
      {customFont && (
        <style>{\`
          @import url('\${customFont.googleUrl}');
          .font-romantic-display { font-family: \${customFont.fontFamily}; }
        \`}</style>
      )}`;

if (romantic.includes(romanticDivStart)) {
  romantic = romantic.replace(romanticDivStart, romanticDivReplacement);
  console.log('RomanticRoseTheme: injected style block');
} else {
  console.log('RomanticRoseTheme: could not find div start, trying fallback...');
  // Fallback: search by simpler pattern
  const simplePattern = `bg-[#fff1f2] min-h-screen text-[#881337] font-serif`;
  if (romantic.includes(simplePattern)) {
    // Find the enclosing return block manually
    romantic = romantic.replace(
      /const customFont[\s\S]*?$/, // remove previous injection if any
      ''
    );
    console.log('RomanticRoseTheme: fallback applied');
  }
}

// Now replace heading elements that show names — add conditional font class
// The main heading of groom & bride names uses standard Tailwind classes. 
// We'll add a wrapper span with inline style when customFont is set.
// Replace: h2 with groom name
romantic = romantic.replace(
  `<h2 className="text-6xl md:text-9xl font-bold italic mb-12 text-[#881337] tracking-tighter leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>`,
  `<h2 className={\`text-6xl md:text-9xl font-bold italic mb-12 text-[#881337] tracking-tighter leading-none \${customFont ? 'font-romantic-display' : ''}\`}>{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>`
);
// Replace groom h3
romantic = romantic.replace(
  `<h3 className="text-4xl font-bold italic text-[#881337] mb-2">{data.bride_data.groom}</h3>`,
  `<h3 className={\`text-4xl font-bold italic text-[#881337] mb-2 \${customFont ? 'font-romantic-display' : ''}\`}>{data.bride_data.groom}</h3>`
);
// Replace bride h3
romantic = romantic.replace(
  `<h3 className="text-4xl font-bold italic text-[#881337] mb-2">{data.bride_data.bride}</h3>`,
  `<h3 className={\`text-4xl font-bold italic text-[#881337] mb-2 \${customFont ? 'font-romantic-display' : ''}\`}>{data.bride_data.bride}</h3>`
);

fs.writeFileSync(path.join(themesDir, 'RomanticRoseTheme.tsx'), romantic);
console.log('RomanticRoseTheme done');

console.log('\nAll remaining themes updated!');
