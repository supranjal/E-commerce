const fs = require('fs');
const path = require('path');

try {
  const cacheDir = path.join(process.cwd(), '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
} catch (error) {
  // If files are locked by another process, proceed gracefully
}
