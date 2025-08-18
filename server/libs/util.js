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

/**
 * filtering query
 * value 값이 undefined인 경우 삭제한다.
 *
 * @param {object} src
 * @return {object}
 */
export function filteringQuery(src)
{
  Object.keys(src).forEach(key => {
    if (src[key] === undefined) delete src[key]
    if (src[key] === null) delete src[key]
  })
  return src
}

/**
 * checking file
 * 파일인지 아닌지 검사한다.
 * @param {string} path
 * @return {boolean}
 */
export function checkingFile(path)
{
  const fileRegex = /\.[a-zA-Z0-9]{1,10}$/
  return fileRegex.test(path)
}
