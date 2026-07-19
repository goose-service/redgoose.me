import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { html } from '../../classes/Meta.js'
import apiRss from '../api/rss.js'

const { URL_PATH } = Bun.env
const dev = isDev()
const RSS_CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=600'
const XML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

function removeInvalidXmlCharacters(value)
{
  return Array.from(String(value ?? '')).filter(char => {
    const code = char.codePointAt(0)
    return code === 0x9
      || code === 0xa
      || code === 0xd
      || (code >= 0x20 && code <= 0xd7ff)
      || (code >= 0xe000 && code <= 0x10ffff)
  }).join('')
}

function escapeXml(value)
{
  return removeInvalidXmlCharacters(value).replace(/[&<>"']/g, char => XML_ESCAPE_MAP[char])
}

function makeCdata(value)
{
  const text = removeInvalidXmlCharacters(value).replaceAll(']]>', ']]]]><![CDATA[>')
  return `<![CDATA[${text}]]>`
}

function toRssDate(value)
{
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toUTCString()
}

function normalizeUrl(value)
{
  if (!value) return null
  try
  {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) return null
    return url.toString().replace(/\/+$/, '')
  }
  catch (_e)
  {
    return null
  }
}

function getSiteUrl(req)
{
  const requestOrigin = new URL(req.url).origin
  return normalizeUrl(html.meta?.['og:url'])
    || normalizeUrl(URL_PATH)
    || requestOrigin
}

function makeUrl(baseUrl, path)
{
  try
  {
    return new URL(path, `${baseUrl}/`).toString()
  }
  catch (_e)
  {
    return path
  }
}

function makeItem(article, siteUrl)
{
  const articleUrl = makeUrl(siteUrl, `/article/${encodeURIComponent(article.srl)}/`)
  const pubDate = toRssDate(article.date)
  let xml = `    <item>\n`
  xml += `      <title>${makeCdata(article.title || 'Untitled Work')}</title>\n`
  xml += `      <link>${escapeXml(articleUrl)}</link>\n`
  xml += `      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>\n`
  xml += `      <description>${makeCdata(article.content)}</description>\n`
  if (pubDate) xml += `      <pubDate>${pubDate}</pubDate>\n`
  xml += `    </item>`
  return { xml, pubDate }
}

function makeFeedXml(data, req)
{
  const siteUrl = getSiteUrl(req)
  const feedUrl = makeUrl(siteUrl, '/rss/')
  const articles = Array.isArray(data?.index) ? data.index : []
  const items = articles.map(article => makeItem(article, siteUrl))
  const latestDate = items
    .map(item => item.pubDate)
    .filter(Boolean)
    .map(date => new Date(date))
    .sort((a, b) => b - a)[0]
  const latestRssDate = latestDate ? latestDate.toUTCString() : null
  const now = new Date().toUTCString()
  const title = html.title || 'redgoose.me'
  const description = html.meta?.description || title
  const locale = html.meta?.['og:locale'] || 'ko_KR'
  const language = locale.replace('_', '-')
  const year = new Date().getFullYear()

  let xml = `<?xml version="1.0" encoding="utf-8"?>\n\n`
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`
  xml += `  <channel>\n`
  xml += `    <title>${makeCdata(title)}</title>\n`
  xml += `    <description>${makeCdata(description)}</description>\n`
  xml += `    <link>${escapeXml(siteUrl)}</link>\n`
  xml += `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>\n`
  xml += `    <language>${escapeXml(language)}</language>\n`
  xml += `    <lastBuildDate>${now}</lastBuildDate>\n`
  if (latestRssDate) xml += `    <pubDate>${latestRssDate}</pubDate>\n`
  xml += `    <generator>redgoose.me</generator>\n`
  xml += `    <copyright>Copyright 2013-${year} GoOSe. All right reserved.</copyright>\n`
  xml += `    <webMaster>scripter@me.com (GoOSe)</webMaster>\n`
  if (items.length > 0) xml += `    <!-- Data index -->\n${items.map(item => item.xml).join('\n')}\n`
  xml += `  </channel>\n`
  xml += `</rss>`
  return xml
}

export default {
  '/rss/': async (req, _ctx) => {
    let response

    onRequest(req, _ctx)

    try
    {
      const res = await apiRss(req)
      if (!res.ok && res.status !== 204)
      {
        throw new ServiceError('Failed get api data.', {
          status: res.status || 502,
        })
      }
      const data = res.status === 204 ? { index: [] } : await res.json()
      const xml = makeFeedXml(data, req)
      response = new Response(xml, {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': RSS_CACHE_CONTROL,
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }
    catch (_e)
    {
      const status = Number.isInteger(_e?.status) && _e.status >= 400 ? _e.status : 500
      if (dev) printMessage('error', `[${status}] ${_e?.message || 'Failed generate RSS.'}`)
      response = new Response('Failed to generate RSS feed.', {
        status,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      })
    }

    onResponse(req, response, _ctx)
    return response
  },
}
