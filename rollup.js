const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')

const { API_URL, S3_URL } = process.env

const watcher = rollup.watch({
  input: 'src/app.js',
  output: {
    file: 'dist/app.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    replace({ API_URL, S3_URL }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['env', { modules: false }]
      ]
    }),
    resolve()
  ],
  cache: {}
})

watcher.on('event', event => {
  console.log(event)
  if (event.code === 'END') {
    console.log('reload...')
  }
})

// stop watching
// watcher.close()
