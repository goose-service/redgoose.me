import { modelArticle, modelArticleUpdateStar } from '../../models/article.js'
import { ERROR_CODE } from '../../libs/assets.js'
import * as error from '../../libs/error.js'

export async function article(req, res)
{
  try
  {
    let srl = Number(req.params.srl)
    let cookieKeyHit = `rg-hit-${srl}`
    let cookieKeyStar = `rg-star-${srl}`
    let updateHit = !(req.cookies[cookieKeyHit] === '1')
    let result = await modelArticle({
      srl: Number(req.params.srl),
      updateHit,
    })
    // set cookie
    if (updateHit)
    {
      res.cookie(cookieKeyHit, 1, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }
    // set star
    result.enableStarButton = Number(req.cookies[cookieKeyStar]) !== 1
    // print result
    res.json(result)
  }
  catch (e)
  {
    error.register(res, e)
  }
}

export async function articleStar(req, res)
{
  try
  {
    let srl = Number(req.params.srl)
    let cookieKey = `rg-star-${srl}`
    if (!(srl > 0))
    {
      throw {
        status: ERROR_CODE.NOT_FOUND,
        message: 'no srl',
      }
    }
    // check cookie
    if (req.cookies[cookieKey] === '1')
    {
      return res.json({
        success: false,
        message: 'Already used it.',
      })
    }
    // set cookie
    res.cookie(cookieKey, 1, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    // update data
    let starCount = await modelArticleUpdateStar({
      srl: Number(req.params.srl),
    })
    res.json({
      success: true,
      star: starCount,
    })
  }
  catch (e)
  {
    error.register(res, e)
  }
}
