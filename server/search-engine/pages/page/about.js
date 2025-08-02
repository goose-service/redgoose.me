import * as url from 'url'
import { getEnv } from '../../../libs/entry-assets.js'
import navigation from '../../../resource/navigation.json'
import content from '../../../resource/about.json'

export async function pageAbout(req, res)
{
  const env = getEnv()
  const _url = url.parse(req.url)
  let options = {
    name: env.VITE_APP_NAME,
    title: `About on ${env.VITE_APP_TITLE}`,
    bodyTitle: env.VITE_APP_TITLE,
    description: env.VITE_APP_DESCRIPTION,
    keywords: env.VITE_APP_KEYWORDS,
    host: env.VITE_APP_HOST,
    url: `${env.VITE_APP_HOST}${_url.href}`,
    image: `/images/og-redgoose.jpg`,
    navigation,
    content,
  }
  res.render('page/about', options)
}
