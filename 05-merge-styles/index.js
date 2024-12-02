const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'styles');
const outPath = path.join(__dirname, 'project-dist', 'bundle.css');
const options = { withFileTypes: true };

const mergeStyles = async (srcPath, outPath) => {
  const output = createWriteStream(outPath);
  try {
    const files = await readdir(srcPath, options);
    for (const file of files) {
      const filePath = path.join(file.path, file.name);
      const { ext } = path.parse(filePath);
      if (file.isFile() && ext === '.css') {
        const input = createReadStream(filePath);
        input.pipe(output);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

mergeStyles(srcPath, outPath);
