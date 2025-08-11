import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { setResponse, checkingBot, renderIndex } from './_libs.js'
import Layout from './components/Layout.jsx'
import ErrorScreen from './components/ErrorScreen.jsx'

const dev = isDev()

async function home(req, _ctx)
{
  let response

  // trigger request event
  onRequest(req, _ctx)

  try
  {
    if (checkingBot(req))
    {
      response = setResponse((
        <Layout>
          <h1>render search-engine page</h1>
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
    if (_e)
    {
      if (dev) printMessage('error', `[${_e.status || 500}] ${_e.message}`)
      response = setResponse((
        <ErrorScreen message="Failed get data."/>
      ), _e.status || 500)
    }
  }

  // trigger response event
  onResponse(req, response, _ctx)

  return response
}

export default home
