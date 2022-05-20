const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const sourceFolderName = 'styles';
const outputFolderName = 'project-dist';
const outputFileName = 'bundle.css';
const sourceFolderPath = path.join(__dirname, sourceFolderName);
const outputFilePath = path.join(__dirname, outputFolderName, outputFileName);

(async () => {
  try {
    const charset = 'utf-8';
    const writableStream = fs.createWriteStream(outputFilePath);
    const files = await readdir(sourceFolderPath, { withFileTypes: true });
    for (const file of files) {
      const sourceFilePath = path.join(sourceFolderPath, file.name);
      const sourceFileExtension = path.extname(sourceFilePath);
      if (file.isFile() && sourceFileExtension === '.css') {
        const readableStream = fs.createReadStream(sourceFilePath, charset);
        readableStream.pipe(writableStream);
      }
    }
    console.log('Bundling is finished!');
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
