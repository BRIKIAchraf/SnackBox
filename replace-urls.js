const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        filelist = walkSync(fullPath, filelist);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        filelist.push(fullPath);
      }
    }
  });
  return filelist;
}

const targetUrl = 'api-production-48c5.up.railway.app';
const secureUrl = 'https://api-production-48c5.up.railway.app';

const allFiles = walkSync(path.join(__dirname, 'apps'));

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  // Replace instances of targetUrl that ARE NOT already preceded by "https://"
  // We use a simple strategy: replace all with secureUrl, then fix double https if any
  if (content.includes(targetUrl)) {
    let newContent = content.split(secureUrl).join(targetUrl); // normalize to no-https
    newContent = newContent.split('http://' + targetUrl).join(targetUrl); 
    newContent = newContent.split(targetUrl).join(secureUrl); // set all to https
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log('Fixed HTTPS in:', file);
    }
  }
});

console.log('Global HTTPS Enforcement complete.');
