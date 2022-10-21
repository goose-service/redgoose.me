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
