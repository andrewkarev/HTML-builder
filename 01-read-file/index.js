const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const charset = 'utf8';

let readableStream = new fs.createReadStream(filePath, charset);

readableStream.on('data', function (chunk) {
  console.log(chunk);
});

readableStream.on('error', function (err) {
  console.log(err);
});