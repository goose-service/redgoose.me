<article class="intro">
  <h1 class="intro__title">redgoose works</h1>
  <div class="intro__body">
    {#if loading}
      <Loading full={false} move={true}/>
    {:else}
      {#if itemsHead.length > 0}
        <div class="intro__items">
          {#if itemsHead?.length > 0}
            <Items>
              {#each itemsHead as o, key}
                <Item/>
              {/each}
            </Items>
          {/if}
        </div>
        {#if itemsRandom?.length > 0}
          <div class="intro__random-items">
            <RandomItems>
              {#each itemsRandom as o, key}
                <Item/>
              {/each}
            </RandomItems>
          </div>
        {/if}
        {#if itemsBody?.length > 0}
          <div class="intro__items">
            <Items>
              {#each itemsBody as o, key}
                <Item/>
              {/each}
            </Items>
          </div>
        {/if}
      {:else}
        <Empty/>
      {/if}
      <div class="intro__paginate">
        <Paginate
          page={route.query.page}
          total={400}
          size={10}
          url="/"
          query={router.location.query.get()}/>
      </div>
    {/if}
  </div>
</article>

<script lang="ts">
import { router } from 'tinro'
import Items from '../../components/pages/index/items.svelte'
import Item from '../../components/pages/index/item.svelte'
import RandomItems from '../../components/pages/index/random-items.svelte'
import Empty from '../../components/pages/index/empty.svelte'
import Paginate from '../../components/paginate/index.svelte'
import Loading from '../../components/loading/index.svelte'
import { getUrlQueryString, sleep } from '../../libs/util'

export let route: Route
let loading: boolean = false
let itemsHead = [1,2,3,4]
let itemsRandom = [1,2,3,4]
let itemsBody = [1,2,3,4,5,6,7,8]

$: if (route.from !== route.url && location.pathname === '/') updateRoute()

async function updateRoute(): Promise<void>
{
  try
  {
    loading = true
    console.warn('updateRoute() from home ==>', route)
    await sleep(1000)
    loading = false
  }
  catch (e)
  {
    //
  }
}
</script>

<style src="./index.scss" lang="scss"></style>
