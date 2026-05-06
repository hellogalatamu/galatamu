const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('Theme.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(themesDir, file), 'utf8');

  // 1. Inject the Font variables in the <style> block
  // Find where getFontStyle(data.font_style) is used and replace the whole style injection logic
  
  const styleLogic = `
        \${data.fonts?.bride_name || data.font_style ? \\\`@import url('\${getFontStyle(data.fonts?.bride_name || data.font_style)!.googleUrl}');\\\` : ''}
        \${data.fonts?.parents_name ? \\\`@import url('\${getFontStyle(data.fonts.parents_name)!.googleUrl}');\\\` : ''}
        \${data.fonts?.event_details ? \\\`@import url('\${getFontStyle(data.fonts.event_details)!.googleUrl}');\\\` : ''}
        \${data.fonts?.quote ? \\\`@import url('\${getFontStyle(data.fonts.quote)!.googleUrl}');\\\` : ''}
        .font-bride { font-family: \${data.fonts?.bride_name || data.font_style ? \\\`'\${getFontStyle(data.fonts?.bride_name || data.font_style)!.fontFamily}'\\\` : "inherit"} !important; }
        .font-parents { font-family: \${data.fonts?.parents_name ? \\\`'\${getFontStyle(data.fonts.parents_name)!.fontFamily}'\\\` : "inherit"} !important; }
        .font-event { font-family: \${data.fonts?.event_details ? \\\`'\${getFontStyle(data.fonts.event_details)!.fontFamily}'\\\` : "inherit"} !important; }
        .font-quote { font-family: \${data.fonts?.quote ? \\\`'\${getFontStyle(data.fonts.quote)!.fontFamily}'\\\` : "inherit"} !important; }
  `;

  // We need to replace the old font logic. Let's find `getFontStyle(data.font_style)`
  if (content.includes("getFontStyle(data.font_style)")) {
    // Replace the old style injections but keep base fonts
    // It's tricky to replace just the dynamic part. Let's just append our new classes right before `</style>`
    // and we will replace the old `.font-... { font-family: getFontStyle... }` with empty string or keep it
    
    // Instead of messing with existing classes, let's just ADD our classes
    content = content.replace("</style>", `\n${styleLogic}\n      \`}</style>`);
    // Wait, the existing might be `</style>` or `\`}</style>`. 
    // Usually it's \`}</style>
    
    content = content.replace(/\`\}<\/style>/g, `${styleLogic}\`}</style>`);
  }

  // 2. Add classes to elements
  // We can just add {\`font-bride \${existing_classes}\`} or just append " font-bride" if it's a string.
  // A simple way is to replace `{data.bride_data.groom}` with `<span className="font-bride">{data.bride_data.groom}</span>`
  // But they might already be styled in a parent. It's safer to wrap them in a span.
  
  // Wrap groom and bride names
  content = content.replace(/{data\.bride_data\.groom}/g, '<span className="font-bride">{data.bride_data.groom}</span>');
  content = content.replace(/{data\.bride_data\.bride}/g, '<span className="font-bride">{data.bride_data.bride}</span>');
  content = content.replace(/{data\.bride_data\.groom\.split\(' '\)\[0\]}/g, '<span className="font-bride">{data.bride_data.groom.split(\' \')[0]}</span>');
  content = content.replace(/{data\.bride_data\.bride\.split\(' '\)\[0\]}/g, '<span className="font-bride">{data.bride_data.bride.split(\' \')[0]}</span>');
  
  // Wrap parents
  content = content.replace(/{data\.bride_data\.parents_groom}/g, '<span className="font-parents">{data.bride_data.parents_groom}</span>');
  content = content.replace(/{data\.bride_data\.parents_bride}/g, '<span className="font-parents">{data.bride_data.parents_bride}</span>');

  // Wrap event details (date, time, location)
  // These are often passed to Countdown or rendered directly. We'll wrap the direct renders.
  content = content.replace(/{data\.event_data\.akad_time}/g, '<span className="font-event">{data.event_data.akad_time}</span>');
  content = content.replace(/{data\.event_data\.resepsi_time}/g, '<span className="font-event">{data.event_data.resepsi_time}</span>');
  content = content.replace(/{data\.event_data\.akad_location}/g, '<span className="font-event">{data.event_data.akad_location}</span>');
  content = content.replace(/{data\.event_data\.resepsi_location}/g, '<span className="font-event">{data.event_data.resepsi_location}</span>');
  // Date might be parsed, so it's harder to wrap the formatted date via regex because it's usually `eventDate.toLocaleDateString(...)`
  
  // Wrap quote
  content = content.replace(/{data\.quote}/g, '<span className="font-quote">{data.quote}</span>');

  // Fix nested spans in case we replaced something already wrapped
  // Actually, React doesn't mind nested spans. But it could break if `{data.bride_data.groom}` is inside an attribute like `alt={data.bride_data.groom}`
  // Let's use a regex that only matches when it's outside of quotes.
  
  fs.writeFileSync(path.join(themesDir, file), content);
  console.log(`Processed ${file}`);
});
