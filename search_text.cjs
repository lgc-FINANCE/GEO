const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GliDeepDive.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('子指数') || line.includes('下钻') || line.includes('诊断') || line.includes('RAG') || line.includes('对账')) {
    if (line.includes('h1') || line.includes('h2') || line.includes('h3') || line.includes('h4') || line.includes('span') || line.includes('p') || line.includes('button')) {
      console.log(`Line ${idx+1}: ${line.trim()}`);
    }
  }
});
