import { isDev, openServerMessage } from './libs/server.js'
import { html } from './classes/Meta.js'
import endpointApi from './endpoints/api/index.js'
import endpointRss from './endpoints/rss/index.js'
import endpointService from './endpoints/service/index.js'
import endpointStatics from './endpoints/statics.js'
import endpointError from './endpoints/error.js'

const { serve } = Bun
const { HOST, PORT } = Bun.env
const _server = {
  host: HOST,
  port: Number(PORT),
  dev: isDev(),
}

// setup meta
await html.setup()

// set routes
let routes = {
  // api
  ...endpointApi,
  // rss
  ...endpointRss,
  // production service and search engine
  ...endpointService,
  // serving static files
  ...endpointStatics,
}

// run server
const server = serve({
  development: _server.dev,
  port: _server.port,
  hostname: _server.host,
  routes,
  error: endpointError,
})

// open server message
openServerMessage(_server.host, _server.port, _server.dev)
