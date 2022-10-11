{#if loading.nest}
  <Loading full={true} move={true}/>
{:else}
  <article class="nest">
    <header class="nest__header">
      <h1>
        <span>{title}</span>
      </h1>
    </header>
    {#if categories?.length > 0}
      <div class="nest__categories">
        <Categories
          items={categories}
          active={route.params.category}/>
      </div>
    {/if}
    <div class="nest__body">
    {#if loading.items}
      <Loading move={true}/>
    {:else}
      <div class="nest__items">
        {#if items?.length > 0}
          <Items>
            {#each items as o, key}
              <Item/>
            {/each}
          </Items>
        {/if}
      </div>
      <div class="nest__paginate">
        <Paginate
          page={route.query.page}
          total={400}
          size={10}
          on:change={onChangePage}/>
      </div>
    {/if}
    </div>
  </article>
{/if}

<script lang="ts">
import { router } from 'tinro'
import { getUrlQueryString, sleep } from '../../libs/util'
import Categories from '../../components/pages/index/categories.svelte'
import Items from '../../components/pages/index/items.svelte'
import Item from '../../components/pages/index/item.svelte'
import Paginate from '../../components/paginate/index.svelte'
import Loading from '../../components/loading/index.svelte'

export let route: Route
let currentRoute
let title = ''
let categories = [
  { key: '37', label: 'Artwork', count: 4, link: '/nest/visual/37/' },
  { key: '38', label: 'Artwork1', count: 8, link: '/nest/visual/38/' },
  { key: '39', label: 'Artwork2', count: 2, link: '/nest/visual/39/' },
  { key: '40', label: 'Artwork3', count: 12, link: '/nest/visual/40/' },
  { key: '41', label: 'Artwork4', count: 16, link: '/nest/visual/41/' },
]
let items = new Array(24).fill(true)
let loading = {
  nest: false,
  items: false,
}

// let nest = fetchNest(true)

// $: if (currentRoute.params.nest !== route.params.nest) fetchNest()
// $: if (currentRoute.params.category !== route.params.category) fetchCategory()
// $: if (currentRoute.query.page !== route.query.page) fetchPage()

async function updateRoute(meta): Promise<void>
{
  if (meta.from === meta.url) return
  if (!/^\/nest\//.test(meta.path)) return
  try
  {
    console.warn('updateRoute() from index/nest ==>', meta.path)
  }
  catch (e)
  {
    //
  }
}

async function fetchNest(root?: boolean): Promise<void>
{
  currentRoute = route
  loading.nest = true
  await sleep(1000)
  // console.log('fetchData()', root ? 'true' : 'false', JSON.stringify(route.params))
  // console.log(route.params.nest)
  // return {
  //   title: route.params.nest,
  //   items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  // }
  title = route.params.nest
  loading.nest = false
}

async function fetchCategory(): Promise<void>
{
  currentRoute = route
  loading.items = true
  await sleep(1000)
  loading.items = false
}

async function fetchPage(): Promise<void>
{
  currentRoute = route
  loading.items = true
  await sleep(1000)
  loading.items = false
}

// async function fetchItems(): Promise<void>
// {
//   currentRoute = route
//   // TODO: 분류, 페이지 값이 변할때 함수가 발생된다.
//   // if (!ready) return
//   // console.log(params, route.params)
//   // params = route.params
//   console.log('fetchItems()', JSON.stringify(route.params))
//   // return []
// }

function updateCategories(src)
{
  return
}

function onChangePage({ detail: { value } })
{
  let query = getUrlQueryString({ page: value })
  router.goto(`./${query}`)
}

// router.subscribe(updateRoute)
</script>

<style src="./index.scss" lang="scss"></style>
