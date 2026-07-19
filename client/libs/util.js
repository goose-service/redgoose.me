/**
 * storage control
 * @param {string} key
 * @param {string|number|boolean|null} [value]
 * @return {any}
 */
export function storageControl(key, value)
{
  if (!key) return null
  // An explicitly supplied value means "set", even when it is falsy.
  if (arguments.length > 1)
  {
    window.localStorage.setItem(key, JSON.stringify(value))
    return value
  }
  const stored = window.localStorage.getItem(key)
  if (stored === null) return null
  try
  {
    return JSON.parse(stored)
  }
  catch (_e)
  {
    return stored
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
