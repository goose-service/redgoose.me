import registerServiceWorker from './registerServiceWorker'
import Main from './main.svelte'
import './assets/scss/main.scss'

window.app = new Main({
  target: document.getElementById('app'),
})

// setup service worker
registerServiceWorker().then()
