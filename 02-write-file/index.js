const { stdout, stdin } = require('process');
const { createWriteStream } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const writeFile = (filePath) => {
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

writeFile(filePath);
