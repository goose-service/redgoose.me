import { isbot } from 'isbot'
import { serialize } from '../../libs/string.js'
import { PATH_DIST } from '../../libs/assets.js'
import { DEFAULT_HEADERS } from '../../libs/server.js'

export const withDoctype = (jsx) => `<!doctype html>\n${jsx}`

export function setResponse(content, status = 200)
{
  return new Response(withDoctype(content), {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}

/**
 * checking bot
 * @param {Request} _req
 * @return {boolean}
 */
export function checkingBot(_req)
{
  return isbot(_req.headers.get('user-agent'))
}

/**
 * render index page
 * `dist/index.html` 파일 렌더링
 *
 * @param {Request} _req
 * @return {Promise<Response>}
 */
export async function renderIndex(_req)
{
  const file = Bun.file(`${PATH_DIST}/index.html`)
  if (await file.exists())
  {
    const text = await file.text()
    return new Response(text, {
      status: 200,
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  }
  else
  {
    return new Response('Not found page.', { status: 404 })
  }
}

/**
 * create paginate
 *
 * @param {number} total
 * @param {number} page
 * @param {number} size
 * @param {number} range
 * @param {string} baseUrl
 * @param {object} query
 * @return {array}
 */
export function createPaginate(total = 0, page = 1, size = 24, range = 10, baseUrl = './', query = {})
{
  page = Number(page) > 1 ? Number(page) : 1
  let items = []
  const count = Math.ceil(total / size)
  const block = Math.floor((page - 1) / range)
  function makeUrl(n = 1)
  {
    let newQuery = query ? JSON.parse(JSON.stringify(query)) : {}
    newQuery.page = n
    if (newQuery.page === 1) delete newQuery.page
    return `${baseUrl}${serialize(newQuery, true)}`
  }
  function pageItems()
  {
    let items = []
    let startPage = block * range + 1
    for (let i = 1; i < range + 1 && startPage <= count; i++, startPage++)
    {
      items[i - 1] = {
        key: startPage,
        active: (startPage === page),
        url: startPage === page ? undefined : makeUrl(startPage),
      }
    }
    let checkEmpty = false
    items.forEach(o => {
      if (o.active) checkEmpty = true
    })
    return checkEmpty ? items : []
  }

  if (block !== undefined && page > 0)
  {
    items = pageItems()
  }
  return items
}

export function getCategoryName(category, srl)
{
  if (!(category?.length > 0)) return ''
  const item = category.find((o) => {
    return String(o.srl) === String(srl)
  })
  return item?.name || ''
}

/**
 * content to description
 * html 내용을 간단한 설명으로 변환
 *
 * @param {string} html
 * @param {number} maxLength
 * @return {string}
 */
export function contentToDescription(html, maxLength = 100)
{
  let text = html.replace(/<[^>]+>/g, '')
  text = text.replace(/https?:\/\/[^ \n]+/g, '')
  text = text.replace(/\s+/g, ' ').trim()
  if (text.length > maxLength)
  {
    text = text.substring(0, maxLength).trim() + '...'
  }
  return text
}
