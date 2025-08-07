import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { getQuery } from '../../libs/util.js'

const { API_CLIENT_URL } = Bun.env
const dev = isDev()

/**
 * articles
 * article 목록 데이터 가져오기
 *
 * @return {Promise<Response>}
 */
async function articles(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    //
  }
  catch (e)
  {
    //
  }

  // trigger response event
  onResponse(req, response, ctx)

  return response
}

export default articles
