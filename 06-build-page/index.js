const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const srcStylesPath = path.join(__dirname, 'styles');
const outStylesPath = path.join(__dirname, 'project-dist', 'style.css');
const srcAssetsPath = path.join(__dirname, 'assets');
const outAssetsPath = path.join(__dirname, 'project-dist', 'assets');
const indexPath = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');
const options = { withFileTypes: true, recursive: true };

/** @param {string} filePath  */
const getContent = async (filePath) => {
  let data = '';
  return new Promise((res, rej) => {
    createReadStream(filePath)
      .on('data', (chunk) => (data += chunk))
      .on('end', () => res(data))
      .on('error', rej);
  });
};

/**
 * @param {string} srcPath
 * @param {string} outPath
 */
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

/**
 * @param {string} srcDirPath
 * @param {string} outDirPath
 **/
const copyDir = async (srcDirPath, outDirPath) => {
  await rm(outDirPath, { recursive: true, force: true });
  const files = await readdir(srcDirPath, options);
  await mkdir(outDirPath, { recursive: true });
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

const buildPage = async () => {
  let template = await getContent(templatePath);
  await mkdir(outPath, { recursive: true });

  try {
    const files = await readdir(componentsPath, options);

    for (const file of files) {
      const filePath = path.join(file.path, file.name);
      const content = await getContent(filePath);
      const { name } = path.parse(filePath);
      const arr = template.split(`{{${name}}}`);
      template = arr[0] + content + arr[1];
    }
  } catch (err) {
    console.log(err);
  }
  const output = createWriteStream(indexPath);
  output.write(template);
  mergeStyles(srcStylesPath, outStylesPath);
  copyDir(srcAssetsPath, outAssetsPath);
};

buildPage();
