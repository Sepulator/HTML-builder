const { stdout } = require('process');
const { createReadStream } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const displayFile = (filePath) => {
  const stream = createReadStream(filePath);
  stream.on('data', (chunk) => stdout.write(chunk));
  stream.on('error', (err) => stdout.write('Error: ', err.message));
};

displayFile(filePath);
