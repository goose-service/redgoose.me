import { isDev, openServerMessage } from './libs/server.js'
import endpointApi from './endpoints/api/index.js'
import endpointRss from './endpoints/rss/index.js'
import endpointSearchEngine from './endpoints/search-engine/index.js'
import endpointStatics from './endpoints/statics.js'
import endpointError from './endpoints/error.js'

const { serve } = Bun
const { HOST, PORT, SEARCH_ENGINE } = Bun.env
const useSearchEngine = SEARCH_ENGINE === 'true'
const server = {
  host: HOST,
  port: Number(PORT),
  dev: isDev(),
}

// set routes
const routes = {
  ...endpointApi,
  ...endpointRss,
  // for production
  ...(!server.dev && endpointStatics),
  // for search engine
  ...(useSearchEngine && endpointSearchEngine),
}

// run server
serve({
  development: server.dev,
  port: server.port,
  hostname: server.host,
  routes,
  // fetch(req, ctx) {
  //   // return new Response('Page not found.', { status: 404 })
  //   return new Response(`TEST ROUTES\n${req.method}\n${req.url}`)
  // }
  error: endpointError,
})

// open server message
openServerMessage(server.host, server.port, server.dev)
