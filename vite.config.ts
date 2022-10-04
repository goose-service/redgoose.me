import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svelteConfig from './svelte.config'

const config = defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    server: {
      host: env.VITE_HOST,
      port: Number(env.VITE_PORT),
      open: env.VITE_OPEN_BROWSER === 'true',
    },
    build: {
      outDir: env.VITE_OUT_DIR,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo: any): string => {
            const info: string[] = assetInfo.name.split('.')
            let ext: string = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext))
            {
              ext = 'images/'
            }
            else if (/woff|woff2/.test(ext))
            {
              ext = 'fonts/'
            }
            else
            {
              ext = ''
            }
            return `assets/${ext}[name]-[hash][extname]`
          },
        },
      },
    },
    define: {
      //
    },
    plugins: [
      svelte(svelteConfig),
    ],
  }
})

export default config
