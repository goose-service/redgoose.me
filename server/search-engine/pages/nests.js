import { getEnv } from '../../libs/entry-assets.js'
import { modelNests } from '../../models/nest.js'
import * as error from '../../libs/error.js'
import { ERROR_CODE } from '../../libs/assets.js'
import { createPaginate } from '../../libs/paginate.js'
import navigation from '../../resource/navigation.json' assert { type: 'json' }

export async function pageNests(req, res)
{
  const env = getEnv()
  let result
  let paginate
  let _error
  console.log('PARAMS:', req.params)
  console.log('QUERY:', req.query)
  try
  {
    result = await modelNests({
      nestId: req.params.nestId ? String(req.params.nestId) : undefined,
      categorySrl: req.params.categorySrl ? String(req.params.categorySrl) : undefined,
      page: Number(req.query?.page) > 1 ? Number(req.query?.page) : 1,
    })
    paginate = createPaginate(
      result.articles?.total,
      req.query?.page,
      Number(env.VITE_INDEX_SIZE),
      10,
      req.query
    )
    if (!(result.articles.items?.length > 0))
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
    let options = {
      name: env.VITE_APP_NAME,
      title: `${env.VITE_APP_TITLE} / ${result.nest.title}`,
      description: env.VITE_APP_DESCRIPTION,
      keywords: env.VITE_APP_KEYWORDS,
      host: env.VITE_APP_HOST,
      url: env.VITE_APP_HOST,
      image: `/images/og-redgoose.jpg`,
      navigation,
      nest: {
        ...result.nest,
        id: String(req.params.nestId),
      },
      categories: result.categories,
      categoryName: result.categoryName,
      articles: result.articles?.items,
      paginate,
      error: _error,
    }
    res.render('nests', options)
  }
}
