const fs = require('fs')

// Compile
const js = 'rollup src/main.js -o dist/bundle.js -f iife -mc'
const css = 'echo && node-sass src/main.scss dist/styles.css'
const clean = 'rm -rf dist && mkdir dist'
const fresh = `${clean} && ${js} && ${css}`

// Local Server
const sync = 'echo && browser-sync start -s --no-ui'
const reload = 'echo && browser-sync reload && echo'

// File Watching
const watchJS = `chokidar 'src/**/*.js' -c '${js} && ${reload}'`
const watchCSS = `chokidar 'src/**/*.scss' -c '${css} && ${reload}'`

// Post-processing
const uglify = 'uglifyjs dist/bundle.js -o dist/bundle.js -mc'
const postcss = 'postcss dist/styles.css -o dist/styles.css -u autoprefixer'

// Scripts
const scripts = {
  build: `${fresh} && ${uglify} && ${postcss}`,
  start: `${fresh} && ${sync} & ${watchJS} & ${watchCSS}`
}

// Write Changes
fs.readFile('package.json', (err, data) => {
  if (err) throw err
  data = JSON.parse(data)
  data.scripts = scripts
  fs.writeFile('package.json', JSON.stringify(data, null, '  '), err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
})
