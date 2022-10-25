import * as url from 'url'
import { getEnv } from '../../libs/entry-assets.js'
import { modelArticle } from '../../models/article.js'
import * as error from '../../libs/error.js'
import { ERROR_CODE } from '../../libs/assets.js'
import navigation from '../../resource/navigation.json' assert { type: 'json' }

export async function pageArticle(req, res)
{
  const env = getEnv()
  const _url = url.parse(req.url)
  let srl = Number(req.params.srl)
  let cookieKeyHit = `rg-hit-${srl}`
  let updateHit = !(req.cookies[cookieKeyHit] === '1')
  let result
  let _error
  try
  {
    result = await modelArticle({
      srl: Number(req.params.srl),
      updateHit,
    })
    if (!result?.srl)
    {
      throw new Error(ERROR_CODE.NO_ITEMS)
    }
    // set cookie
    if (updateHit)
    {
      res.cookie(cookieKeyHit, 1, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }
    // console.log(result)
  }
  catch (e)
  {
    _error = error.register(res, e)
  }
  finally
  {
    // set title
    let title = env.VITE_APP_TITLE
    if (result?.title) title = `${result.title} on ${title}`
    // set options
    let options = {
      name: env.VITE_APP_NAME,
      title,
      bodyTitle: env.VITE_APP_TITLE,
      description: env.VITE_APP_DESCRIPTION,
      keywords: env.VITE_APP_KEYWORDS,
      host: env.VITE_APP_HOST,
      url: `${env.VITE_APP_HOST}${_url.href}`,
      navigation,
      articleTitle: result?.title || undefined,
      nest: result?.nestName || undefined,
      category: result?.categoryName || undefined,
      image: result?.image || `/images/og-redgoose.jpg`,
      content: result?.content || undefined,
      srl: result?.srl || undefined,
      hit: result?.hit || 0,
      star: result?.star || 0,
      error: _error,
    }
    // render
    res.render('article', options)
  }
}
