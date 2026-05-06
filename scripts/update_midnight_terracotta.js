const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

// ============================================================
// MidnightTheme — no style block, uses font-black/font-sans
// Inject style block + override headings with inline style
// ============================================================
let midnight = fs.readFileSync(path.join(themesDir, 'MidnightTheme.tsx'), 'utf8');

// Inject const + style after eventDate line
midnight = midnight.replace(
  `  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={\`bg-[#1e1b4b] min-h-screen text-[#e0e7ff] font-sans selection:bg-[#c7d2fe] selection:text-[#1e1b4b] \${previewMode ? 'relative' : ''}\`}>`,
  `  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();
  const customFont = getFontStyle(data.font_style);

  return (
    <div className={\`bg-[#1e1b4b] min-h-screen text-[#e0e7ff] font-sans selection:bg-[#c7d2fe] selection:text-[#1e1b4b] \${previewMode ? 'relative' : ''}\`}>
      {customFont && (
        <style>{\`
          @import url('\${customFont.googleUrl}');
          .font-midnight-display { font-family: \${customFont.fontFamily}; }
        \`}</style>
      )}`
);

// Override hero heading (cover)
midnight = midnight.replace(
  `<FadeIn><h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h1></FadeIn>`,
  `<FadeIn><h1 className={\`text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none \${customFont ? 'font-midnight-display' : ''}\`}>{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h1></FadeIn>`
);

// Override main h2 hero
midnight = midnight.replace(
  `<h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-white leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>`,
  `<h2 className={\`text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-white leading-none \${customFont ? 'font-midnight-display' : ''}\`}>{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>`
);

// Override groom h3
midnight = midnight.replace(
  `<h3 className="text-5xl font-black uppercase text-white mb-4 tracking-tighter">{data.bride_data.groom}</h3>`,
  `<h3 className={\`text-5xl font-black uppercase text-white mb-4 tracking-tighter \${customFont ? 'font-midnight-display' : ''}\`}>{data.bride_data.groom}</h3>`
);

// Override bride h3
midnight = midnight.replace(
  `<h3 className="text-5xl font-black uppercase text-white mb-4 tracking-tighter">{data.bride_data.bride}</h3>`,
  `<h3 className={\`text-5xl font-black uppercase text-white mb-4 tracking-tighter \${customFont ? 'font-midnight-display' : ''}\`}>{data.bride_data.bride}</h3>`
);

fs.writeFileSync(path.join(themesDir, 'MidnightTheme.tsx'), midnight);
console.log('MidnightTheme done');

// ============================================================
// TerracottaTheme — no style block, uses font-serif from Tailwind
// ============================================================
let terracotta = fs.readFileSync(path.join(themesDir, 'TerracottaTheme.tsx'), 'utf8');

terracotta = terracotta.replace(
  `  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();

  return (
    <div className={\`bg-[#fff7ed] min-h-screen text-[#7c2d12] font-serif selection:bg-[#ea580c] selection:text-white \${previewMode ? 'relative' : ''}\`}>`,
  `  const eventDate = data.event_data.date ? new Date(data.event_data.date) : new Date();
  const customFont = getFontStyle(data.font_style);

  return (
    <div className={\`bg-[#fff7ed] min-h-screen text-[#7c2d12] font-serif selection:bg-[#ea580c] selection:text-white \${previewMode ? 'relative' : ''}\`}>
      {customFont && (
        <style>{\`
          @import url('\${customFont.googleUrl}');
          .font-terracotta-display { font-family: \${customFont.fontFamily}; }
        \`}</style>
      )}`
);

// Override cover h1
terracotta = terracotta.replace(
  `<FadeIn><h1 className="text-5xl font-bold italic mb-6 tracking-tight">{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>`,
  `<FadeIn><h1 className={\`text-5xl font-bold italic mb-6 tracking-tight \${customFont ? 'font-terracotta-display' : ''}\`}>{data.bride_data.groom} & {data.bride_data.bride}</h1></FadeIn>`
);

// Override hero h2
terracotta = terracotta.replace(
  `<h2 className="text-6xl md:text-9xl font-bold italic mb-12 text-[#7c2d12] tracking-tighter leading-none">{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>`,
  `<h2 className={\`text-6xl md:text-9xl font-bold italic mb-12 text-[#7c2d12] tracking-tighter leading-none \${customFont ? 'font-terracotta-display' : ''}\`}>{data.bride_data.groom} <br/> & <br/> {data.bride_data.bride}</h2>`
);

// Override groom h3
terracotta = terracotta.replace(
  `<h3 className="text-4xl font-bold italic text-[#7c2d12] mb-2">{data.bride_data.groom}</h3>`,
  `<h3 className={\`text-4xl font-bold italic text-[#7c2d12] mb-2 \${customFont ? 'font-terracotta-display' : ''}\`}>{data.bride_data.groom}</h3>`
);

// Override bride h3
terracotta = terracotta.replace(
  `<h3 className="text-4xl font-bold italic text-[#7c2d12] mb-2">{data.bride_data.bride}</h3>`,
  `<h3 className={\`text-4xl font-bold italic text-[#7c2d12] mb-2 \${customFont ? 'font-terracotta-display' : ''}\`}>{data.bride_data.bride}</h3>`
);

fs.writeFileSync(path.join(themesDir, 'TerracottaTheme.tsx'), terracotta);
console.log('TerracottaTheme done');

console.log('\nAll done!');
