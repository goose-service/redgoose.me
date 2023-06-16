import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'

function filteringArticles({ src, host })
{
  return src.map(o => {
    return {
      srl: o.srl,
      title: o.title,
      date: o.order,
      image: o.json?.thumbnail?.path ? `${host}/${o.json.thumbnail.path}` : null,
    }
  })
}

export async function modelNests({ nestId, categorySrl, page })
{
  let result = {
    nest: {
      srl: null,
      title: null,
    },
    categories: [],
    articles: {
      total: 0,
      items: [],
    },
  }
  const env = getEnv()
  const size = Number(env.VITE_INDEX_SIZE || 24)
  let nest = await instance(`/nests/id/${nestId}/`, {
    query: {
      app: env.VITE_APP_SRL,
      field: 'srl,name',
    },
  })
  // check nest
  if (!(nest.success && nest.data?.srl))
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found nest',
    }
  }
  // get categories and articles
  let [ categories, articles ] = await Promise.all([
    instance('/categories/', {
      query: {
        module: 'article',
        field: 'srl,name',
        target: nest.data.srl,
        ext_field: 'count,all',
        order: 'turn',
      },
    }),
    instance('/articles/', {
      query: {
        field: 'srl,nest_srl,category_srl,title,`order`,json',
        app: env.VITE_APP_SRL,
        nest: nest.data.srl,
        category: categorySrl,
        order: '`order` desc,`srl` desc',
        size,
        page,
      },
    })
  ])
  // check articles
  if (!articles.success)
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found articles',
    }
  }
  // set nest
  result.nest.srl = nest.data.srl
  result.nest.title = nest.data.name
  // set categories
  result.categories = categories.data?.index
  let isActive = false
  for (let i=0; i<result.categories.length; i++)
  {
    if (Number(categorySrl) === result.categories[i].srl)
    {
      result.categories[i].active = true
      isActive = true
      result.categoryName = result.categories[i].name
    }
    else
    {
      result.categories[i].active = false
    }
  }
  if (!isActive && result.categories.length > 0)
  {
    result.categories[0].active = true
    result.categoryName = result.categories[0].name
  }
  // set articles
  result.articles.total = articles.data?.total || 0
  result.articles.items = articles.data?.index?.length > 0 ? filteringArticles({
    src: articles.data.index,
    host: env.VITE_API_URL,
  }) : []
  return result
}

export async function modelNestsArticles({ nestSrl, categorySrl, page })
{
  let result = {
    total: 0,
    items: [],
  }
  const env = getEnv()
  const size = Number(env.VITE_INDEX_SIZE || 24)
  let articles = await instance('/articles/', {
    query: {
      field: 'srl,nest_srl,category_srl,title,`order`,json',
      nest: nestSrl,
      category: categorySrl,
      order: '`order` desc,`srl` desc',
      size,
      page,
    },
  })
  // check articles
  if (!articles.success)
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found articles',
    }
  }
  result.total = articles.data?.total || 0
  result.items = articles.data?.index?.length > 0 ? filteringArticles({
    src: articles.data.index,
    host: env.VITE_API_URL,
  }) : []
  return result
}
