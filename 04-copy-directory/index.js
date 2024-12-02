const { copyFile, mkdir, readdir } = require('fs/promises');
const path = require('path');

const srcDirPath = path.join(__dirname, 'files');
const outDirPath = path.join(__dirname, 'files-copy');
const options = { withFileTypes: true, recursive: true };

/**
 * @param {string} srcDirPath
 * @param {string} outDirPath
 **/
const copyDir = async (srcDirPath, outDirPath) => {
  const files = await readdir(srcDirPath, options);
  mkdir(outDirPath, { recursive: true });
  for (const file of files) {
    if (file.isDirectory()) {
      const destPath = path.join(outDirPath, file.name);
      await mkdir(destPath, { recursive: true });
    }

    if (file.isFile()) {
      const rel = file.path.split(srcDirPath)[1];
      const srcFile = path.join(file.path, file.name);
      const destFile = path.join(outDirPath, rel, file.name);
      await copyFile(srcFile, destFile);
    }
  }
};

copyDir(srcDirPath, outDirPath);

module.exports = copyDir;
