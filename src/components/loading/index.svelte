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

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { sleep } from '../../libs/util'

export let full: boolean = false
export let move: boolean = false
let ready: boolean = false

onMount(async () => {
  await sleep(300)
  ready = true
})
onDestroy(() => {
  ready = false
})
</script>

<style src="./index.scss" lang="scss"></style>
