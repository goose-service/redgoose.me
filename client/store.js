import { reactive } from 'vue'
import { storageControl } from './libs/util.js'

const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
}
const STORAGE_KEY_THEME = 'redgoose:theme'

class Store {

  data = reactive({
    theme: THEME.LIGHT,
  })

  constructor()
  {
    this.data.theme = storageControl(STORAGE_KEY_THEME) || THEME.LIGHT
    this.changeTheme(this.data.theme)
  }

  changeTheme(value)
  {
    if (![ THEME.LIGHT, THEME.DARK ].includes(value)) return
    const $html = document.documentElement
    this.data.theme = value
    $html.dataset.theme = value
    storageControl(STORAGE_KEY_THEME, value)
  }

}

export default Store
