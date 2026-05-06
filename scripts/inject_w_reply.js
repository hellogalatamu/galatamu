const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  const filePath = path.join(themesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /(<p[^>]*>.*?w\.message.*?<\/p>)/g;
  
  if (content.match(regex)) {
    if (!content.includes('w.reply')) {
      content = content.replace(regex, `$1\n                        {w.reply && (\n                          <div className="mt-3 p-3 bg-white/5 border border-current/10 rounded-xl relative">\n                            <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-30 rounded-l-xl"></div>\n                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Balasan Mempelai</p>\n                            <p className="text-sm opacity-90">{w.reply}</p>\n                          </div>\n                        )}`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Skipped ${file} - already has w.reply`);
    }
  } else {
    console.log(`Could not find w.message in ${file}`);
  }
});

console.log('Done!');
