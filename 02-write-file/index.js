const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const writableStream = fs.createWriteStream(filePath);
const rl = readline.createInterface({ input, output });

console.log('Hello! Waiting for input...\n');

rl.on('close', () => {
  console.log(`\nBye! The entered data is saved in a "${fileName}" file.`);
});

rl.on('line' || 'SIGINT', (input) => {
  if (input.toString() !== 'exit') {
    writableStream.write(`${input}\n`);
  } else {
    return rl.close();
  }
});

rl.on('error', (err) => console.log(`Error: ${err.message}`));