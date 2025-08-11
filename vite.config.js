import { defineConfig } from 'vite'
import { isbot } from 'isbot'
import vue from '@vitejs/plugin-vue'
import pluginHeadToJson from './plugins/headToJson.js'

const { HOST, PORT, PORT_CLIENT, API_TOKEN } = Bun.env

const config = defineConfig(async () => {
  const proxyUrl = `http://${HOST}:${PORT}`
  return {
    root: 'client',
    publicDir: './public',
    base: '/',
    server: {
      host: HOST,
      port: Number(PORT_CLIENT),
      open: false,
      proxy: {
        '/api': {
          target: `${proxyUrl}/api`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/?/, '/'),
        },
        '/rss': {
          target: `${proxyUrl}/rss`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/rss\/?/, '/'),
        },
        '/': {
          target: proxyUrl,
          changeOrigin: true,
          bypass: (_req, _res, _options) => {
            if (!isbot(_req.headers['user-agent'])) return _req.url
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            const info = assetInfo.name.split('.')
            let ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|ico|webp|avif/i.test(ext)) ext = 'images/'
            else if (/css/.test(ext)) ext = 'css/'
            else if (/woff?2|ttf/i.test(ext)) ext = 'fonts/'
            else ext = ''
            return `assets/${ext}[name]-[hash][extname]`
          },
          manualChunks: {
            vue: [
              'vue',
              'vue-router',
            ],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false,
        },
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {},
        },
      }),
      pluginHeadToJson(),
    ],
  }
})

export default config
