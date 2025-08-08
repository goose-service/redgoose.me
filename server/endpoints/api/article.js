import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { requestApi } from '../../libs/api.js'
import { makeThumbnailPath, parsingContent } from './_libs.js'

const dev = isDev()

/**
 * article
 * article 데이터 가져오기
 *
 * @return {Promise<Response>}
 */
async function article(req, ctx)
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
      throw new ServiceError('Not found srl.', {
        status: 204,
      })
    }
    // get article data
    const { article, nest, category } = await requestApi(`/mix/`, {
      method: 'post',
      json: [
        {
          key: 'article',
          url: '/article/{srl}/',
          params: {
            srl,
            mod: 'up-hit', // TODO: 쿠키로 조회수 업데이트 구현하기
          },
        },
        {
          key: 'nest',
          url: '/nest/{srl}/',
          params: {
            srl: '{{article.data.nest_srl}}',
            fields: 'srl,name',
          },
        },
        {
          key: 'category',
          url: '/category/{srl}/',
          params: {
            srl: '{{article.data.category_srl}}',
            fields: 'srl,name',
          },
        },
      ],
    })
    // check response
    if (!article?.data)
    {
      throw new ServiceError('Not found data.', {
        status: 204,
      })
    }
    // set response
    response = Response.json({
      message: 'Complete get article data.',
      data: {
        srl: article.data.srl,
        title: article.data.title,
        nestName: nest?.data?.name,
        categoryName: category?.data?.name,
        content: parsingContent(article.data.content),
        image: makeThumbnailPath(article.data.json?.thumbnail),
        hit: article.data.hit,
        star: article.data.star,
      },
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Failed get data.', { status: e.status || 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  return response
}

export default article
