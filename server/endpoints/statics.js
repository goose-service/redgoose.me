import ServiceError from '../classes/ServiceError.js'
import { PATH_DIST, NUM_CACHE_MAX_AGE } from '../libs/assets.js'
import { DEFAULT_HEADERS } from '../libs/server.js'
import { checkingFile } from '../libs/util.js'
import { renderIndex } from './service/_libs.js'

const ignorePaths = [
  '/head.json',
]

async function statics(req, _ctx)
{
  try
  {
    const url = new URL(req.url)
    const filePath = `${PATH_DIST}${url.pathname}`
    // check ignore paths
    if (ignorePaths.includes(url.pathname))
    {
      throw new ServiceError('This path is ignored.')
    }
    // load file
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
      if (checkingFile(url.pathname))
      {
        throw new ServiceError(`Not found file. path: "${filePath}"`, {
          status: 404,
        })
      }
      else
      {
        return await renderIndex(req)
      }
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
