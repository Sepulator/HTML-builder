const { readdir, stat } = require('fs/promises');
const path = require('path');

const dirName = 'secret-folder';

const displayDir = async (name) => {
  const dirPath = path.join(__dirname, name);
  const options = { withFileTypes: true, recursive: true };
  const result = [];
  try {
    const files = await readdir(dirPath, options);
    for (const file of files) {
      if (file.isFile()) {
        const fileStat = await stat(path.join(file.path, file.name));
        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        const size = fileStat.size;
        result.push({ name, extension: ext.slice(1), size });
      }
    }
  } catch (err) {
    console.log(err);
  }

  console.table(result);
};

displayDir(dirName);
