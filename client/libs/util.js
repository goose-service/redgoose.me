/**
 * storage control
 * @param {string} key
 * @param {string|number|null} value
 * @return {any}
 */
export function storageControl(key, value = null)
{
  if (!key) return null
  if (value)
  {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  else
  {
    return JSON.parse(window.localStorage.getItem(key) || null)
  }
}

/**
 * scroll to position
 * @param {number} y
 */
export function scrollTo(y = 0)
{
  window.scroll(0, y)
}

/**
 * hash scroll
 * @param {string} hash
 */
export function hashScroll(hash)
{
  if (!hash) return
  setTimeout(() => {
    const _el = document.getElementById(decodeURIComponent(hash).replace(/^#/, ''))
    if (!_el) return
    _el.scrollIntoView(true)
  }, 20)
}
