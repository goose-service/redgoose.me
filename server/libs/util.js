/**
 * get query from url
 *
 * @param {string} url
 * @param {string} key
 * @return {any}
 */
export function getQuery(url, key = '')
{
  const _url = new URL(url)
  const _query = _url.searchParams
  if (key)
  {
    return _query.get(key)
  }
  else
  {
    return Object.fromEntries(_query)
  }
}
