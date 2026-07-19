import ServiceCookie from '../../classes/ServiceCookie.js'
import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { catchResponse, makeThumbnailPath, parsingContent, getCookieKey } from './_libs.js'

/**
 * article
 * article 데이터 가져오기
 * @return {Promise<Response>}
 */
async function apiArticle(req, _ctx = undefined)
{
  let response

  // trigger request event
  if (_ctx) onRequest(req, _ctx)

  try
  {
    // check srl
    const { srl } = req.params
    if (!(Number(srl) > 0))
    {
      throw new ServiceError('Not found srl.', { status: 204 })
    }

    // cookie
    const cookie = new ServiceCookie(req)
    const cookieHitKey = getCookieKey('hit', srl)
    const cookieStarKey = getCookieKey('star', srl)

    // get article data
    const { article, nest, category } = await requestApi(`/mix/`, {
      method: 'post',
      json: [
        {
          key: 'article',
          url: '/article/{srl}/',
          params: {
            srl,
            app: apiAssets.appSrl,
            mod: cookie.existValue(cookieHitKey) ? '' : 'up-hit',
          },
        },
        {
          key: 'nest',
          url: '/nest/{srl}/',
          if: '{{article.srl}}',
          params: {
            srl: '{{article.nest_srl}}',
            fields: 'srl,name',
          },
        },
        {
          key: 'category',
          url: '/category/{srl}/',
          if: '{{article.srl}}',
          params: {
            srl: '{{article.category_srl}}',
            fields: 'srl,name',
          },
        },
      ],
    })

    // check app srl
    if (nest?.app_srl !== apiAssets.appSrl)
    {
      throw new ServiceError('Not found data.', { status: 204 })
    }

    // check response
    if (!article)
    {
      throw new ServiceError('Not found article.', { status: 204 })
    }

    // update cookie
    cookie.setValue(cookieHitKey, 1)

    // set response
    response = Response.json({
      message: 'Complete get article data.',
      data: {
        srl: article.srl,
        title: article.title,
        nestName: nest?.name,
        categoryName: category?.name,
        content: parsingContent(article.content),
        image: makeThumbnailPath(article.json?.thumbnail),
        hit: article.hit,
        star: article.star,
        regdate: article.created_at,
        usedUpStar: cookie.existValue(cookieStarKey),
      },
    })
  }
  catch (_e)
  {
    response = catchResponse(_e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  return response
}

export default apiArticle
