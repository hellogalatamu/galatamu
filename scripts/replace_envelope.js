const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '../components/themes');

const themesConfig = [
  { file: 'AmaraTheme.tsx', primaryColor: '#1a1a1a', bgColor: '#faf9f6', textColor: '#1a1a1a', envelopeStyle: 'light' },
  { file: 'RoyalTheme.tsx', primaryColor: '#c8973e', bgColor: '#06060f', textColor: '#e8d5a3', envelopeStyle: 'dark' },
  { file: 'MidnightTheme.tsx', primaryColor: '#4338ca', bgColor: '#020617', textColor: '#ffffff', envelopeStyle: 'dark' },
  { file: 'TerracottaTheme.tsx', primaryColor: '#ea580c', bgColor: '#fff7ed', textColor: '#7c2d12', envelopeStyle: 'light' },
  { file: 'ModernTheme.tsx', primaryColor: '#ff6b6b', bgColor: '#0a0a0a', textColor: '#ffffff', envelopeStyle: 'dark' },
  { file: 'IslamicTheme.tsx', primaryColor: '#c8973e', bgColor: '#0d2b1a', textColor: '#fdfcf0', envelopeStyle: 'dark' },
  { file: 'RomanticRoseTheme.tsx', primaryColor: '#e11d48', bgColor: '#fff1f2', textColor: '#9f1239', envelopeStyle: 'light' },
  { file: 'VintageTheme.tsx', primaryColor: '#8b5e3c', bgColor: '#e5d3b3', textColor: '#5d4037', envelopeStyle: 'light' },
  { file: 'MinimalistWhiteTheme.tsx', primaryColor: '#111827', bgColor: '#ffffff', textColor: '#111827', envelopeStyle: 'light' }
];

for (const config of themesConfig) {
  const filePath = path.join(THEMES_DIR, config.file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('import DigitalEnvelope')) {
    content = content.replace(/(import VideoPlayer.*?;)/, "$1\nimport DigitalEnvelope from \"../DigitalEnvelope\";");
  }

  let regexPattern = null;
  
  if (config.file === 'AmaraTheme.tsx') {
      regexPattern = /<div className="space-y-6">[\s\S]*?\{data\.gifts\?\.map\(\(gift, i\) => \([\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/section>/;
  } else if (config.file === 'RoyalTheme.tsx') {
      regexPattern = /<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">[\s\S]*?\{data\.gifts\?\.map\(\(g, i\) => \([\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
  } else if (config.file === 'MidnightTheme.tsx') {
      regexPattern = /\{data\.gifts && data\.gifts\.length > 0 && \([\s\S]*?\{data\.gifts\.map\(\(gift, i\) => \([\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/section>/;
  } else if (config.file === 'TerracottaTheme.tsx') {
      regexPattern = /\{data\.gifts && data\.gifts\.length > 0 && \([\s\S]*?\{data\.gifts\.map\(\(gift, i\) => \([\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/section>/;
  } else if (config.file === 'RomanticRoseTheme.tsx') {
      regexPattern = /\{data\.gifts && data\.gifts\.length > 0 && \([\s\S]*?\{data\.gifts\.map\(\(gift, i\) => \([\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/section>/;
  } else if (config.file === 'ModernTheme.tsx') {
      regexPattern = /<div className="grid md:grid-cols-2 gap-8">[\s\S]*?\{data\.gifts\?\.map\(\(g, i\) => \([\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/section>/;
  } else if (config.file === 'IslamicTheme.tsx') {
      regexPattern = /\{data\.gifts && data\.gifts\.length > 0 && \([\s\S]*?\{data\.gifts\.map\(\(g, i\) => \([\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/section>/;
  } else if (config.file === 'VintageTheme.tsx') {
      regexPattern = /<div className="p-8 border border-\[\#8b5e3c\]\/20">[\s\S]*?\{data\.gifts\?\.map\(\(g, i\) => \([\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
  } else if (config.file === 'MinimalistWhiteTheme.tsx') {
      regexPattern = /<div className="max-w-2xl mx-auto space-y-4">[\s\S]*?\{data\.gifts\?\.map\(\(g, i\) => \([\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/section>/;
  }

  const replacementCode = "</div>\n" +
            "            <DigitalEnvelope\n" +
            "              gifts={data.gifts}\n" +
            "              gift_address={data.gift_address}\n" +
            "              primaryColor=\"" + config.primaryColor + "\"\n" +
            "              bgColor=\"" + config.bgColor + "\"\n" +
            "              textColor=\"" + config.textColor + "\"\n" +
            "              envelopeStyle=\"" + config.envelopeStyle + "\"\n" +
            "              titleClassName=\"hidden\"\n" +
            "              subtitleClassName=\"hidden\"\n" +
            "            />\n" +
            "          </section>";

  if (regexPattern && content.match(regexPattern)) {
      content = content.replace(regexPattern, replacementCode);
      fs.writeFileSync(filePath, content);
      console.log("Updated " + config.file);
  } else {
      console.log("Could not match pattern in " + config.file);
  }
}
