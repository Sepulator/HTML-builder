const { stdout, stdin } = require('process');
const { createWriteStream } = require('fs');
const path = require('path');

const fileName = 'text.txt';

const writeFile = (name) => {
  const filePath = path.join(__dirname, name);
  const stream = createWriteStream(filePath);
  stdout.write('Hello Anonymous!\n');
  stdin.on('data', (data) => {
    const str = data.toString();
    if (str.toLowerCase().trim() === 'exit') process.exit();
    stream.write(str);
  });
  process.on('SIGINT', () => process.exit());
  process.on('exit', () => stdout.write('\nGoodbye Anonymous!'));
};

writeFile(fileName);
