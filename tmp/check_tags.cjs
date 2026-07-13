const fs = require('fs');
const content = fs.readFileSync('/src/components/GliDeepDive.tsx', 'utf8');

// We can scan the render function of GliDeepDive.
// Let's find the start of 'return (' in the main function.
// The main return starts around line 1941. Let's isolate the main return.
const lines = content.split('\n');
const returnLineIndex = lines.findIndex(l => l.includes('return (') && l.includes('space-y-6'));
console.log('Return starts at line:', returnLineIndex + 1);

let openTags = 0;
for (let i = returnLineIndex; i < lines.length; i++) {
  const line = lines[i];
  
  // Find all <div or <button or <h4 etc. and all </div or </button or </h4
  // Let's count standard tags.
  // A simplified approach: count occurrences of `<div` vs `</div>`
  const opens = (line.match(/<div(?:\s|>|$)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  openTags += opens - closes;
  
  if (i >= 2250 && i <= 2280) {
    console.log(`Line ${i + 1}: ${line.trim()} | opens: ${opens}, closes: ${closes}, net open divs: ${openTags}`);
  }
}
