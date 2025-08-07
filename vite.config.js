import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { HOST, PORT, PORT_CLIENT, SEARCH_ENGINE, API_TOKEN } = Bun.env

const config = defineConfig(async () => {
  const useSearchEngine = SEARCH_ENGINE === 'true'
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
            if (!useSearchEngine) return _req.url
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
              'pinia',
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
    ],
  }
})

export default config
