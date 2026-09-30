const fs = require('fs');
const path = require('path');

try {
  const dir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const id = 'dev_' + Date.now();
  fs.writeFileSync(path.join(dir, '.dev-boot-id'), id, 'utf-8');
} catch (e) {
  // Silently ignore
}
