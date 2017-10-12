.RECIPEPREFIX +=
export PATH := $(PATH):../node_modules/.bin

fresh: clean js css

clean:
  rm -rf dist
  mkdir dist

js:
  rollup src/app.js -o dist/app.js -f iife -mc

css:
  node-sass src/app.css dist/app.css

sync:
  browser-sync start -s --no-ui

reload:
  browser-sync reload

build: fresh
  uglify dist/app.js -o dist/app.js
  postcss dist/app.css -o dist/app.css -u autoprefixer

start: fresh
  chokidar 'web/**/*.js' -c 'make js reload'
  chokidar 'web/**/*.css' -c 'make css reload'
