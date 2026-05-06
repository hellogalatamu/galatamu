const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'components', 'themes');

const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  const filePath = path.join(themesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A generic replacement that targets the paragraph containing wish.message
  // We use regex to find `<p className="...">"{wish.message}"</p>` or similar
  
  const regex = /(<p[^>]*>.*?wish\.message.*?<\/p>)/g;
  
  if (content.match(regex)) {
    // Check if it already has wish.reply to prevent duplicates
    if (!content.includes('wish.reply')) {
      content = content.replace(regex, `$1\n                        {wish.reply && (\n                          <div className="mt-4 p-4 bg-white/5 border border-current/10 rounded-xl relative">\n                            <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-30 rounded-l-xl"></div>\n                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Balasan Mempelai</p>\n                            <p className="text-sm opacity-90">{wish.reply}</p>\n                          </div>\n                        )}`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Skipped ${file} - already has wish.reply`);
    }
  } else {
    console.log(`Could not find wish.message in ${file}`);
  }
});

console.log('Done!');
