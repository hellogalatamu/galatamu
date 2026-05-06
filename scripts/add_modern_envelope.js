const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../components/themes/ModernTheme.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add import if missing
if (!content.includes('import DigitalEnvelope')) {
  content = content.replace(/(import GalleryLightbox.*?;\r?\n)/, "$1import DigitalEnvelope from \"../DigitalEnvelope\";\n");
}

const targetStr = '{/* RSVP SECTION */}';
const replacementStr = `{/* GIFTS SECTION */}
          {data.gifts && data.gifts.length > 0 && (
             <section className="border-tech bg-tech p-10 text-center mb-6">
                <DigitalEnvelope
                  gifts={data.gifts}
                  gift_address={data.gift_address}
                  primaryColor="#00ff41"
                  bgColor="#050505"
                  textColor="#00ff41"
                  envelopeStyle="dark"
                  titleClassName="text-3xl font-bold mb-8 glitch-text font-mono-tech uppercase"
                  subtitleClassName="text-[10px] mb-4 opacity-50 tracking-widest font-mono-tech uppercase"
                />
             </section>
          )}

          {/* RSVP SECTION */}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, content);
  console.log('✅ Updated ModernTheme.tsx');
} else {
  console.log('⚠️ Could not find RSVP SECTION in ModernTheme.tsx');
}
