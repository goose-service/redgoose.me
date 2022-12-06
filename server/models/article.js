import { marked, Renderer } from 'marked'
import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'

const sharp = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`

/**
 * parsing content
 *
 * @param {string} src
 * @return {string}
 */
function parsingContent(src)
{
  const renderer = new Renderer()
  renderer.heading = (text, level, raw) => {
    const id = text.replace(/\s+/g, '_')
    return `<h${level} id="${id}"><a href="#${id}" class="anchor">${sharp}</a>${text}</h${level}>`
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
 * model article
 *
 * @param {number} srl
 * @param {boolean} updateHit
 * @return {Promise<object>}
 */
export async function modelArticle({ srl, updateHit })
{
  if (!(srl > 0))
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'no srl',
    }
  }
  let result = {
    srl: 0,
    title: '',
    nestName: '',
    categoryName: '',
    content: '',
    image: '',
    hit: '',
    star: 0,
  }
  const env = getEnv()
  const host = env.VITE_API_URL
  let article = await instance(`/articles/${srl}/`, {
    query: {
      app: env.VITE_APP_SRL,
      hit: updateHit ? 1 : 0,
      ext_field: 'nest_name,category_name',
    },
  })
  if (!(article.success && article.data?.srl))
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found item',
    }
  }
  result.srl = article.data.srl
  result.title = article.data.title
  result.nestName = article.data.nest_name
  result.categoryName = article.data.category_name
  result.content = parsingContent(article.data.content)
  result.image = article.data.json?.thumbnail?.path ? `${host}/${article.data.json.thumbnail.path}` : null
  result.hit = article.data.hit
  result.star = article.data.star
  result.order = article.data.order
  return result
}

/**
 * update star
 *
 * @param {number} srl
 * @return {Promise<number>}
 */
export async function modelArticleUpdateStar({ srl })
{
  let res = await instance(`/articles/${srl}/update/`, {
    method: 'post',
    body: { type: 'star' },
  })
  if (!res.success)
  {
    throw {
      status: ERROR_CODE.FAILED_UPDATE,
      message: 'Failed update star.',
    }
  }
  return Number(res.data.star)
}
