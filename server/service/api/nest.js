import { modelNests, modelNestsArticles } from '../../models/nest.js'
import * as error from '../../libs/error.js'

export async function nest(req, res)
{
  try
  {
    let result = await modelNests({
      nestId: req.params.nestId ? String(req.params.nestId) : undefined,
      categorySrl: req.query.categorySrl ? String(req.query.categorySrl) : undefined,
      page: Number(req.query?.page) > 1 ? Number(req.query?.page) : 1,
    })
    res.json(result)
  }
  catch (e)
  {
    error.register(res, e)
  }
}

export async function nestArticles(req, res)
{
  try
  {
    let result = await modelNestsArticles({
      nestSrl: req.params.nestSrl ? Number(req.params.nestSrl) : undefined,
      categorySrl: req.query.categorySrl ? String(req.query.categorySrl) : undefined,
      page: Number(req.query?.page) > 1 ? Number(req.query?.page) : 1,
    })
    res.json(result)
  }
  catch (e)
  {
    error.register(res, e)
  }
}
