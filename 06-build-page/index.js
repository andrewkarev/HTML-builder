const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const projectFolderName = 'project-dist';
const projectFolderPath = path.join(__dirname, projectFolderName);

const charset = 'utf-8';

const stylesFolderName = 'styles';
const outputStylesFileName = 'style.css';
const sourceStylesFolderPath = path.join(__dirname, stylesFolderName);
const outputStylesFilePath = path.join(projectFolderPath, outputStylesFileName);

const assetsFolderName = 'assets';
const assetsFolderPath = path.join(__dirname, assetsFolderName);
const assetsFolderCopyPath = path.join(projectFolderPath, assetsFolderName);

async function bundleStyles() {
  const writableStream = fs.createWriteStream(outputStylesFilePath);
  const files = await fsPromises.readdir(sourceStylesFolderPath, { withFileTypes: true });
  for (const file of files) {
    const sourceFilePath = path.join(sourceStylesFolderPath, file.name);
    const sourceFileExtension = path.extname(sourceFilePath);
    if (file.isFile() && sourceFileExtension === '.css') {
      const readableStream = fs.createReadStream(sourceFilePath, charset);
      readableStream.pipe(writableStream);
    }
  }
}

async function copyAssetsFolder(originalFilePath, copyFilePath) {
  await fsPromises.rm(copyFilePath, { recursive: true, force: true });
  await fsPromises.mkdir(copyFilePath, { recursive: true });
  const files = await fsPromises.readdir(originalFilePath, { withFileTypes: true });
  for (let file of files) {
    const source = path.join(originalFilePath, file.name);
    const destination = path.join(copyFilePath, file.name);
    if (file.isFile()) {
      await fsPromises.copyFile(source, destination);
    } else {
      await copyAssetsFolder(source, destination);
    }
  }
}

(async () => {
  try {
    await fsPromises.rm(projectFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(projectFolderPath, { recursive: true });
    await bundleStyles();
    await copyAssetsFolder(assetsFolderPath, assetsFolderCopyPath);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
