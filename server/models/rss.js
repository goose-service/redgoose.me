import { marked } from 'marked'
import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'

function parsingContent(src)
{
  return marked(src)
}

/**
 * model rss
 *
 * @return {Promise<object>}
 */
export async function modelRss()
{
  let result = {
    items: [],
  }
  const env = getEnv()
  const size = 15
  const host = env.VITE_API_URL
  let articles = await instance('/articles/', {
    query: {
      order: '`order` desc,`srl` desc',
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
