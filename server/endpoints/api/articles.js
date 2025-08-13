import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { getQuery } from '../../libs/util.js'
import { catchResponse, filteringArticle } from './_libs.js'

/**
 * articles
 * article 목록 데이터 가져오기
 *
 * @return {Promise<Response>}
 */
async function apiArticles(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    const query = getQuery(req.url)
    const page = Number(query.page || 1)
    const nest_srl = query.nest || undefined
    const category_srl = query.category || undefined
    const res = await requestApi('/article/', {
      query: {
        fields: apiAssets.articleIndexFields,
        app: apiAssets.appSrl,
        nest: nest_srl,
        category: category_srl,
        size: apiAssets.size,
        order: 'regdate',
        sort: 'desc',
        page,
        mod: 'nest,category',
      },
    })
    // check response
    if (!(res?.data?.total > 0))
    {
      throw new ServiceError('Not found article.', {
        status: 204,
      })
    }
    // set response
    response = Response.json({
      message: 'Complete get article data.',
      total: res.data.total,
      index: res.data.index?.length > 0 ? res.data.index.map(filteringArticle) : [],
    })
  }
  catch (e)
  {
    response = catchResponse(e)
  }

  // trigger response event
  onResponse(req, response, ctx)

  return response
}

export default apiArticles
