const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GliDeepDive.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('waterfallItems')) {
    console.log(`Line ${i + 1}: ${line}`);
  }
}

// Let's find any array declared with 'vli', 'rli', 'ili' etc. in a list
console.log('--- Scanning for key keywords ---');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('key: \'vli\'') || line.includes('key: "vli"')) {
    console.log(`vli at line ${i + 1}: ${line}`);
  }
}
