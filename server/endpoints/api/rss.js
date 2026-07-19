import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { getQuery } from '../../libs/util.js'
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
    const query = getQuery(req.url)
    const page = Number(query.page || 1)
    // get data from api
    const res = await requestApi('/article/', {
      query: {
        app: apiAssets.appSrl,
        page,
        size: apiAssets.size,
        order: 'a.regdate DESC, a.srl DESC',
        mode: 'public',
        mod: 'nest,category',
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
        content: parsingContent(o.content, { safe: true }),
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
    response = catchResponse(_e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  // return response
  return response
}

export default apiRss
