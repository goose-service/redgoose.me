import { marked, Renderer } from 'marked'
import { isDev, printMessage } from '../../libs/server.js'

const { API_CLIENT_URL } = Bun.env
const dev = isDev()
const sharp = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`

export function filteringArticle(src)
{
  if (!src) return null
  return {
    srl: src.srl,
    title: src.title,
    date: src.regdate,
    image: makeThumbnailPath(src.json?.thumbnail),
    nest: src.nest?.name || null,
    category: src.category?.name || null,
  }
}

export function makeThumbnailPath(code)
{
  return code ? `${API_CLIENT_URL}/file/${code}/` : null
}

export function parsingContent(src)
{
  if (!src) return ''
  // replace API_HOST
  src = src.replaceAll('{{API_HOST}}', API_CLIENT_URL)
  // parse markdown content
  const renderer = new Renderer()
  renderer.heading = (ctx) => {
    const { depth, text } = ctx
    const id = text.replace(/\s+/g, '_')
    let str = `<h${depth} id="${id}">`
    str += `<a href="#${id}" class="anchor">${sharp}</a>`
    str += text
    str += `</h${depth}>`
    return str
  }
  renderer.image = (ctx) => {
    const { href, title, text } = ctx
    return `<img src="${href}" alt="${title || text}" loading="lazy"/>`
  }
  renderer.link = (ctx) => {
    const { href, title, text } = ctx
    const _target = /^http/.test(href) ? ' target="_blank"' : ''
    const _title = title ? ` title="${title}"` : ''
    return `<a href="${href}"${_target}${_title}>${text}</a>`
  }
  return marked.parse(src, { renderer })
}

/**
 * get cookie key
 *
 * @param {string} type
 * @param {number} srl
 * @return {string}
 */
export function getCookieKey(type, srl)
{
  switch (type)
  {
    case 'hit':
      return `goose-hit-${srl}`
    case 'star':
      return `goose-star-${srl}`
    default:
      return ''
  }
}

/**
 * catch response
 *
 * @param {ServiceError} err
 * @return {Response}
 */
export function catchResponse(err)
{
  switch (err.status)
  {
    case 200:
    case 202:
      return Response.json({
        message: err.message,
      }, {
        status: err.status,
        statusText: err.statusText,
      })
    default:
      if (dev) printMessage('error', `[${err.status || 500}] ${err.message}`)
      return new Response(err.message, {
        status: err.status || 500,
        statusText: err.statusText,
        error: err.error,
      })
  }
}
