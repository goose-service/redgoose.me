{#if loading.nest}
  <p>loading...</p>
{:else}
  <article class="nest">
    <header class="nest__header">
      <h1>{_title}</h1>
    </header>
    {#if _categories?.length > 0}
      <div class="nest__categories">
        <Categories
          items={_categories}
          active={route.params.category}/>
      </div>
    {/if}
    <div class="nest__body">
    {#if loading.items}
      <p>loading...</p>
    {:else}
      <div class="nest__items">
        {#if _items?.length > 0}
          <Items>
            {#each _items as o, key}
              <Item/>
            {/each}
          </Items>
        {/if}
      </div>
      <div class="nest__paginate">
        <Paginate/>
      </div>
    {/if}
    </div>
  </article>
{/if}

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { sleep } from '../../libs/util'
import Loading from '../../components/layout/loading/index.svelte'
import Categories from '../../components/pages/index/categories.svelte'
import Items from '../../components/pages/index/items.svelte'
import Item from '../../components/pages/index/item.svelte'
import Paginate from '../../components/paginate/index.svelte'

export let route: Route
let currentRoute
let data = {
  title: route.params.nest,
  categories: [],
  items: undefined,
}
let _title = ''
let _categories = [
  { key: '37', label: 'Artwork', count: 4, link: '/nest/visual/37/' },
  { key: '38', label: 'Artwork1', count: 8, link: '/nest/visual/38/' },
  { key: '39', label: 'Artwork2', count: 2, link: '/nest/visual/39/' },
  { key: '40', label: 'Artwork3', count: 12, link: '/nest/visual/40/' },
  { key: '41', label: 'Artwork4', count: 16, link: '/nest/visual/41/' },
]
let _items = []
let loading = {
  nest: false,
  items: false,
}

let nest = fetchNest(true)

$: if (currentRoute.params.nest !== route.params.nest) fetchNest()
$: if (currentRoute.params.category !== route.params.category) fetchCategory()
$: if (currentRoute.query.page !== route.query.page) fetchPage()

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
  _title = route.params.nest
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
</script>

<style src="./index.scss" lang="scss"></style>
