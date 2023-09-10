export function sleep(delay = 3000)
{
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * serialize
 * @param {object} obj
 * @param {boolean} usePrefix
 * @return {string}
 */
export function serialize(obj, usePrefix = false)
{
  let str = []
  let res
  for (let p in obj)
  {
    if (obj.hasOwnProperty(p) && obj[p] !== undefined)
    {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  res = str.join('&')
  return (res && usePrefix ? '?' : '') + res
}

export function pureObject(src)
{
  if (!src) return null
  try
  {
    return JSON.parse(JSON.stringify(src))
  }
  catch(_)
  {
    return null
  }
}

export function hashScroll(hash)
{
  if (!hash) return
  sleep(20).then(() => {
    const _el = document.getElementById(decodeURIComponent(hash).replace(/^#/, ''))
    if (!_el) return
    _el.scrollIntoView(true)
  })
}
