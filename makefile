PATH := $(PATH):node_modules/.bin
SHELL := /bin/bash

start: fresh
	chokidar 'src/**/*.js' -c 'make js reload' &
	chokidar 'src/**/*.scss' -c 'make css reload' &
	browser-sync start -s --no-ui

build: fresh
	uglify dist/app.js -o dist/app.js
	postcss dist/app.css -o dist/app.css -u autoprefixer

fresh: clean js css

clean:
	rm -rf dist
	mkdir dist

js:
	rollup src/app.js -o dist/app.js -f iife -mc

css:
	node-sass src/app.scss -o dist

reload:
	browser-sync reload
