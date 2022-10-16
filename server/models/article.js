import { marked } from 'marked'
import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'

function parsingContent(src)
{
  return marked(src)
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
  return result
}

/**
 * update like
 *
 * @param {number} srl
 * @return {Promise<number>}
 */
export async function modelArticleUpdateLike({ srl })
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
