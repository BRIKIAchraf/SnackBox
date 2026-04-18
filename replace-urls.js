const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Use the synchronous or custom walker if glob fails, but we'll try a simple recursive function
function walkSync(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    }
    else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
}

const allFiles = walkSync(path.join(__dirname, 'apps'));

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('http://localhost:3002')) {
    const newContent = content.replace(/http:\/\/localhost:3002/g, 'https://api-production-48c5.up.railway.app');
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log('Updated', file);
  }
});

console.log('Update complete.');
