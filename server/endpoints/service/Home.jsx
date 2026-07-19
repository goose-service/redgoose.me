import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { getQuery } from '../../libs/util.js'
import { setResponse, checkingBot, renderIndex, getCanonicalUrl, getErrorStatus } from './_libs.js'
import apiHome from '../api/home.js'
import Layout from './components/Layout.jsx'
import Paginate from './components/Paginate.jsx'
import IndexItem from './components/IndexItem.jsx'
import ErrorScreen from './components/ErrorScreen.jsx'
import Empty from './components/Empty.jsx'

const dev = isDev()

async function Home(req, _ctx)
{
  let response

  // trigger request event
  onRequest(req, _ctx)

  try
  {
    if (checkingBot(req))
    {
      const res = await apiHome(req)
      if (!(res.ok && res.status === 200))
      {
        throw new ServiceError('Failed get api data.', {
          status: res.status,
        })
      }
      const _res = await res.json()
      const query = getQuery(req.url)
      const canonicalUrl = getCanonicalUrl(req)
      const items = {
        body: [
          ..._res.head,
          ..._res.body,
        ],
        random: _res.random,
      }
      response = setResponse((
        <Layout
          _meta={{ 'og:url': canonicalUrl }}
          _link={{ canonical: canonicalUrl }}>
          {(items.body?.length > 0 || items.random?.length > 0) ? (
            <>
              {items.body?.length > 0 && (
                <section class="index-section">
                  <h1>작업물</h1>
                  <ul class="item-list">
                    {items.body.map((item, key) => (
                      <li>
                        <IndexItem {...item}/>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {items.random?.length > 0 && (
                <section class="index-section">
                  <h2>무작위 작업물</h2>
                  <ul class="item-list">
                    {items.random.map((item, key) => (
                      <li>
                        <IndexItem {...item}/>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <Empty/>
          )}
          {_res.total > 0 && (
            <Paginate total={_res.total} page={query.page || 1}/>
          )}
        </Layout>
      ), 200)
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

export default Home
