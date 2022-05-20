const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const charset = 'utf-8';

const readableStream = fs.createReadStream(filePath, charset);

let data = '';

readableStream.on('data', (chunk) => data += chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', (err) => console.log(`Error: ${err.message}`));