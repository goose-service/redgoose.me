import api from './api/index.js'
import rss from './rss/index.js'

/**
 * server
 *
 * @param {Express} app
 */
function server(app)
{
  app.use('/api', api)
  app.use('/rss', rss)
}

export default server
