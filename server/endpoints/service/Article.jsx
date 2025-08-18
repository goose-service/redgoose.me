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
      const _description = contentToDescription(_res.content)
      let _title = `${_res.title} 🪴 ${html.title}`
      let _meta = {
        'description': _description,
        'og:title': `${_res.title} 🪴 ${html.title}`,
        'og:description': _description,
        'og:url': `${html.meta['og:url']}/article/${srl}/`,
        'og:image': _res.image,
      }
      let _link = {}
      response = setResponse((
        <Layout title={_title} _meta={_meta} _link={_link}>
          {_res ? (
            <article>
              <h1>{_res.title}</h1>
              <header>
                <h2>아티클 정보</h2>
                <dl>
                  {_res.nestName && (
                    <>
                      <dt>둥지</dt>
                      <dd>{_res.nestName}</dd>
                    </>
                  )}
                  {_res.categoryName && (
                    <>
                      <dt>분류</dt>
                      <dd>{_res.categoryName}</dd>
                    </>
                  )}
                  {_res.regdate && (
                    <>
                      <dt>등록일</dt>
                      <dd>{_res.regdate}</dd>
                    </>
                  )}
                </dl>
              </header>
              <article class="content">
                {_res.content}
              </article>
              <footer>
                <h2>메타데이터</h2>
                <dl>
                  <dt>조회수</dt>
                  <dd>{_res.hit}</dd>
                  <dt>좋아요</dt>
                  <dd>{_res.star}</dd>
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
