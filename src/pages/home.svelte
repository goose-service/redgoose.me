<article class="intro">
  <h1 class="intro__title">redgoose works</h1>
  <div class="intro__body">
    {#if loading}
      <Loading full={true} move={true}/>
    {:else}
      {#if (itemsHead?.length > 0) || (itemsBody?.length > 0)}
        {#if itemsHead.length > 0}
          <div class="intro__items">
            {#if itemsHead?.length > 0}
              <Items>
                {#each itemsHead as o, key}
                  <Item
                    srl={o.srl}
                    title={o.title}
                    image={o.image}
                    description={`${o.nest} / ${o.category}`}/>
                {/each}
              </Items>
            {/if}
          </div>
        {/if}
        {#if itemsRandom?.length > 0}
          <div class="intro__random-items">
            <RandomItems>
              {#each itemsRandom as o, key}
                <Item
                  srl={o.srl}
                  title={o.title}
                  image={o.image}
                  description={`${o.nest} / ${o.category}`}/>
              {/each}
            </RandomItems>
          </div>
        {/if}
        <div class="intro__items">
          <Items>
            {#each itemsBody as o, key}
              <Item
                srl={o.srl}
                title={o.title}
                image={o.image}
                description={`${o.nest} / ${o.category}`}/>
            {/each}
          </Items>
        </div>
      {:else}
        <div class="intro__empty">
          <Error status={204} message="no items"/>
        </div>
      {/if}
      {#if total > 0}
        <div class="intro__paginate">
          <Paginate
            page={route.query.page}
            total={total}
            size={10}
            url="/"
            query={router.location.query.get()}/>
        </div>
      {/if}
    {/if}
  </div>
</article>

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { router } from 'tinro'
import { $fetch as fetch } from 'ohmyfetch'
import { error } from '../store'
import Items from '../components/pages/index/items.svelte'
import Item from '../components/pages/index/item.svelte'
import RandomItems from '../components/pages/index/random-items.svelte'
import Error from '../components/error.svelte'
import Paginate from '../components/paginate.svelte'
import Loading from '../components/loading/loading-page.svelte'

interface Query {
  page?: number
}
interface Response {
  total: number
  headItems?: object[]
  randomItems?: object[]
  bodyItems?: object[]
}

export let route: Route
let ready: boolean = false
let loading: boolean = true
let currentRoute
let total = 0
let itemsHead: IndexItem[] = []
let itemsRandom: IndexItem[] = []
let itemsBody: IndexItem[] = []

$: if (route.from !== route.url && location.pathname === '/') updateRoute()
$: if (currentRoute?.query.page !== route.query.page) updateRoute()

async function updateRoute(): Promise<void>
{
  if (!ready) return
  try
  {
    currentRoute = route
    loading = true
    let query: Query = {}
    if (Number(route.query?.page) > 1) query.page = Number(route.query?.page)
    let res: Response = await fetch('/api/', {
      responseType: 'json',
      query,
    })
    total = res.total
    itemsHead = <IndexItem[]>res.headItems
    itemsRandom = <IndexItem[]>res.randomItems
    itemsBody = <IndexItem[]>res.bodyItems
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

onMount(() => {
  if (!ready) ready = true
  updateRoute()
})
onDestroy(() => {
  ready = false
})
</script>

<style src="./home.scss" lang="scss"></style>
