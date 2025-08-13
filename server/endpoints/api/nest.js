import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { getQuery } from '../../libs/util.js'
import { catchResponse, filteringArticle } from './_libs.js'

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
           },
        },
        {
          key: 'category',
          url: '/category/',
          params: {
            module: 'nest',
            module_srl: '{{nest.data.srl}}',
            order: 'turn',
            sort: 'asc',
            unlimited: '1',
            mod: 'count,all',
          },
        },
        {
          key: 'article',
          url: '/article/',
          params: {
            fields: apiAssets.articleIndexFields,
            app_srl: apiAssets.appSrl,
            nest_srl: '{{nest.data.srl}}',
            category_srl: category_srl || undefined,
            size: apiAssets.size,
            order: 'regdate',
            sort: 'desc',
            page,
            mod: 'nest,category',
          },
        },
      ],
    })
    const { nest, category, article } = res
    if (!(nest?.data && article?.data))
    {
      throw new ServiceError('Not found article.', {
        status: 204,
      })
    }
    // set response
    response = Response.json({
      message: 'Complete get nest data.',
      nest: {
        srl: nest.data.srl,
        name: nest.data.name,
      },
      category: (category?.data?.index?.length > 0) ? category.data.index.map(o => {
        let category, label
        switch (o.name)
        {
          case 'all':
            category = undefined
            label = 'All'
            break
          default:
            category = String(o.srl)
            label = o.name
            break
        }
        return {
          srl: category,
          name: label,
          count: o.count,
        }
      }) : [],
      article: {
        total: article.data.total || 0,
        index: (article.data.index?.length > 0) ? article.data.index.map(filteringArticle) : [],
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
