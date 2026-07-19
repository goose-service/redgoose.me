import { defineConfig } from 'vite'
import { isbot } from 'isbot'
import vue from '@vitejs/plugin-vue'
import pluginHeadToJson from './plugins/headToJson.js'

const { HOST, PORT, PORT_CLIENT } = Bun.env

export default defineConfig(({
  root: 'client',
  publicDir: './public',
  base: '/',
  server: {
    host: HOST,
    port: Number(PORT_CLIENT),
    open: false,
    proxy: {
      '/api': {
        target: `http://${HOST}:${PORT}/api`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/?/, '/'),
      },
      '/rss': {
        target: `http://${HOST}:${PORT}/rss`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/rss\/?/, '/'),
      },
      '/': {
        target: `http://${HOST}:${PORT}`,
        changeOrigin: true,
        bypass: (_req, _res, _options) => {
          if (!isbot(_req.headers['user-agent'])) return _req.url
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: false,
    rolldownOptions: {
      output: {
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || ''
          let ext = info ? info[info.length - 1] : ''
          let subDir = ''
          if (/png|jpe?g|svg|gif|ico|webp|avif/i.test(ext)) subDir = 'images/'
          else if (/css/.test(ext)) subDir = 'css/'
          else if (/woff?2|ttf/i.test(ext)) subDir = 'fonts/'
          return `${subDir}[name]-[hash][extname]`
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': new URL('./client', import.meta.url).pathname,
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => /^ext-|^goose-/.test(tag),
        },
      },
    }),
    pluginHeadToJson(),
  ],
}))
