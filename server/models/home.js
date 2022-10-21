import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'
import { dateFormat } from '../libs/date.js'

function filteringArticles({ src, host })
{
  return src.map(o => {
    return {
      srl: o.srl,
      title: o.title,
      date: o.order,
      image: o.json?.thumbnail?.path ? `${host}/${o.json.thumbnail.path}` : null,
      nest: o.nest_name || null,
      category: o.category_name || null,
    }
  })
}

export async function modelHome({ page })
{
  let result = {
    total: 0,
    headItems: [],
    bodyItems: [],
    randomItems: [],
  }
  const env = getEnv()
  const size = Number(env.VITE_INDEX_SIZE || 24)
  const baseQuery = {
    app: env.VITE_APP_SRL,
    field: 'srl,nest_srl,category_srl,title,`order`,json',
    ext_field: 'category_name,nest_name',
  }
  // get articles and random articles
  let [ items, random ] = await Promise.all([
    instance('/articles/', {
      query: {
        ...baseQuery,
        order: '`order` desc, `srl` desc',
        limit: `${(page-1)*size},${size}`,
      },
    }),
    page === 1 && instance('/articles/', {
      query: {
        ...baseQuery,
        size: 4,
        duration: `old,order,1 week`,
        random: dateFormat(new Date(), '{yyyy}{MM}{dd}'),
      }
    }),
  ].filter(Boolean))
  // filtering articles
  if (items?.success)
  {
    result.total = items.data?.total || 0
    let filteredItems = items.data?.index.length > 0 ? filteringArticles({
      src: items.data.index,
      host: env.VITE_API_URL,
    }) : []
    if (page === 1)
    {
      result.headItems = filteredItems.slice(0, 4)
      result.bodyItems = filteredItems.slice(4)
    }
    else
    {
      result.bodyItems = filteredItems
    }
  }
  else
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found item',
    }
  }
  // filtering random articles
  if (random?.success)
  {
    result.randomItems = random.data?.index.length > 0 ? filteringArticles({
      src: random.data.index,
      host: env.VITE_API_URL,
    }) : []
  }
  // return
  return result
}
