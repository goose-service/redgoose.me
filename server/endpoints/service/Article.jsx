import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { setResponse, checkingBot, renderIndex, contentToDescription } from './_libs.js'
import { html } from '../../classes/Meta.js'
import apiArticle from '../api/article.js'
import Layout from './components/Layout.jsx'
import ErrorScreen from './components/ErrorScreen.jsx'
import Empty from './components/Empty.jsx'

const dev = isDev()

async function Article(req, _ctx)
{
  let response

  // trigger request event
  onRequest(req, _ctx)

  try
  {
    if (checkingBot(req))
    {
      const res = await apiArticle(req)
      if (!(res.ok && res.status === 200))
      {
        throw new ServiceError('Failed get api data.', {
          status: res.status,
        })
      }
      const { srl } = req.params
      const _res = await res.json()
      const _description = contentToDescription(_res.data.content)
      let _title = `${_res.data.title} 🪴 ${html.title}`
      let _meta = {
        'description': _description,
        'og:title': `${_res.data.title} 🪴 ${html.title}`,
        'og:description': _description,
        'og:url': `${html.meta['og:url']}/article/${srl}/`,
        'og:image': _res.data.image,
      }
      let _link = {}
      response = setResponse((
        <Layout title={_title} _meta={_meta} _link={_link}>
          {_res.data ? (
            <article>
              <h1>{_res.data.title}</h1>
              <header>
                <h2>아티클 정보</h2>
                <dl>
                  {_res.data.nestName && (
                    <>
                      <dt>둥지</dt>
                      <dd>{_res.data.nestName}</dd>
                    </>
                  )}
                  {_res.data.categoryName && (
                    <>
                      <dt>분류</dt>
                      <dd>{_res.data.categoryName}</dd>
                    </>
                  )}
                </dl>
              </header>
              <article class="content">
                {_res.data.content}
              </article>
              <footer>
                <h2>메타데이터</h2>
                <dl>
                  <dt>조회수</dt>
                  <dd>{_res.data.hit}</dd>
                  <dt>좋아요</dt>
                  <dd>{_res.data.star}</dd>
                </dl>
              </footer>
            </article>
          ) : (
            <Empty/>
          )}
        </Layout>
      ))
    }
    else
    {
      response = await renderIndex(req)
    }
  }
  catch (_e)
  {
    if (dev) printMessage('error', `[${_e.status || 500}] ${_e.message}`)
    response = setResponse((
      <ErrorScreen code={_e.status} message="Failed get data."/>
    ))
  }

  // trigger response event
  onResponse(req, response, _ctx)

  return response
}

export default Article
