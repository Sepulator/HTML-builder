const { readdir, stat } = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

const displayDirFiles = async (dirPath) => {
  const options = { withFileTypes: true };
  const result = [];
  try {
    const files = await readdir(dirPath, options);
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(file.path, file.name);
        const fileStat = await stat(filePath);
        const { name, ext } = path.parse(filePath);
        const size = (fileStat.size / 1024).toFixed(2) + ' KB';
        result.push({ name, extension: ext.slice(1), size });
      }
    }
  } catch (err) {
    console.log(err);
  }

  console.table(result);
};

displayDirFiles(dirPath);
