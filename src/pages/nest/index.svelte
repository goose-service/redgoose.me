{#await data}
  <Loading/>
{:then res}
  <article class="nest">
    <header class="nest__header">
      <h1>{res.title}</h1>
    </header>
    <div class="nest__categories">
      <Categories
        items={categories}
        active={route.params.category}/>
    </div>
    <div class="nest__body">
      <div class="nest__items">
        {#if res.items?.length > 0}
          <Items>
            {#each res.items as o, key}
              <Item/>
            {/each}
          </Items>
        {/if}
      </div>
      <div class="nest__paginate">
        <Paginate/>
      </div>
    </div>
  </article>
{:catch error}
  <article>
    <h1>Error page</h1>
  </article>
{/await}

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { sleep } from '../../libs/util'
import Loading from '../../components/layout/loading/index.svelte'
import Categories from '../../components/pages/index/categories.svelte'
import Items from '../../components/pages/index/items.svelte'
import Item from '../../components/pages/index/item.svelte'
import Paginate from '../../components/paginate/index.svelte'

export let route: Route
let data = fetchData(true)
let currentRoute = route
let categories = [
  { key: '37', label: 'Artwork', count: 4, link: '/nest/visual/37/' },
  { key: '38', label: 'Artwork1', count: 8, link: '/nest/visual/38/' },
  { key: '39', label: 'Artwork2', count: 2, link: '/nest/visual/39/' },
  { key: '40', label: 'Artwork3', count: 12, link: '/nest/visual/40/' },
  { key: '41', label: 'Artwork4', count: 16, link: '/nest/visual/41/' },
]

$: if (currentRoute.params.nest !== route.params.nest) fetchData()
$: if (currentRoute.params.category !== route.params.category) fetchItems()
$: if (currentRoute.query.page !== route.query.page) fetchItems()

async function fetchData(root?: boolean): Promise<object>
{
  if (!root) currentRoute = route
  // TODO: nest값이 변할때 함수가 호출된다.
  // await sleep(3000)
  console.log('fetchData()', root ? 'true' : 'false', JSON.stringify(route.params))
  return {
    title: 'Visual',
    items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  }
}

async function fetchItems(): Promise<object[]>
{
  currentRoute = route
  // TODO: 분류, 페이지 값이 변할때 함수가 발생된다.
  // if (!ready) return
  // console.log(params, route.params)
  // params = route.params
  console.log('fetchItems()', JSON.stringify(route.params))
  return []
}
</script>

<style src="./index.scss" lang="scss"></style>
