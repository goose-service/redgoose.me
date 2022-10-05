{#if ready}
  <div class="loading">
    <p>page loading...</p>
  </div>
{/if}

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { sleep } from '../../../libs/util'

let ready = false

onMount(async () => {
  await sleep(300)
  ready = true
})
onDestroy(() => {
  ready = false
})
</script>

<style lang="scss">
.loading {
  display: grid;
  place-content: center;
  height: calc(100vh - var(--size-header-height));
}
</style>
