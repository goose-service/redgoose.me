import { marked, Renderer } from 'marked'
import { isDev, printMessage } from '../../libs/server.js'

const { API_CLIENT_URL, COOKIE_PREFIX } = Bun.env
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

export function filteringCategory(src)
{
  let category, label
  switch (src.name)
  {
    case 'all':
      category = undefined
      label = 'All'
      break
    case 'none':
      category = '0'
      label = 'None'
      break
    default:
      category = String(src.srl)
      label = src.name
      break
  }
  return {
    srl: category,
    name: label,
    count: src.count,
  }
}

export function makeThumbnailPath(code)
{
  return code ? `${API_CLIENT_URL}/file/${code}/` : null
}

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value)
{
  return String(value ?? '').replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char])
}

function isSafeUrl(value, allowMailto = false)
{
  const url = String(value || '').trim()
  if (!url || url.startsWith('//')) return false
  if (url.startsWith('#') || url.startsWith('/')) return true

  try
  {
    const protocol = new URL(url, 'https://redgoose.me').protocol
    const protocols = allowMailto ? [ 'http:', 'https:', 'mailto:' ] : [ 'http:', 'https:' ]
    return protocols.includes(protocol)
  }
  catch (_e)
  {
    return false
  }
}

export function parsingContent(src, options = {})
{
  if (!src) return ''
  const safe = options.safe === true
  // replace API_HOST
  src = src.replaceAll('{{API_HOST}}', API_CLIENT_URL)
  // parse markdown content
  const renderer = new Renderer()
  renderer.heading = (ctx) => {
    const { depth, text, tokens } = ctx
    const id = text.replace(/\s+/g, '_')
    const _text = renderer.parser.parseInline(tokens)
    let _str = `<h${depth} id="${escapeHtml(id)}">`
    _str += `<a href="#${escapeHtml(id)}" class="anchor">${sharp}</a>`
    _str += _text
    _str += `</h${depth}>`
    return _str
  }
  renderer.image = (ctx) => {
    const { href, title, text } = ctx
    if (safe && !isSafeUrl(href)) return ''
    return `<img src="${escapeHtml(href)}" alt="${escapeHtml(title || text)}" loading="lazy"/>`
  }
  renderer.link = (ctx) => {
    const { href, title, tokens } = ctx
    const _text = renderer.parser.parseInline(tokens)
    if (safe && !isSafeUrl(href, true)) return _text
    const _target = /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''
    const _title = title ? ` title="${escapeHtml(title)}"` : ''
    return `<a href="${escapeHtml(href)}"${_target}${_title}>${_text}</a>`
  }
  renderer.html = (ctx) => safe ? '' : ctx.text
  return marked.parse(src, {
    gfm: true,
    breaks: true,
    silent: true,
    renderer,
  })
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
      return `${COOKIE_PREFIX}hit-${srl}`
    case 'star':
      return `${COOKIE_PREFIX}star-${srl}`
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
      if (dev) printMessage('error', `[${err.status || 500}] API / ${err.message}`)
      return new Response(err.message, {
        status: err.status || 500,
        statusText: err.statusText,
        error: err.error,
      })
  }
}
