import * as url from 'url'
import { getEnv } from '../../libs/entry-assets.js'
import { modelHome } from '../../models/home.js'
import * as error from '../../libs/error.js'
import { ERROR_CODE } from '../../libs/assets.js'
import { createPaginate } from '../../libs/paginate.js'
import { convertUrl } from '../../libs/text.js'
import navigation from '../../resource/navigation.json'

export async function pageHome(req, res)
{
  const env = getEnv()
  const _url = url.parse(req.url)
  let result
  let paginate
  let _error
  try
  {
    result = await modelHome({
      page: Number(req.query?.page) > 1 ? Number(req.query?.page) : 1,
    })
    paginate = createPaginate(
      result.total,
      req.query?.page,
      Number(env.VITE_INDEX_SIZE),
      10,
      convertUrl(_url.pathname),
      req.query
    )
    if (!(result.headItems?.length > 0 || result.bodyItems?.length > 0))
    {
      throw new Error(ERROR_CODE.NO_ITEMS)
    }
  }
  catch (e)
  {
    _error = error.register(res, e)
  }
  finally
  {
    res.render('home', {
      name: env.VITE_APP_NAME,
      title: env.VITE_APP_TITLE,
      bodyTitle: env.VITE_APP_TITLE,
      description: env.VITE_APP_DESCRIPTION,
      keywords: env.VITE_APP_KEYWORDS,
      host: env.VITE_APP_HOST,
      url: `${env.VITE_APP_HOST}${_url.href}`,
      image: `/images/og-redgoose.jpg`,
      navigation,
      randomItems: result?.randomItems || [],
      bodyItems: result ? [
        ...result.headItems,
        ...result.bodyItems,
      ] : [],
      paginate,
      error: _error,
    })
  }
}
