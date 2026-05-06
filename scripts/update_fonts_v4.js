const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

const attributesToIgnore = ['alt=', 'src=', 'href=', 'title=', 'value=', 'name=', 'content='];

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

  // 2. Add classes to elements safely
  // We use a regex that captures the preceding 10 characters to check if it's an attribute assignment
  const safeReplace = (target, replacementClass) => {
    const targetStr = typeof target === 'string' ? target : target.source;
    // We look for the exact string, e.g. {data.bride_data.groom}
    const escapedTarget = targetStr.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');
    
    // Group 1: Preceding character, Group 2: The target itself
    const regex = new RegExp("([=\\\\w\\\\\"\\\\']?\\\\s*)(" + escapedTarget + ")", 'g');
    
    content = content.replace(regex, (match, prefix, targetMatch) => {
      // If the prefix contains an '=' sign, it's an attribute like \`alt={...}\`
      // Or if we are already inside a span we just created, but we won't match that since we replace it with <span ...>
      if (prefix.includes('=')) {
        return match; // Do not replace
      }
      return prefix + '<span className="' + replacementClass + '">' + targetMatch + '</span>';
    });
  };

  safeReplace('{data.bride_data.groom}', 'font-bride');
  safeReplace('{data.bride_data.bride}', 'font-bride');
  safeReplace("{data.bride_data.groom.split(' ')[0]}", 'font-bride');
  safeReplace("{data.bride_data.bride.split(' ')[0]}", 'font-bride');
  
  safeReplace('{data.bride_data.parents_groom}', 'font-parents');
  safeReplace('{data.bride_data.parents_bride}', 'font-parents');

  safeReplace('{data.event_data.akad_time}', 'font-event');
  safeReplace('{data.event_data.resepsi_time}', 'font-event');
  safeReplace('{data.event_data.akad_location}', 'font-event');
  safeReplace('{data.event_data.resepsi_location}', 'font-event');
  
  safeReplace('{data.quote}', 'font-quote');

  fs.writeFileSync(path.join(themesDir, file), content);
  console.log(`Processed ${file}`);
});
