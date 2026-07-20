import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { dateFormat } from '../../libs/string.js'
import { getQuery } from '../../libs/util.js'
import { catchResponse, filteringArticle } from './_libs.js'

// Random articles use the current date as their seed, so one process-local
// cache entry is enough. The cache is naturally replaced when the date changes
// and is cleared when the server process restarts.
const randomArticleCache = { key: null, data: null }

/**
 * home
 * 첫페이지에서 사용되는 article 목록 가져오기
 *
 * @return {Promise<Response>}
 */
async function apiHome(req, _ctx = undefined)
{
  let response

  // trigger request event
  if (_ctx) onRequest(req, _ctx)

  try
  {
    const query = getQuery(req.url)
    const page = Number(query.page || 1)
    const randomDate = dateFormat(new Date(), '{yyyy}{MM}{dd}')
    const randomCacheKey = `${apiAssets.appSrl}:${randomDate}:4:2year`
    const hasRandomCache = page === 1 && randomArticleCache.key === randomCacheKey && Array.isArray(randomArticleCache.data)
    const baseParams = {
      app: apiAssets.appSrl,
      field: apiAssets.field,
      page,
      size: apiAssets.size,
      order: 'a.regdate DESC, a.srl DESC',
      mode: 'public',
      mod: 'nest,category',
    }
    const res = await requestApi('/mix/', {
      method: 'post',
      json: [
        {
          key: 'article',
          url: '/article/',
          params: baseParams,
        },
        page === 1 && !hasRandomCache && {
          key: 'articleRandom',
          url: '/article/',
          params: {
            ...baseParams,
            size: 4,
            random: randomDate, // 20251225
            duration: `regdate,2year`,
          },
        },
      ].filter(Boolean),
    }, false)
    const { article, articleRandom } = res
    if (!(article?.index?.length > 0))
    {
      throw new ServiceError('Not found article.', {
        status: 204,
      })
    }
    let data = {
      total: article.total,
      head: [],
      body: [],
      random: [],
    }
    // set articles
    const _articles = article.index.map(filteringArticle)
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
    if (page === 1)
    {
      if (hasRandomCache)
      {
        data.random = randomArticleCache.data
      }
      else
      {
        if (Array.isArray(articleRandom?.index))
        {
          data.random = articleRandom.index.map(filteringArticle)
          randomArticleCache.key = randomCacheKey
          randomArticleCache.data = data.random
        }
      }
    }
    // set response
    response = Response.json({
      message: 'Complete get home data.',
      ...data,
      assets: {
        page,
        size: apiAssets.size,
      },
    })
  }
  catch (_e)
  {
    response = catchResponse(_e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  // return response
  return response
}

export default apiHome
