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

const componentsFolderName = 'components';
const htmlFileName = 'template.html';
const htmlFilecopyName = 'index.html';
const componentsFolderPath = path.join(__dirname, componentsFolderName);
const htmlFilePath = path.join(__dirname, htmlFileName);
const htmlFileCopyPath = path.join(projectFolderPath, htmlFilecopyName);

async function bundleStyles() {
  const writableStream = fs.createWriteStream(outputStylesFilePath);
  const files = await fsPromises.readdir(sourceStylesFolderPath, { withFileTypes: true });
  for (const file of files) {
    const sourceFilePath = path.join(sourceStylesFolderPath, file.name);
    const sourceFileExtension = path.extname(sourceFilePath);
    if (file.isFile() && sourceFileExtension === '.css') {
      let styleFileContent = await fsPromises.readFile(sourceFilePath, charset);
      styleFileContent = `${styleFileContent.trim()}\n\n`;
      writableStream.write(styleFileContent);
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

async function completeHtml() {
  await fsPromises.copyFile(htmlFilePath, htmlFileCopyPath);
  let htmlFileContent = await fsPromises.readFile(htmlFileCopyPath, charset);
  const writableStream = fs.createWriteStream(htmlFileCopyPath);
  const files = await fsPromises.readdir(componentsFolderPath, { withFileTypes: true });
  for (const file of files) {
    const sourceFilePath = path.join(componentsFolderPath, file.name);
    const sourceFileExtension = path.extname(sourceFilePath);
    if (file.isFile() && sourceFileExtension === '.html') {
      const sourceFileName = path.parse(sourceFilePath).name;
      const htmlFileComponentContent = await fsPromises.readFile(sourceFilePath, charset);
      const substitude = `{{${sourceFileName}}}`;
      htmlFileContent = htmlFileContent.replace(substitude, htmlFileComponentContent);
    }
  }
  writableStream.write(htmlFileContent);
}

(async () => {
  try {
    await fsPromises.rm(projectFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(projectFolderPath, { recursive: true });
    await bundleStyles();
    await copyAssetsFolder(assetsFolderPath, assetsFolderCopyPath);
    await completeHtml();
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
