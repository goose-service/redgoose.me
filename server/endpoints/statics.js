import ServiceError from '../classes/ServiceError.js'
import { PATH_DIST, NUM_CACHE_MAX_AGE } from '../libs/assets.js'
import { DEFAULT_HEADERS } from '../libs/server.js'

async function statics(req, _ctx)
{
  try
  {
    const url = new URL(req.url)
    const filePath = `${PATH_DIST}${url.pathname}`
    const file = Bun.file(filePath)
    if (await file.exists())
    {
      const raw = await file.bytes()
      return new Response(raw, {
        status: 200,
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': file.type || 'application/octet-stream',
          'Cache-Control': `public, max-age=${NUM_CACHE_MAX_AGE}`,
        },
      })
    }
    else
    {
      throw new ServiceError(`Not found file. path: "${filePath}"`, {
        status: 404,
      })
    }
  }
  catch (e)
  {
    return new Response('File not found.', {
      status: 404,
      text: e.message,
    })
  }
}

export default {
  '/*': statics,
}
