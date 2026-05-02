
import fs from 'fs';

const content = fs.readFileSync('d:/galatamu/app/editor/page.tsx', 'utf8');
const lines = content.split('\n');

let level = 0;
lines.forEach((line, i) => {
    const open = (line.match(/<div(\s|>)/g) || []).length;
    const selfClosing = (line.match(/<div[^>]*\/>/g) || []).length;
    const close = (line.match(/<\/div>/g) || []).length;

    const delta = open - selfClosing - close;
    level += delta;
    if (delta !== 0) {
        console.log(`L${i+1}: level=${level} (delta=${delta}) | ${line.trim()}`);
    }
});
