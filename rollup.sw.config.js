import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import fs from 'fs'

const dist = fs.readdirSync('./dist').filter(file => /(?<!(swfiles|service-worker))\.js$/.test(file)).map(f => `"/dist/${f}"\n`)
const style = fs.readdirSync('./styles').filter(file => /\.css$/.test(file)).map(f => `"/styles/${f}"\n`)
const files = dist.concat(style)
fs.writeFileSync('./dist/swfiles.js', `export const precache = [${files.join(',')}]`)

const minificationPlugins = process.env.PRODUCTION ? [terser({
  module: true,
  compress: {
    hoist_vars: true,
    module: true,
    passes: 1,
    pure_getters: true,
    unsafe_comps: true,
    unsafe_undefined: true
  },
  mangle: {
    toplevel: true
  }
})] : []

export default [{
  input: './src/service-worker.js',
  output: [{
    dir: './',
    format: 'iife',
    sourcemap: true
  }],
  plugins: [
    nodeResolve({
      sourcemap: true,
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs(),
    ...minificationPlugins
  ]
}]
