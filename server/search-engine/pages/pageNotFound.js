import * as url from 'url'
import { getEnv } from '../../libs/entry-assets.js'
import * as error from '../../libs/error.js'
import { ERROR_CODE } from '../../libs/assets.js'
import navigation from '../../resource/navigation.json' assert { type: 'json' }

export async function pageNotFound(req, res)
{
  const env = getEnv()
  const _url = url.parse(req.url)
  const _error = error.register(res, new Error(ERROR_CODE.NOT_FOUND))
  res.render('pageNotFound', {
    name: env.VITE_APP_NAME,
    title: env.VITE_APP_TITLE,
    description: env.VITE_APP_DESCRIPTION,
    keywords: env.VITE_APP_KEYWORDS,
    host: env.VITE_APP_HOST,
    url: `${env.VITE_APP_HOST}${_url.href}`,
    image: `/images/og-redgoose.jpg`,
    navigation,
    error: _error,
  })
}
