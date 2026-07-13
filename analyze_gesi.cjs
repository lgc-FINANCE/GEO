const fs = require('fs');

const content = fs.readFileSync('src/components/GesiDeepDive.tsx', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

const occurrences = [];
lines.forEach((line, idx) => {
  if (line.includes('export function') || line.includes('renderVliPage') || line.includes('renderGviPage') || line.includes('renderGriPage') || line.includes('renderGiiPage') || line.includes('renderGciPage') || line.includes('renderGaiPage') || line.includes('renderGdiPage') || line.includes('renderGssPage') || line.includes('Part 1 :') || line.includes('Part 1 ·') || line.includes('Part 2 :') || line.includes('Part 2 ·') || line.includes('Part 1: ') || line.includes('Part 2: ')) {
    occurrences.push({ lineNum: idx + 1, text: line.trim() });
  }
});

console.log('Key occurrences:');
occurrences.forEach(o => console.log(`Line ${o.lineNum}: ${o.text}`));
