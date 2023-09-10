<div
  class="loading"
  class:loading--move={move}
  class:loading--full={full}>
  {#if ready}
    <div class="loading__unit">
      <div class="loading__shadow"></div>
      <div class="loading__box"></div>
    </div>
  {/if}
</div>

<script>
import { onMount, onDestroy } from 'svelte'
import { sleep } from '../../libs/util'

export let full = false
export let move = false
let ready = false

onMount(async () => {
  await sleep(300)
  ready = true
})
onDestroy(() => {
  ready = false
})
</script>

<style src="./loading-page.scss" lang="scss"></style>
