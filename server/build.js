/**
 * Build server with Bun's built-in bundler
 */

import { transform } from 'lightningcss'

const minifyCssPlugin = {
  name: 'minify-css-text-imports',
  setup(build) {
    // The server bundle imports CSS as text. Minify every CSS text import,
    // including future files added outside the current service directory.
    build.onLoad({ filter: /\.css$/i }, async ({ path }) => {
      const source = new Uint8Array(await Bun.file(path).arrayBuffer())
      const { code } = transform({
        filename: path,
        code: source,
        minify: true,
      })
      const css = new TextDecoder().decode(code)

      return {
        contents: `export default ${JSON.stringify(css)}`,
        loader: 'js',
      }
    })
  },
}

console.log('🪴 Start build BACKEND...')

// run build
await Bun.build({
  root: '.',
  entrypoints: [ './server/main.js' ],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  production: true,
  splitting: true,
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
  external: [
    'react-dom',
  ],
  naming: {
    entry: '[name].[ext]',
    chunk: 'service/chunk-[name]-[hash].[ext]',
    asset: 'service/asset-[name]-[hash].[ext]',
  },
  define: {
    'Bun.env.USE_BUILD': JSON.stringify(true),
  },
  plugins: [
    minifyCssPlugin,
  ],
})

console.log('✅ Complete build BACKEND...')
