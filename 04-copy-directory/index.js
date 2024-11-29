const { copyFile, mkdir, readdir } = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const options = { withFileTypes: true, recursive: true };

const copyDir = async (dirPath) => {
  const copyDirPath = dirPath + '-copy';
  const files = await readdir(dirPath, options);
  mkdir(copyDirPath, { recursive: true });
  for (const file of files) {
    const srcFile = path.join(file.path, file.name);
    const destFile = path.join(copyDirPath, file.name);
    copyFile(srcFile, destFile);
  }
};

copyDir(dirPath);
