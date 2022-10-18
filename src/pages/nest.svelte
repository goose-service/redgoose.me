{#if loading}
  <Loading full={true} move={true}/>
{:else}
  <article class="nest">
    {#if nest?.title}
      <header class="nest__header">
        <h1>
          <span>{nest.title}</span>
        </h1>
      </header>
    {/if}
    {#if categories?.length > 0}
      <div class="nest__categories">
        <Categories
          items={_categories}
          active={route.params.category || ''}/>
      </div>
    {/if}
    <div class="nest__body">
      {#if articles?.length > 0}
        <div class="nest__items">
          <Items>
            {#each articles as o, key}
              <Item
                srl={o.srl}
                title={o.title}
                image={o.image}
                description={o.date}/>
            {/each}
          </Items>
        </div>
      {:else}
        <Empty/>
      {/if}
      {#if totalArticles > 0}
        <div class="nest__paginate">
          <Paginate
            page={route.query.page}
            total={totalArticles}
            size={10}
            url="./"
            query={router.location.query.get()}/>
        </div>
      {/if}
    </div>
  </article>
{/if}

<script lang="ts">
import { router } from 'tinro'
import { $fetch as fetch } from 'ohmyfetch'
import { error } from '../store'
import { sleep } from '../libs/util'
import Empty from '../components/pages/index/empty.svelte'
import Categories from '../components/pages/index/categories.svelte'
import Items from '../components/pages/index/items.svelte'
import Item from '../components/pages/index/item.svelte'
import Paginate from '../components/paginate.svelte'
import Loading from '../components/loading/loading-page.svelte'

export let route: Route
let currentRoute
let nest: Nest = undefined
let categories: Category[] = []
let totalArticles: number = 0
let articles: Article[] = []
let loading: boolean = false

$: if (currentRoute?.params?.nest !== route.params?.nest) updateNest()
$: if (currentRoute?.params?.category !== route.params.category) updateCategory()
$: if (currentRoute?.query.page !== route.query.page) updatePage()

$: _categories = categories.map(o => {
  return {
    srl: o.srl ? String(o.srl) : '',
    label: o.name,
    count: o.count_article,
    link: o.srl ? `/nest/${currentRoute.params?.nest}/${o.srl}/` : `/nest/${currentRoute.params?.nest}/`,
  }
})

async function updateNest(): Promise<void>
{
  try
  {
    currentRoute = route
    loading = true
    let query: Query = {}
    if (route.params.category)
    {
      query.categorySrl = route.params.category || ''
    }
    if (Number(route.query?.page) > 1)
    {
      query.page = Number(route.query?.page)
    }
    let res: Response = await fetch(`/api/nests/${route.params?.nest}/`, {
      responseType: 'json',
      query,
    })
    nest = res.nest
    categories = res.categories
    totalArticles = res.articles?.total || 0
    articles = res.articles.items
    loading = false
  }
  catch (e)
  {
    const { status, message } = e.response?._data
    error.update(() => ({
      status: status || 500,
      message: message || 'Unknown error',
    }))
    loading = false
  }
}

async function updateCategory(): Promise<void>
{
  currentRoute = route
  loading = true
  let query: Query = {}
  if (route.params.category)
  {
    query.categorySrl = route.params.category || ''
  }
  if (Number(route.query?.page) > 1)
  {
    query.page = Number(route.query?.page)
  }
  console.log('fetchCategory()', query)
  // TODO: /api/nests/{ID}/articles/?category={CATEGORY} 요청
  await sleep(1000)
  loading = false
}

async function updatePage(): Promise<void>
{
  currentRoute = route
  loading = true
  console.log('updatePage()')
  // TODO: /api/nests/{ID}/articles/?category={CATEGORY}&page={PAGE} 요청
  await sleep(1000)
  loading = false
}
</script>

<style src="./nest.scss" lang="scss"></style>
