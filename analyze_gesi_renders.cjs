const fs = require('fs');

const content = fs.readFileSync('src/components/GesiDeepDive.tsx', 'utf8');
const lines = content.split('\n');

const occurrences = [];
lines.forEach((line, idx) => {
  if (line.includes('const render') || line.includes('function render')) {
    occurrences.push({ lineNum: idx + 1, text: line.trim() });
  }
});

console.log('Render functions:');
occurrences.forEach(o => console.log(`Line ${o.lineNum}: ${o.text}`));
