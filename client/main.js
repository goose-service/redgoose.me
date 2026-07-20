import { createApp } from 'vue'
import router from './router/index.js'
import App from './app.vue'

const app = createApp(App, {})
  .use(router)
  .mount('#app')

export default app
