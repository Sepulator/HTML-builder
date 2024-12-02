const { mkdir, readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const mergeStyles = require('../05-merge-styles');
const copyDir = require('../04-copy-directory');
const path = require('path');

const outPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const srcStylesPath = path.join(__dirname, 'styles');
const outStylesPath = path.join(__dirname, 'project-dist', 'style.css');
const srcAssetsPath = path.join(__dirname, 'assets');
const outAssetsPath = path.join(__dirname, 'project-dist', 'assets');
const indexPath = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');
const options = { withFileTypes: true };

const getContent = async (filePath) => {
  let data = '';
  return new Promise((res, rej) => {
    createReadStream(filePath)
      .on('data', (chunk) => (data += chunk))
      .on('end', () => res(data))
      .on('error', rej);
  });
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
