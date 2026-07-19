import ServiceCookie from '../../classes/ServiceCookie.js'
import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi } from '../../libs/api.js'
import { catchResponse, getCookieKey } from './_libs.js'

/**
 * update star
 * 좋아요 수 올리기
 *
 * @return {Promise<Response>}
 */
async function apiUpdateStar(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    // check srl
    const { srl } = req.params
    if (!(Number(srl) > 0))
    {
      throw new ServiceError('Failed update star.', {
        status: 204,
        text: 'Not found srl.',
      })
    }

    // cookie
    const cookie = new ServiceCookie(req)
    const cookieKey = getCookieKey('star', srl)
    if (cookie.existValue(cookieKey))
    {
      throw new ServiceError('Already used it.', {
        status: 202,
      })
    }

    // update data
    await requestApi(`/article/${srl}/up/`, {
      method: 'patch',
      json: {
        mode: 'star',
        count: 1,
      },
    })

    // save cookie
    cookie.setValue(cookieKey, 1)

    // set response
    response = new Response('Complete update star.')
  }
  catch (e)
  {
    response = catchResponse(e)
  }

  // trigger response event
  onResponse(req, response, ctx)

  return response
}

export default apiUpdateStar
