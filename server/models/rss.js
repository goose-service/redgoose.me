import { marked, Renderer } from 'marked'
import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'

/**
 * parsing markdown content
 * @param {string} src
 * @return {string}
 */
function parsingContent(src)
{
  const renderer = new Renderer()
  renderer.heading = (text, level, raw) => {
    const id = text.replace(/\s+/g, '_')
    return `<h${level} id="${id}">${text}</h${level}>`
  }
  renderer.image = (href, title, text) => {
    return `<img src="${href}" alt="${title || text}" loading="lazy"/>`
  }
  renderer.link = (href, title, text) => {
    const _target = /^http/.test(href) ? ' target="_blank"' : ''
    const _title = title ? ` title="${title}"` : ''
    return `<a href="${href}"${_target}${_title}>${text}</a>`
  }
  return marked.parse(src, { renderer })
}

/**
 * model rss
 *
 * @return {Promise<object>}
 */
export async function modelRss()
{
  let result = {
    total: 0,
    items: [],
  }
  const env = getEnv()
  const size = env.VITE_RSS_SIZE
  const host = env.VITE_API_URL
  let articles = await instance('/articles/', {
    query: {
      app: env.VITE_APP_SRL,
      order: '`order` desc, `srl` desc',
      size,
    },
  })
  if (!articles.success)
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found articles',
    }
  }
  result.total = articles.data?.total || 0
  result.items = articles.data?.index?.length > 0 ? articles.data.index.map(o => {
    return {
      srl: o.srl,
      title: o.title,
      date: o.order,
      content: parsingContent(o.content),
      thumbnail: o.json?.thumbnail?.path ? `${host}/${o.json.thumbnail.path}` : null,
    }
  }) : []
  return result
}
