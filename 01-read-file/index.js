const { stdout } = require('process');
const { createReadStream } = require('fs');
const path = require('path');

const fileName = 'text.txt';

const displayFile = (name) => {
  const filePath = path.join(__dirname, name);
  const readableStream = createReadStream(filePath);
  readableStream.on('data', (chunk) => stdout.write(chunk));
  readableStream.on('error', (err) => stdout.write('Error: ', err.message));
};

displayFile(fileName);
