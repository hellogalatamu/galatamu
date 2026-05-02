
import fs from 'fs';

const content = fs.readFileSync('d:/galatamu/app/editor/page.tsx', 'utf8');

let braces = 0;
let parens = 0;
let brackets = 0;
let inString = null;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];

    if (inString) {
        if (char === inString) {
            if (content[i-1] !== '\\') {
                inString = null;
            }
        }
        continue;
    }

    if (char === '"' || char === "'" || char === '`') {
        inString = char;
        continue;
    }

    // Skip comments
    if (char === '/' && nextChar === '/') {
        while (i < content.length && content[i] !== '\n') i++;
        continue;
    }
    if (char === '/' && nextChar === '*') {
        i += 2;
        while (i < content.length && !(content[i] === '*' && content[i+1] === '/')) i++;
        i++;
        continue;
    }

    if (char === '{') braces++;
    if (char === '}') braces--;
    if (char === '(') parens++;
    if (char === ')') parens--;
    if (char === '[') brackets++;
    if (char === ']') brackets--;

    if (braces < 0 || parens < 0 || brackets < 0) {
        console.log(`Unmatched closing character at index ${i} (line ${content.substring(0, i).split('\n').length}): ${char}`);
    }
}

console.log(`Final counts - Braces: ${braces}, Parens: ${parens}, Brackets: ${brackets}`);
