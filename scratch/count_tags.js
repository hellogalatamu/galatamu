
import fs from 'fs';

const content = fs.readFileSync('d:/galatamu/app/editor/page.tsx', 'utf8');

const tags = ['div', 'section', 'button', 'h1', 'h2', 'h3', 'p', 'label', 'input', 'textarea', 'PhotoUpload', 'ThemeRegistry', 'Sparkles', 'Check', 'Eye'];

tags.forEach(tag => {
    const openCount = (content.match(new RegExp(`<${tag}(\\s|>)`, 'g')) || []).length;
    const closeCount = (content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    const selfClosingCount = (content.match(new RegExp(`<${tag}[^>]*/>`, 'g')) || []).length;

    if (openCount !== (closeCount + selfClosingCount)) {
        console.log(`Tag mismatch for <${tag}>: open=${openCount}, close=${closeCount}, selfClosing=${selfClosingCount}`);
    }
});
