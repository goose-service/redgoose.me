import { writable } from 'svelte/store'
import { getSystemTheme } from './libs/util.js'

// error
export const error = writable(undefined)

// theme
function storeTheme()
{
  const storageKey = 'theme'
  const $html = document.querySelector('html')
  let value = updateTheme(window.localStorage.getItem(storageKey))
  const { subscribe, set, update } = writable(value)
  function updateTheme(newValue = '')
  {
    newValue = ['light','dark'].includes(newValue) ? newValue : getSystemTheme()
    window.localStorage.setItem(storageKey, newValue)
    $html.dataset.theme = newValue
    return newValue
  }
  return {
    subscribe,
    set: (newValue) => set(newValue),
    update: (newValue => update(oldValue => {
      if (newValue === oldValue) return oldValue
      return updateTheme(newValue)
    })),
  }
}
export const theme = storeTheme()
