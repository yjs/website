import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const localImports = process.env.LOCALIMPORTS


const customModules = new Set([
  'y-prosemirror', 'y-websocket', 'y-indexeddb'
])

/**
 * @type {Set<any>}
 */
const customLibModules = new Set([
  'lib0'
])

const debugResolve = {
  resolveId (importee) {
    if (localImports) {
      if (importee === 'd-components') {
        return `${process.cwd()}/../d-components/src/index.js`
      }
      if (importee === 'yjs') {
        return `${process.cwd()}/../yjs/src/index.js`
      }
      if (importee === 'isomorphic.js') {
        return `${process.cwd()}/../isomorphic.js/iso-browser.js`
      }
      if (customModules.has(importee.split('/')[0])) {
        return `${process.cwd()}/../${importee}/src/${importee}.js`
      }
      if (customLibModules.has(importee.split('/')[0])) {
        return `${process.cwd()}/../${importee}`
      }
    }
    return null
  }
}

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
  input: './src/index.js',
  output: [{
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js'
  }],
  plugins: [
    debugResolve,
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs(),
    ...minificationPlugins
  ]
}]
