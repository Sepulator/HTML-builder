const { stdout } = require('process');
const { createReadStream } = require('fs');
const path = require('path');

const fileName = 'text.txt';

const displayFile = (name) => {
  const filePath = path.join(__dirname, name);
  const stream = createReadStream(filePath);
  stream.on('data', (chunk) => stdout.write(chunk));
  stream.on('error', (err) => stdout.write('Error: ', err.message));
};

displayFile(fileName);
