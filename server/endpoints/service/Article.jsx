import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { setResponse, checkingBot, renderIndex, contentToDescription, getCanonicalUrl, getErrorStatus, formatDate } from './_libs.js'
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
      const { data: article } = await res.json()
      if (!article) throw new ServiceError('Not found article data.', { status: 404 })
      const _description = contentToDescription(article.content)
      const _title = `${article.title} 🪴 ${html.title}`
      const canonicalUrl = getCanonicalUrl(req)
      const _meta = {
        'description': _description,
        'og:title': _title,
        'og:description': _description,
        'og:url': canonicalUrl,
        'og:image': article.image || html.meta['og:image'],
        'og:type': 'article',
      }
      response = setResponse((
        <Layout title={_title} _meta={_meta} _link={{ canonical: canonicalUrl }}>
          {article ? (
            <article class="page">
              <header class="page-header">
                <h1>{article.title}</h1>
                <dl>
                  {article.nestName && (
                    <>
                      <dt>둥지</dt>
                      <dd>{article.nestName}</dd>
                    </>
                  )}
                  {article.categoryName && (
                    <>
                      <dt>분류</dt>
                      <dd>{article.categoryName}</dd>
                    </>
                  )}
                  {article.regdate && (
                    <>
                      <dt>등록일</dt>
                      <dd><time datetime={article.regdate}>{formatDate(article.regdate)}</time></dd>
                    </>
                  )}
                </dl>
              </header>
              <section class="content" aria-label="본문">
                {article.content}
              </section>
              <footer class="article-footer">
                <h2>메타데이터</h2>
                <dl>
                  <dt>조회수</dt>
                  <dd>{article.hit}</dd>
                  <dt>좋아요</dt>
                  <dd>{article.star}</dd>
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
    ), getErrorStatus(_e.status))
  }

  // trigger response event
  onResponse(req, response, _ctx)

  return response
}

export default Article
