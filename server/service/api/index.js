import { Router } from 'express'
import { getEnv } from '../../libs/entry-assets.js'

const router = Router()
const env = getEnv()

router.get('/', async (req, res) => {
  console.log(Object.keys(req.query))
  console.log(req.query)
  res.end('api: /api')
})

router.get('/nests/:nestId/', async (req, res) => {
  console.group('/nests/:nestId/')
  console.log(Object.keys(req))
  console.log('URL:', req.url)
  console.log('PARAMS:', req.params)
  console.log('QUERY:', req.query)
  console.log('ROUTE:', req.route)
  console.groupEnd()
  res.end('api: /nests/visual')
})

router.get('/article/:srl/', async (req, res) => {
  console.log('PARAMS:', req.params)
  res.end('api: /article/123/')
})

router.post('/article/:srl/onLike/', async (req, res) => {
  console.log('PARAMS:', req.params)
  res.end('api: /article/123/onLike/')
})

router.get('/rss/', async (req, res) => {
  res.end('api: /rss')
})

export default router
