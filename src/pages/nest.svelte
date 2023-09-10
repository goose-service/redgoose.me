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
        <div class="nest__empty">
          <Error status={204} message="no articles"/>
        </div>
      {/if}
      {#if totalArticles > 0}
        <div class="nest__paginate">
          <Paginate
            page={route.query.page}
            total={totalArticles}
            size={size}
            url="./"
            query={router.location.query.get()}/>
        </div>
      {/if}
    </div>
  </article>
{/if}

<script>
import { router } from 'tinro'
import { ofetch } from 'ofetch'
import { error } from '../store'
import Error from '../components/error.svelte'
import Categories from '../components/pages/index/categories.svelte'
import Items from '../components/pages/index/items.svelte'
import Item from '../components/pages/index/item.svelte'
import Paginate from '../components/paginate.svelte'
import Loading from '../components/loading/loading-page.svelte'

export let route
let currentRoute
let size = Number(import.meta.env.VITE_INDEX_SIZE)
let nest = undefined
let categories = []
let totalArticles = 0
let articles = []
let loading = false

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

async function updateNest()
{
  try
  {
    currentRoute = route
    loading = true
    let query = {}
    if (route.params.category)
    {
      query.categorySrl = route.params.category || ''
    }
    if (Number(route.query?.page) > 1)
    {
      query.page = Number(route.query?.page)
    }
    let res = await ofetch(`/api/nests/${route.params?.nest}/`, {
      responseType: 'json',
      query,
    })
    nest = res.nest || undefined
    categories = res.categories || []
    totalArticles = res.articles?.total || 0
    articles = res.articles?.items || []
    loading = false
  }
  catch (e)
  {
    const status = e.response?._data?.status || 500
    const message = e.response?._data?.message || 'Unknown error'
    error.update(() => ({ status, message }))
    loading = false
  }
}

async function updateCategory()
{
  try
  {
    currentRoute = route
    loading = true
    let query = {}
    if (route.params.category)
    {
      query.categorySrl = route.params.category || ''
    }
    let res = await ofetch(`/api/nests/${nest.srl}/articles/`, {
      responseType: 'json',
      query,
    })
    totalArticles = res?.total || 0
    articles = res?.items || []
    loading = false
  }
  catch (e)
  {
    const status = e.response?._data?.status || 500
    const message = e.response?._data?.message || 'Unknown error'
    error.update(() => ({ status, message }))
    loading = false
  }
}

async function updatePage()
{
  try
  {
    currentRoute = route
    loading = true
    let query = {}
    if (route.params.category)
    {
      query.categorySrl = route.params.category || ''
    }
    if (Number(route.query?.page) > 1)
    {
      query.page = Number(route.query?.page)
    }
    let res = await ofetch(`/api/nests/${nest.srl}/articles/`, {
      responseType: 'json',
      query,
    })
    totalArticles = res?.total || 0
    articles = res?.items || []
    loading = false
  }
  catch (e)
  {
    const status = e.response?._data?.status || 500
    const message = e.response?._data?.message || 'Unknown error'
    error.update(() => ({ status, message }))
    loading = false
  }
}
</script>

<style src="./nest.scss" lang="scss"></style>
