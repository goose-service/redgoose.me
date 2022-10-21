import { Router } from 'express'
import { home } from './home.js'
import { nest, nestArticles } from './nest.js'
import { article, articleStar } from './article.js'
import { rss } from './rss.js'
import * as models from '../../models/index.js'

// setup model api
models.setup()

// set roues
const router = Router()
router.get('/', home)
router.get('/nests/:nestId/', nest)
router.get('/nests/:nestSrl(\\d+)/articles/', nestArticles)
router.get('/article/:srl/', article)
router.post('/article/:srl/star/', articleStar)
router.get('/rss/', rss)

export default router
