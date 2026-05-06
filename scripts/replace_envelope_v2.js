const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '../components/themes');

const themesConfig = [
  { file: 'RoyalTheme.tsx', primaryColor: '#c8973e', bgColor: '#06060f', textColor: '#e8d5a3', envelopeStyle: 'dark', startMarker: '{/* GIFTS */}', endMarker: '{/* RSVP */}' },
  { file: 'MidnightTheme.tsx', primaryColor: '#4338ca', bgColor: '#020617', textColor: '#ffffff', envelopeStyle: 'dark', startMarker: '{/* Section 6: Gift', endMarker: '{/* Section 7: RSVP' },
  { file: 'TerracottaTheme.tsx', primaryColor: '#ea580c', bgColor: '#fff7ed', textColor: '#7c2d12', envelopeStyle: 'light', startMarker: '{/* Section 6: Gift', endMarker: '{/* Section 7: RSVP' },
  { file: 'ModernTheme.tsx', primaryColor: '#ff6b6b', bgColor: '#0a0a0a', textColor: '#ffffff', envelopeStyle: 'dark', startMarker: '{/* GIFTS */}', endMarker: '{/* RSVP */}' },
  { file: 'RomanticRoseTheme.tsx', primaryColor: '#e11d48', bgColor: '#fff1f2', textColor: '#9f1239', envelopeStyle: 'light', startMarker: '{/* Section 6: Gift', endMarker: '{/* Section 7: RSVP' },
  { file: 'VintageTheme.tsx', primaryColor: '#8b5e3c', bgColor: '#e5d3b3', textColor: '#5d4037', envelopeStyle: 'light', startMarker: '{/* Section 6: Gifts', endMarker: '{/* Section 7: RSVP' },
  { file: 'MinimalistWhiteTheme.tsx', primaryColor: '#111827', bgColor: '#ffffff', textColor: '#111827', envelopeStyle: 'light', startMarker: '{/* Section 5: Gifts', endMarker: '{/* Section 6: Wishes' }
];

for (const config of themesConfig) {
  const filePath = path.join(THEMES_DIR, config.file);
  if (!fs.existsSync(filePath)) continue;
  
  let lines = fs.readFileSync(filePath, 'utf8').split('\n');

  // Add import if missing
  if (!lines.some(l => l.includes('import DigitalEnvelope'))) {
    const importIndex = lines.findIndex(l => l.includes('import VideoPlayer') || l.includes('import GalleryLightbox'));
    if (importIndex !== -1) {
      lines.splice(importIndex + 1, 0, 'import DigitalEnvelope from "../DigitalEnvelope";');
    }
  }

  // Find start and end markers
  const startIndex = lines.findIndex(l => l.includes(config.startMarker));
  const endIndex = lines.findIndex(l => l.includes(config.endMarker));

  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    const replacementCode = [
      '          <section className="py-32 px-8 md:px-20 bg-transparent text-center">',
      '            <DigitalEnvelope',
      '              gifts={data.gifts}',
      '              gift_address={data.gift_address}',
      '              primaryColor="' + config.primaryColor + '"',
      '              bgColor="' + config.bgColor + '"',
      '              textColor="' + config.textColor + '"',
      '              envelopeStyle="' + config.envelopeStyle + '"',
      '            />',
      '          </section>',
      ''
    ];

    // Remove the old block and insert the new one
    // Keep the startMarker line, remove everything between it and endMarker
    lines.splice(startIndex + 1, endIndex - startIndex - 1, ...replacementCode);
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('✅ Updated ' + config.file);
  } else {
    console.log('⚠️ Could not match markers in ' + config.file + ' (Start: ' + startIndex + ', End: ' + endIndex + ')');
  }
}
