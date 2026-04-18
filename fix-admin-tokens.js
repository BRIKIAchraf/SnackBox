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

const adminPath = path.join(__dirname, 'apps', 'admin');
const allFiles = walkSync(adminPath);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let modified = false;

  // 1. Fix Token inconsistency
  if (content.includes('localStorage.getItem("token")')) {
    content = content.split('localStorage.getItem("token")').join('localStorage.getItem("admin_token")');
    modified = true;
  }
  if (content.includes('localStorage.removeItem("token")')) {
    content = content.split('localStorage.removeItem("token")').join('localStorage.removeItem("admin_token")');
    modified = true;
  }

  // 2. Fix missing HTTPS protocol (just in case my previous script missed something)
  const targetUrl = 'api-production-48c5.up.railway.app';
  if (content.includes(targetUrl) && !content.includes('https://' + targetUrl)) {
      content = content.split(targetUrl).join('https://' + targetUrl);
      // Clean double https
      content = content.split('https://https://').join('https://');
      modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Fixed:', file);
  }
});

console.log('Admin Token & Protocol sync complete.');
