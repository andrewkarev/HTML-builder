const fs = require('fs/promises');
const path = require('path');

const folderName = 'secret-folder';
const folderPath = path.join(__dirname, folderName);

(async () => {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const fileName = path.basename(file.name);
        const fileSize = await (await fs.stat(path.join(folderPath, fileName))).size;
        const output = fileName.split('.').join(' - ');

        console.log(`${output} - ${fileSize / 1024}kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
