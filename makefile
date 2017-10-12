PATH := $(PATH):node_modules/.bin
SHELL := /bin/bash

start: clean js css
	echo
	chokidar 'src/**/*.js' -c 'make js reload' &
	chokidar 'src/**/*.scss' -c 'make css reload' &
	browser-sync start -s --no-ui

build: clean js css
	uglify dist/app.js -o dist/app.js
	postcss dist/app.css -o dist/app.css -u autoprefixer

clean:
	rm -rf dist
	mkdir dist

js:
	rollup src/app.js -o dist/app.js -f iife -mc

css:
	echo
	node-sass src/app.scss -o dist

reload:
	echo
	browser-sync reload
