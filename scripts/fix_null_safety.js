const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

const files = ['IslamicTheme.tsx', 'MinimalistWhiteTheme.tsx', 'ModernTheme.tsx', 'RoyalTheme.tsx', 'AmaraTheme.tsx', 'VintageTheme.tsx'];

files.forEach(file => {
  const filePath = path.join(themesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix: getFontStyle(data.font_style).googleUrl -> getFontStyle(data.font_style)!.googleUrl
  // But only in template literal contexts (inside ternary)
  content = content.replace(
    /getFontStyle\(data\.font_style\)\.googleUrl/g,
    'getFontStyle(data.font_style)!.googleUrl'
  );
  
  // Fix: getFontStyle(data.font_style).fontFamily -> getFontStyle(data.font_style)!.fontFamily  
  // But only where it's NOT already using ?. pattern
  content = content.replace(
    /getFontStyle\(data\.font_style\)\.fontFamily(?!\s*;)/g,
    'getFontStyle(data.font_style)!.fontFamily'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${file}`);
});

console.log('Done!');
