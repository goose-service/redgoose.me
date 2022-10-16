{#if loading}
  <Loading full={true} move={true}/>
{:else}
  <article class="nest">
    {#if title}
      <header class="nest__header">
        <h1>
          <span>{title}</span>
        </h1>
      </header>
    {/if}
    {#if categories?.length > 0}
      <div class="nest__categories">
        <Categories
          items={categories}
          active={route.params.category}/>
      </div>
    {/if}
    <div class="nest__body">
      {#if items?.length > 0}
        <div class="nest__items">
          <Items>
            {#each items as o, key}
              <Item/>
            {/each}
          </Items>
        </div>
      {/if}
      <div class="nest__paginate">
        <Paginate
          page={route.query.page}
          total={450}
          size={10}
          url="./"
          query={router.location.query.get()}/>
      </div>
    </div>
  </article>
{/if}

<script lang="ts">
import { router } from 'tinro'
import { sleep } from '../libs/util'
import Categories from '../components/pages/index/categories.svelte'
import Items from '../components/pages/index/items.svelte'
import Item from '../components/pages/index/item.svelte'
import Paginate from '../components/paginate.svelte'
import Loading from '../components/loading/loading-page.svelte'

export let route: Route
let currentRoute
let title = undefined
let categories = [
  { key: '37', label: 'Artwork', count: 4, link: '/nest/visual/37/' },
  { key: '38', label: 'Artwork1', count: 8, link: '/nest/visual/38/' },
  { key: '39', label: 'Artwork2', count: 2, link: '/nest/visual/39/' },
  { key: '40', label: 'Artwork3', count: 12, link: '/nest/visual/40/' },
  { key: '41', label: 'Artwork4', count: 16, link: '/nest/visual/41/' },
]
let items = new Array(24).fill(true)
let loading: boolean = false

// updateNest(true)

$: if (currentRoute?.params?.nest !== route.params?.nest) updateNest()
$: if (currentRoute?.params?.category !== route.params.category) updateCategory()
$: if (currentRoute?.query.page !== route.query.page) updatePage()

async function updateNest(root?: boolean): Promise<void>
{
  currentRoute = route
  loading = true
  console.log('updateNest')
  // TODO: /api/nests/{ID}/ 요청
  await sleep(1000)
  // console.log('fetchData()', root ? 'true' : 'false', JSON.stringify(route.params))
  // console.log(route.params.nest)
  // return {
  //   title: route.params.nest,
  //   items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  // }
  title = route.params.nest
  loading = false
}

async function updateCategory(): Promise<void>
{
  currentRoute = route
  loading = true
  console.log('fetchCategory()')
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
