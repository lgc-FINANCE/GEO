import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'components', 'GesiDeepDive.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// A simple regex-based parser to trace JSX tags
const lines = content.split('\n');
const stack = [];

// Match self-closing tag or opening/closing tag
// Let's do a simple line-by-line tracer for tags like <div, </div, <button, </button, <span, </span
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // We only trace lines within the return block (from line 326 onwards)
  if (i < 325) continue;
  
  // Let's find tags in this line
  // A simple regex for tags: <(\/?[a-zA-Z0-9]+)([^>]*?)>
  const tagRegex = /<(\/?[a-zA-Z0-9]+)([^>]*?)>/g;
  let match;
  
  while ((match = tagRegex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const attrs = match[2];
    
    // Check if self-closing
    const isSelfClosing = attrs.trim().endsWith('/') || 
                          ['img', 'input', 'br', 'hr', 'line', 'circle', 'path', 'rect', 'defs', 'linearGradient', 'stop', 'area', 'col'].includes(tagName);
    
    if (isSelfClosing) {
      // Self-closing, ignore
      continue;
    }
    
    if (tagName.startsWith('/')) {
      const closingName = tagName.slice(1);
      if (stack.length === 0) {
        console.log(`Line ${i + 1}: Unexpected closing tag </${closingName}> without open tag. Stack is empty.`);
      } else {
        const lastOpen = stack.pop();
        if (lastOpen.name !== closingName) {
          console.log(`Line ${i + 1}: Mismatched tag. Closed </${closingName}> but expected </${lastOpen.name}> (opened on line ${lastOpen.line})`);
          // Put it back to see what else
          stack.push(lastOpen);
        }
      }
    } else {
      // Opening tag
      stack.push({ name: tagName, line: i + 1 });
    }
  }
}

console.log('Final Stack size:', stack.length);
if (stack.length > 0) {
  console.log('Remaining open tags:');
  stack.forEach(t => console.log(`  <${t.name}> opened on line ${t.line}`));
}
