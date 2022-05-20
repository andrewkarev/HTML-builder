const fs = require('fs/promises');
const path = require('path');

const folderName = 'secret-folder';
const folderPath = path.join(__dirname, folderName);

(async () => {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileName = path.parse(filePath).name;
        const fileExtension = path.extname(filePath).slice(1);
        const fileSize = (await fs.stat(filePath)).size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize / 1024}kb`);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
