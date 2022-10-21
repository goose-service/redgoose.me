<div class="lightbox">
  <figure>
    <img src={image} alt="">
  </figure>
  <nav>
    <button
      type="button"
      on:click={() => dispatch('close')}>
    </button>
  </nav>
</div>

<script lang="ts">
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let image: string = ''
</script>

<style src="./lightbox.scss" lang="scss"></style>
