const fs = require('fs');
const glob = require('glob');

const directoryPath = 'src/app/';
const i18nFilePath = 'public/locales/en.json';

const i18nContent = fs.readFileSync(i18nFilePath, 'utf8');
const i18nKeys = Object.keys(JSON.parse(i18nContent));

glob(`${directoryPath}/**/*.ts`, (err, files) => {
  if (err) {
    console.error('Error while reading files:', err);
    return;
  }

  const usedKeys = new Set();

  files.forEach(file => {
    const sourceCode = fs.readFileSync(file, 'utf8');

    i18nKeys.forEach(key => {
      if (sourceCode.includes(key)) {
        usedKeys.add(key);
      }
    });
  });

  const unusedKeys = i18nKeys.filter(key => !usedKeys.has(key));

  console.log('Unused keys:');
  unusedKeys.forEach(key => console.log(key));
});
