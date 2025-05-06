const fs = require('fs');
const path = require('path');

const enData = require('../public/locales/en.json');

console.log(enData);

const convertNestedObjectToPartial = (obj, prefix = '') => {
  return Object.keys(obj).reduce((prev, element) => {
    if (typeof obj[element] === 'object') {
      return {
        ...prev,
        ...convertNestedObjectToPartial(obj[element], `${prefix}${element}.`),
      };
    }

    return {
      ...prev,
      [`${prefix}${element}`]: obj[element],
    };
  }, {});
};

const partial = convertNestedObjectToPartial(enData);

// get pwd
console.log(process.cwd(), __dirname);

const pathEn = path.resolve(__dirname, '../public/locales/en.json');

// create and save to file schema.json
fs.writeFile(pathEn, JSON.stringify(partial, null, 2), err => {
  if (err) throw err;
  console.log('The file has been saved!');
});
