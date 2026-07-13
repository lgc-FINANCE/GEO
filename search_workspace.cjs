const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchDir(fullPath);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('localToast')) {
          console.log(`Found in: ${fullPath}`);
          const lines = content.split('\n');
          lines.forEach((l, idx) => {
            if (l.includes('localToast')) {
              console.log(`  Line ${idx+1}: ${l.trim()}`);
            }
          });
        }
      }
    }
  });
}

searchDir(path.join(__dirname, 'src'));
