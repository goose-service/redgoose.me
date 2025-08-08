import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { dateFormat } from '../../libs/string.js'
import { getQuery } from '../../libs/util.js'
import { filteringArticle } from './_libs.js'

const dev = isDev()

/**
 * home
 * 첫페이지에서 사용되는 article 목록 가져오기
 *
 * @return {Promise<Response>}
 */
async function home(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    const query = getQuery(req.url)
    const page = Number(query.page || 1)
    const baseParams = {
      app_srl: apiAssets.appSrl,
      fields: apiAssets.articleIndexFields,
      mod: 'nest,category',
    }
    const res = await requestApi('/mix/', {
      method: 'post',
      json: [
        {
          key: 'article',
          url: '/article/',
          params: {
            ...baseParams,
            size: apiAssets.size,
            order: 'regdate',
            sort: 'desc',
            page,
          },
        },
        page === 1 && {
          key: 'articleRandom',
          url: '/article/',
          params: {
            ...baseParams,
            size: 4,
            random: dateFormat(new Date(), '{yyyy}{MM}{dd}'), // 20251225
          },
        },
      ].filter(Boolean),
    }, false)
    const { article, articleRandom } = res
    if (!(article?.data?.index?.length > 0))
    {
      throw new ServiceError('Not found article.', {
        status: 204,
      })
    }
    let data = {
      total: article.data.total,
      head: [],
      body: [],
      random: [],
    }
    // set articles
    const _articles = article.data.index.map(filteringArticle)
    if (page === 1)
    {
      data.head = _articles.slice(0, 4) || []
      data.body = _articles.slice(4) || []
    }
    else
    {
      data.body = _articles
    }
    // set random articles
    if (articleRandom?.data?.index?.length > 0)
    {
      const _randomArticles = articleRandom.data.index.map(filteringArticle)
      data.random = _randomArticles || []
    }
    // set response
    response = Response.json({
      message: 'Complete get home data.',
      data,
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Failed get data.', { status: e.status || 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}

export default home
