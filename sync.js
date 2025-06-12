const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const fileUrl = 'https://raw.githubusercontent.com/warp-energy-project/EchoNet-Drako/main/engine.js';
const filePath = path.join(__dirname, 'engine.js');

function downloadFile(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      cb(new Error(`Failed to get '${url}' (${res.statusCode})`));
      return;
    }
    res.pipe(file);
  });

  file.on('finish', () => {
    file.close(cb);
  });

  file.on('error', (err) => {
    fs.unlink(dest, () => cb(err));
  });
}

function gitCommitAndPush() {
  exec('git add . && git commit -m "Auto-update from sync.js" && git push origin main', { env: { ...process.env, GITHUB_TOKEN: process.env.NAVITOKEN } }, (err, stdout, stderr) => {
    if (err) {
      console.error('Git push error:', err);
      return;
    }
    console.log('Git push output:', stdout);
  });
}

downloadFile(fileUrl, filePath, (err) => {
  if (err) {
    console.error('Download error:', err);
    return;
  }
  console.log('File downloaded successfully.');

  // Możesz dodać commit i push, jeśli masz zmiany lokalne:
  gitCommitAndPush();
});
