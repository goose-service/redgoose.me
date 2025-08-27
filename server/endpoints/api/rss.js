import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { catchResponse, makeThumbnailPath, parsingContent } from './_libs.js'

/**
 * RSS
 * RSS 피드
 *
 * @return {Promise<Response>}
 */
async function apiRss(req, _ctx = undefined)
{
  let response

  // trigger request event
  if (_ctx) onRequest(req, _ctx)

  try
  {
    // get data from api
    const res = await requestApi('/article/', {
      query: {
        app: apiAssets.appSrl,
        mode: 'public',
        size: apiAssets.size,
        order: 'regdate',
        sort: 'desc',
      },
    })
    if (!(res?.data?.index?.length > 0))
    {
      throw new ServiceError('Not found article.', {
        status: 204,
      })
    }
    // set items
    const _index = res.data.index.map(o => {
      return {
        srl: o.srl,
        title: o.title,
        date: o.regdate,
        image: makeThumbnailPath(o.json?.thumbnail),
        content: parsingContent(o.content),
      }
    })
    // set response
    response = Response.json({
      message: 'Complete to get RSS data.',
      total: res.data.total,
      index: _index,
    })
  }
  catch (_e)
  {
    response = catchResponse(e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  // return response
  return response
}

export default apiRss
