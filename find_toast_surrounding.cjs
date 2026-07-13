const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GliDeepDive.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('localToast')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
    // print surrounding lines
    for (let i = Math.max(0, idx - 5); i <= Math.min(lines.length - 1, idx + 5); i++) {
      console.log(`  ${i+1}: ${lines[i]}`);
    }
  }
});
