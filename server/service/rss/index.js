import { Router } from 'express'
import { getEnv } from '../../libs/entry-assets.js'
import * as models from '../../models/index.js'
import { modelRss } from '../../models/rss.js'
import * as error from '../../libs/error.js'

// setup model api
models.setup()

const router = Router()

router.get('/', async function(req, res) {
  try
  {
    const env = getEnv()
    const head = '<?xml version="1.0" encoding="utf-8"?>'

    // get items
    const apiRes = await modelRss()

    // set information
    let title = env.VITE_APP_NAME
    let description = env.VITE_APP_DESCRIPTION
    let url = env.VITE_APP_HOST
    let date = (new Date()).getFullYear()
    let lang = env.VITE_APP_LANG
    let items = apiRes.items.map((o) => {
      return `<item>
    <title><![CDATA[ ${o.title} ]]></title>
    <link>${url}/article/${o.srl}/</link>
    <guid>${url}/article/${o.srl}/</guid>
    <description><![CDATA[ ${o.content} ]]></description>
    <pubDate>${o.date}</pubDate>
</item>`
    })

    // set xml
    const xml = `<rss version="2.0">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${url}</link>
    <language>${lang}</language>
    <copyright>Copyright 2013-${date} redgoose. All right reserved.</copyright>
    <webMaster>scripter@me.com (redgoose)</webMaster>
    ${items.join('\n    ')}
  </channel>
</rss>`

    // response
    res
      .type('application/xml')
      .status(200)
      .send(`${head}\n\n${xml}`)
    }
  catch (e)
  {
    let err = error.register(res, e)
    res.status(err.status).send(err.message)
  }
})

export default router
