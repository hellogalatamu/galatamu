const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(themesDir, file), 'utf8');

  // We injected escaped backticks like \` instead of actual backticks ` inside the style block.
  // We need to find \`@import and replace with `@import
  content = content.replace(/\\`@import/g, '`@import');
  content = content.replace(/\\`;/g, '`;');
  content = content.replace(/\\`'/g, "`'");
  content = content.replace(/'\\`/g, "'`");
  
  // Actually, let's just replace all \` with `
  // But wait, there might be legitimate \` elsewhere? No, \` is very rare.
  // Let's replace the specific block.
  // The block has \`@import url, \`' , and '\`
  
  // Let's just do a global replace of \` to `
  content = content.replace(/\\`/g, '`');

  fs.writeFileSync(path.join(themesDir, file), content);
  console.log(`Fixed backticks in ${file}`);
});
