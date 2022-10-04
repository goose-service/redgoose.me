<article class="intro">
  <h1 class="intro__title">redgoose works</h1>
  <div class="intro__body">
    {#if true}
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
      <Paginate/>
    </div>
  </div>
</article>

<script lang="ts">
import { onMount } from 'svelte'
import Items from '../../components/pages/index/items.svelte'
import Item from '../../components/pages/index/item.svelte'
import RandomItems from '../../components/pages/index/random-items.svelte'
import Empty from '../../components/pages/index/empty.svelte'
import Paginate from '../../components/paginate/index.svelte'

export let route: Route
let ready: boolean = false
let itemsHead = [1,2,3,4]
let itemsRandom = [1,2,3,4]
let itemsBody = [1,2,3,4,5,6,7,8]

console.log(route)
// $: fetchData(route.params)
//
// function fetchData(params) {
//   if (!ready) return
//   console.log('fetch()', JSON.stringify(params))
// }

onMount((): void => {
  if (!ready) ready = true
})
</script>

<style src="./index.scss" lang="scss"></style>
