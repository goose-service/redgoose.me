import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { getQuery } from '../../libs/util.js'
import { catchResponse, filteringArticle, filteringCategory } from './_libs.js'

/**
 * nest
 * nest, category, article 데이터 한꺼번에 전부 가져오기
 *
 * @return {Promise<Response>}
 */
async function apiNest(req, _ctx = undefined)
{
  let response

  // trigger request event
  if (_ctx) onRequest(req, _ctx)

  try
  {
    const { code, category_srl } = req.params
    const query = getQuery(req.url)
    const page = Number(query.page || 1)
    const res = await requestApi('/mix/', {
      method: 'post',
      json: [
         {
           key: 'nest',
           url: '/nest/{srl}/',
           params: {
             srl: code,
             app: apiAssets.appSrl,
             field: 'srl,code,name',
           },
        },
        {
          key: 'category',
          url: '/category/',
          if: '{{nest.srl}}',
          params: {
            module: 'nest',
            module_srl: '{{nest.srl}}',
            page: 0,
            order: 'turn ASC',
            mod: 'count,all',
          },
        },
        {
          key: 'article',
          url: '/article/',
          if: '{{nest.srl}}',
          params: {
            field: apiAssets.field,
            nest: '{{nest.srl}}',
            category: category_srl ?? undefined,
            mode: 'public',
            size: apiAssets.size,
            order: 'a.regdate DESC, a.srl DESC',
            page,
            mod: 'nest,category',
          },
        },
      ],
    })
    const { nest, category, article } = res
    if (!nest.srl)
    {
      throw new ServiceError('Not found data.', {
        status: 204,
      })
    }
    // set response
    response = Response.json({
      message: 'Complete get nest data.',
      nest: nest ? {
        srl: nest.srl,
        name: nest.name,
      } : null,
      category: (category?.index?.length > 0) ? category.index.map(filteringCategory) : [],
      article: (article?.index?.length > 0) ? {
        total: article.total || 0,
        index: article.index.map(filteringArticle),
      } : {
        total: 0,
        index: [],
      },
      assets: {
        page,
        size: apiAssets.size,
      },
    })
  }
  catch (e)
  {
    response = catchResponse(e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  // return response
  return response
}

export default apiNest
