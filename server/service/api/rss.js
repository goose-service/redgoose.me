import { modelRss } from '../../models/rss.js'
import * as error from '../../libs/error.js'

export async function rss(req, res)
{
  try
  {
    let result = await modelRss()
    res.json(result)
  }
  catch (e)
  {
    error.register(res, e)
  }
}
