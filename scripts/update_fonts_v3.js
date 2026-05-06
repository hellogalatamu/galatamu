const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(themesDir, file), 'utf8');

  // 1. Inject the Font variables in the <style> block
  const styleLogic = `
        \${data.fonts?.bride_name || data.font_style ? \\\`@import url('\${getFontStyle(data.fonts?.bride_name || data.font_style)?.googleUrl}');\\\` : ''}
        \${data.fonts?.parents_name ? \\\`@import url('\${getFontStyle(data.fonts.parents_name)?.googleUrl}');\\\` : ''}
        \${data.fonts?.event_details ? \\\`@import url('\${getFontStyle(data.fonts.event_details)?.googleUrl}');\\\` : ''}
        \${data.fonts?.quote ? \\\`@import url('\${getFontStyle(data.fonts.quote)?.googleUrl}');\\\` : ''}
        .font-bride { font-family: \${data.fonts?.bride_name || data.font_style ? \\\`'\${getFontStyle(data.fonts?.bride_name || data.font_style)?.fontFamily}'\\\` : "inherit"} !important; }
        .font-parents { font-family: \${data.fonts?.parents_name ? \\\`'\${getFontStyle(data.fonts.parents_name)?.fontFamily}'\\\` : "inherit"} !important; }
        .font-event { font-family: \${data.fonts?.event_details ? \\\`'\${getFontStyle(data.fonts.event_details)?.fontFamily}'\\\` : "inherit"} !important; }
        .font-quote { font-family: \${data.fonts?.quote ? \\\`'\${getFontStyle(data.fonts.quote)?.fontFamily}'\\\` : "inherit"} !important; }
  `;

  if (content.includes("getFontStyle(data.font_style)")) {
    content = content.replace(/\`\}<\/style>/g, `${styleLogic}\`}</style>`);
  }

  // 2. Add classes to elements safely using negative lookbehind to ensure we don't replace inside JSX attributes
  // (?<![=\w]\s*|\w+\s*=\s*['"{]?\s*) matches NOT after an equals sign or attribute
  
  const safeReplace = (target, replacement) => {
    // Escape target for regex
    const escapedTarget = target.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');
    // Regex: Lookbehind to ensure we're not preceded by '=', '="', "='", or '=' + spaces
    const regex = new RegExp(\`(?<!=\\\\s*|="|=\\'|={|:)\${escapedTarget}\`, 'g');
    content = content.replace(regex, replacement);
  };

  safeReplace('{data.bride_data.groom}', '<span className="font-bride">{data.bride_data.groom}</span>');
  safeReplace('{data.bride_data.bride}', '<span className="font-bride">{data.bride_data.bride}</span>');
  safeReplace("{data.bride_data.groom.split(' ')[0]}", '<span className="font-bride">{data.bride_data.groom.split(\\' \\')[0]}</span>');
  safeReplace("{data.bride_data.bride.split(' ')[0]}", '<span className="font-bride">{data.bride_data.bride.split(\\' \\')[0]}</span>');
  
  safeReplace('{data.bride_data.parents_groom}', '<span className="font-parents">{data.bride_data.parents_groom}</span>');
  safeReplace('{data.bride_data.parents_bride}', '<span className="font-parents">{data.bride_data.parents_bride}</span>');

  safeReplace('{data.event_data.akad_time}', '<span className="font-event">{data.event_data.akad_time}</span>');
  safeReplace('{data.event_data.resepsi_time}', '<span className="font-event">{data.event_data.resepsi_time}</span>');
  safeReplace('{data.event_data.akad_location}', '<span className="font-event">{data.event_data.akad_location}</span>');
  safeReplace('{data.event_data.resepsi_location}', '<span className="font-event">{data.event_data.resepsi_location}</span>');
  
  safeReplace('{data.quote}', '<span className="font-quote">{data.quote}</span>');

  fs.writeFileSync(path.join(themesDir, file), content);
  console.log(`Processed ${file}`);
});
