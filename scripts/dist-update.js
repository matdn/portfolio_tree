const path = require('path')
const fs = require('fs')

const indexPath = path.join(__dirname, '../dist/browser/index.html')
console.log(indexPath)

const html = fs.readFileSync(indexPath, 'utf-8')
  // replace the base href
  .replace('href="/"', 'href="./"')
  // replace all the scripts src
  .replace(/script src="(\w)/g, 'script src="./$1')

fs.writeFileSync(indexPath, html, 'utf-8')
console.log('Done!')
