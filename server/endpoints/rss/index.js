import ServiceError from '../../classes/ServiceError.js'
import { isDev, onRequest, onResponse, printMessage } from '../../libs/server.js'
import { html } from '../../classes/Meta.js'
import apiRss from '../api/rss.js'

const { API_CLIENT_URL } = Bun.env
const dev = isDev()

export default {
  '/rss/': async (req, _ctx) => {
    let response

    // trigger request event
    onRequest(req, _ctx)

    try
    {
      // get data from api
      const res = await apiRss(req)
      if (!(res.ok && res.status === 200))
      {
        throw new ServiceError('Failed get api data.', {
          status: res.status,
        })
      }
      const _res = await res.json()
      // set information
      let title = html.title
      let description = html.meta.description
      let url = html.meta['og:url']
      let date = (new Date()).getFullYear()
      let lang = html.meta['og:locale'].replace('_', '-')
      let items = _res.index.map(o => {
        let str = `    <item>\n`
        str += `      <title><![CDATA[ ${o.title} ]]></title>\n`
        str += `      <link>${API_CLIENT_URL}/article/${o.srl}/</link>\n`
        str += `      <guid>${API_CLIENT_URL}/article/${o.srl}/</guid>\n`
        str += `      <description><![CDATA[ ${o.content} ]]></description>\n`
        str += `      <pubDate>${new Date(o.date)}</pubDate>\n`
        str += `    </item>`
        return str
      })

      // set xml
      const xml = `<?xml version="1.0" encoding="utf-8"?>

<rss version="2.0">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${url}</link>
    <language>${lang}</language>
    <copyright>Copyright 2013-${date} GoOSe. All right reserved.</copyright>
    <webMaster>scripter@me.com (GoOSe)</webMaster>
    <!-- Data index -->
${items.join('\n')}
  </channel>
</rss>`

      // set response
      response = new Response(xml, {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
        },
      })
    }
    catch (_e)
    {
      if (dev) printMessage('error', `[${_e.status || 500}] ${_e.message}`)
      response = new Response(_e.message, {
        status: _e.status,
      })
    }

    // trigger response event
    onResponse(req, response, _ctx)

    return response
  },
}
