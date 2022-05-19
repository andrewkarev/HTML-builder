const fs = require('fs/promises');
const path = require('path');

const folderCopyName = 'files-copy';
const originalFolderName = 'files';
const folderCopyPath = path.join(__dirname, folderCopyName);
const originalFolderPath = path.join(__dirname, originalFolderName);

(async function copyDir() {
  try {
    await fs.mkdir(folderCopyPath, { recursive: true });
    const files = await fs.readdir(originalFolderPath);
    for (let file of files) {
      const source = path.join(originalFolderPath, file);
      const destination = path.join(folderCopyPath, file);
      await fs.copyFile(source, destination);
    }
    console.log('Folder has been copied.');
  } catch (err) {
    console.error(err);
  }
})();
