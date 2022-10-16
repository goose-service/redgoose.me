import { getEnv } from '../../libs/entry-assets.js'

export async function rss(req, res)
{
  let result = {}
  const env = getEnv()
  result.name = '/rss'
  console.log(Object.keys(req.query))
  console.log(req.query)
  res.json(result)
}
