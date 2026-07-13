const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GesiDeepDive.tsx');
if (!fs.existsSync(filePath)) {
  console.log("GesiDeepDive.tsx does not exist!");
  process.exit(0);
}
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

lines.forEach((line, index) => {
  if (line.includes('writeText') || line.includes('clipboard')) {
    console.log(`\nOccurrence in GESI at Line ${index + 1}:`);
    for (let i = index - 2; i <= index + 10 && i < lines.length; i++) {
      console.log(`  Line ${i + 1}: ${lines[i]}`);
    }
  }
});
