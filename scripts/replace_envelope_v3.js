const fs = require('fs');
const path = require('path');

const themesConfig = [
  { file: 'MidnightTheme.tsx', primaryColor: '#4338ca', bgColor: '#020617', textColor: '#ffffff', envelopeStyle: 'dark', title: 'text-5xl font-black uppercase tracking-[0.6em] text-white', subtitle: 'hidden' },
  { file: 'TerracottaTheme.tsx', primaryColor: '#ea580c', bgColor: '#fff7ed', textColor: '#7c2d12', envelopeStyle: 'light', title: 'text-5xl font-bold italic text-[#7c2d12] tracking-widest uppercase', subtitle: 'hidden' },
  { file: 'RomanticRoseTheme.tsx', primaryColor: '#e11d48', bgColor: '#fff1f2', textColor: '#9f1239', envelopeStyle: 'light', title: 'text-5xl font-bold italic text-[#881337] tracking-widest uppercase', subtitle: 'hidden' },
  { file: 'ModernTheme.tsx', primaryColor: '#ff6b6b', bgColor: '#0a0a0a', textColor: '#ffffff', envelopeStyle: 'dark', title: 'text-4xl font-bold mb-12 tracking-widest uppercase', subtitle: 'text-[#ff6b6b] text-[10px] uppercase tracking-[0.4em] font-bold mb-4' },
  { file: 'VintageTheme.tsx', primaryColor: '#8b5e3c', bgColor: '#e5d3b3', textColor: '#5d4037', envelopeStyle: 'light', title: 'font-display text-xl font-bold uppercase', subtitle: 'hidden' },
  { file: 'MinimalistWhiteTheme.tsx', primaryColor: '#111827', bgColor: '#ffffff', textColor: '#111827', envelopeStyle: 'light', title: 'text-3xl tracking-[0.2em] uppercase font-light', subtitle: 'hidden' }
];

for (const config of themesConfig) {
  const filePath = path.join(__dirname, '../components/themes', config.file);
  if (!fs.existsSync(filePath)) continue;
  
  let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  // Add import if missing
  if (!lines.some(l => l.includes('import DigitalEnvelope'))) {
    const importIndex = lines.findIndex(l => l.includes('import VideoPlayer') || l.includes('import GalleryLightbox'));
    if (importIndex !== -1) {
      lines.splice(importIndex + 1, 0, 'import DigitalEnvelope from "../DigitalEnvelope";');
    }
  }

  // Find start and end of gift section based on {data.gifts?.map
  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('data.gifts.map') || lines[i].includes('data.gifts?.map')) {
      startIndex = i;
      break;
    }
  }

  if (startIndex !== -1) {
    // Traverse backwards to find the nearest container/section/div opening
    let blockStart = -1;
    for (let i = startIndex; i >= 0; i--) {
      if (config.file === 'MidnightTheme.tsx' || config.file === 'TerracottaTheme.tsx' || config.file === 'RomanticRoseTheme.tsx') {
         if (lines[i].includes('{data.gifts && data.gifts.length > 0 && (')) { blockStart = i; break; }
      } else if (config.file === 'ModernTheme.tsx') {
         if (lines[i].includes('{/* GIFTS */}')) { blockStart = i; break; }
      } else if (config.file === 'VintageTheme.tsx') {
         if (lines[i].includes('{/* Gift Registry */}')) { blockStart = i; break; }
      } else if (config.file === 'MinimalistWhiteTheme.tsx') {
         if (lines[i].includes('{/* Section 5: Gifts */}')) { blockStart = i; break; }
      }
    }

    // Traverse forward to find the end of the block
    let blockEnd = -1;
    for (let i = startIndex; i < lines.length; i++) {
       if (config.file === 'MidnightTheme.tsx' || config.file === 'TerracottaTheme.tsx' || config.file === 'RomanticRoseTheme.tsx') {
          if (lines[i].trim() === ')}' && lines[i-1] && lines[i-1].includes('</section>')) { blockEnd = i; break; }
       } else if (config.file === 'ModernTheme.tsx') {
          if (lines[i].includes('{/* RSVP SECTION */}')) { blockEnd = i - 1; break; }
       } else if (config.file === 'VintageTheme.tsx') {
          if (lines[i].includes('{/* RSVP Advertisement */}')) { blockEnd = i - 1; break; }
       } else if (config.file === 'MinimalistWhiteTheme.tsx') {
          if (lines[i].includes('{/* Section 6: RSVP */}')) { blockEnd = i - 1; break; }
       }
    }

    if (blockStart !== -1 && blockEnd !== -1) {
      const replacementCode = [
        '          <section className="py-32 px-6 text-center">',
        '            <DigitalEnvelope',
        '              gifts={data.gifts}',
        '              gift_address={data.gift_address}',
        '              primaryColor="' + config.primaryColor + '"',
        '              bgColor="' + config.bgColor + '"',
        '              textColor="' + config.textColor + '"',
        '              envelopeStyle="' + config.envelopeStyle + '"',
        '              titleClassName="' + config.title + '"',
        '              subtitleClassName="' + config.subtitle + '"',
        '            />',
        '          </section>'
      ];

      if (config.file === 'VintageTheme.tsx') {
        replacementCode.unshift('{/* Gift Registry */}');
      } else if (config.file === 'ModernTheme.tsx') {
        replacementCode.unshift('{/* GIFTS */}');
      } else if (config.file === 'MinimalistWhiteTheme.tsx') {
        replacementCode.unshift('{/* Section 5: Gifts */}');
      } else if (config.file === 'MidnightTheme.tsx' || config.file === 'TerracottaTheme.tsx' || config.file === 'RomanticRoseTheme.tsx') {
        replacementCode.unshift('{data.gifts && data.gifts.length > 0 && (');
        replacementCode.push('          )}');
      }

      lines.splice(blockStart, blockEnd - blockStart + 1, ...replacementCode);
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log('✅ Updated ' + config.file);
    } else {
      console.log('⚠️ Could not find boundaries for ' + config.file + ' start: ' + blockStart + ' end: ' + blockEnd);
    }
  } else {
    console.log('⚠️ Could not find data.gifts map in ' + config.file);
  }
}
