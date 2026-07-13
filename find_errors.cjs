const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GliDeepDive.tsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

console.log("Searching for replacement characters () or invalid characters...");
lines.forEach((line, index) => {
  if (line.includes('')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
