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
  // for api
  ...endpointApi,
  // for rss
  ...endpointRss,
  // sear
  ...endpointService,
  // statics
  ...endpointStatics,
}

// TODO: 개발모드에서는 vite를 통하여 클라이언트를 우선으로 서빙된다.
// TODO: 프로덕션 모드에서는 dist 디렉토리로 전부 서빙된다.
// TODO: 하지만 api, rss, 검색엔진 경로라면 별도의 라우터로 서빙된다.

// run server
const server = serve({
  development: _server.dev,
  port: _server.port,
  hostname: _server.host,
  routes,
  // fetch(req, ctx) {
  //   // return new Response('Page not found.', { status: 404 })
  //   return new Response(`TEST ROUTES\n${req.method}\n${req.url}`)
  // }
  error: endpointError,
})

// open server message
openServerMessage(_server.host, _server.port, _server.dev)
