import { isbot } from 'isbot'
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
