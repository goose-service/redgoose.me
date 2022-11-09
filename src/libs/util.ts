export function sleep(delay: number = 3000): Promise<void>
{
  return new Promise(resolve => setTimeout(resolve, delay))
}

export function serialize(obj?: any, usePrefix: boolean = false): string
{
  let str: string[] = []
  let res: string
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

export function pureObject(src: any): any
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

export function hashScroll(hash): void
{
  if (!hash) return
  sleep(20).then(() => {
    const _el = document.getElementById(decodeURIComponent(hash).replace(/^#/, ''))
    if (!_el) return
    _el.scrollIntoView(true)
  })
}
