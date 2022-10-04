import preprocess from 'svelte-preprocess'
import { SvelteOptions } from '@sveltejs/vite-plugin-svelte'

const config: SvelteOptions = {
  preprocess: preprocess(),
  extensions: ['.svelte'],
  compilerOptions: {},
  onwarn(warning, defaultHandler) {
    switch (warning.code)
    {
      case 'css-unused-selector':
      case 'a11y-label-has-associated-control':
        return
    }
    defaultHandler(warning)
  },
}

export default config
