import { createApp } from 'vue'
import router from './router/index.js'
import App from './app.vue'

// load main stylesheet
import './scss/main.scss'

const app = createApp(App, {})
  .use(router)
  .mount('#app')

export default app
