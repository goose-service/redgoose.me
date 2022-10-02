import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// docs: https://vitejs.dev/config

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    build: {
      outDir: 'assets/dist',
      lib: {
        entry: path.resolve(__dirname, 'assets/js/app.js'),
        formats: [ 'es' ],
        name: 'RedgooseApp',
        fileName: format => `app.${format}.js`,
      },
      minify: true,
      watch: {
        exclude: 'node_modules/**',
      },
      rollupOptions: {},
      assetsDir: 'assets',
    },
  };
});
