import fs from 'fs';

const content = fs.readFileSync('d:/galatamu/app/editor/page.tsx', 'utf8');
const lines = content.split('\n');

let braceLevel = 0;
let parenLevel = 0;
let bracketLevel = 0;
let inString = false;
let stringChar = '';

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (inString) {
            if (char === stringChar && line[charIdx-1] !== '\\') {
                inString = false;
            }
            continue;
        }
        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
            continue;
        }
        if (char === '{') braceLevel++;
        if (char === '}') braceLevel--;
        if (char === '(') parenLevel++;
        if (char === ')') parenLevel--;
        if (char === '[') bracketLevel++;
        if (char === ']') bracketLevel--;

        if (braceLevel < 0 || parenLevel < 0 || bracketLevel < 0) {
            console.log(`Unbalanced at L${lineIdx+1}:${charIdx+1}: char='${char}', brace=${braceLevel}, paren=${parenLevel}, bracket=${bracketLevel}`);
            process.exit(1);
        }
    }
}

console.log(`Final levels: brace=${braceLevel}, paren=${parenLevel}, bracket=${bracketLevel}`);
if (braceLevel !== 0 || parenLevel !== 0 || bracketLevel !== 0) {
    console.log('UNBALANCED!');
} else {
    console.log('BALANCED!');
}
