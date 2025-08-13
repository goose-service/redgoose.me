import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { getQuery } from '../../libs/util.js'
import { setResponse, checkingBot, renderIndex, getCategoryName } from './_libs.js'
import apiNest from '../api/nest.js'
import Layout from './components/Layout.jsx'
import Category from './components/Category.jsx'
import IndexItem from './components/IndexItem.jsx'
import Paginate from './components/Paginate.jsx'
import ErrorScreen from './components/ErrorScreen.jsx'
import Empty from './components/Empty.jsx'

const dev = isDev()

async function Nest(req, _ctx)
{
  let response

  // trigger request event
  onRequest(req, _ctx)

  try
  {
    if (checkingBot(req))
    {
      const res = await apiNest(req)
      if (!(res.ok && res.status === 200))
      {
        throw new ServiceError('Failed get api data.', {
          status: res.status,
        })
      }
      const { code, category_srl } = req.params
      const _res = await res.json()
      const query = getQuery(req.url)
      const categoryName = getCategoryName(_res.category, category_srl)
      response = setResponse((
        <Layout>
          <article>
            <h1>{_res.nest.name}{categoryName ? ` / ${categoryName}` : ''}</h1>
            <Category
              items={_res.category}
              basePath={`/nest/${code}`}/>
            {_res.article?.index?.length > 0 ? (
              <ul>
                {_res.article.index.map((item, key) => (
                  <li>
                    <IndexItem {...item}/>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty/>
            )}
            {_res.article.total > 0 && (
              <Paginate total={_res.article.total} page={query.page || 1}/>
            )}
          </article>
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

export default Nest
