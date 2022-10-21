<div
  class="lightbox"
  transition:fade="{{
    opacity: 0,
    duration: 300,
  }}">
  <figure class="lightbox__image">
    <img src={src} alt={alt}/>
  </figure>
  <button
    type="button"
    class="lightbox__close"
    on:click={() => dispatch('close')}>
    close
  </button>
</div>

<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from 'svelte'
import { fade } from 'svelte/transition'

const dispatch = createEventDispatcher()
export let src: string = undefined
export let alt: string = undefined

function onCloseByKeyup(e: KeyboardEvent): void
{
  if (e.key !== 'Escape') return
  dispatch('close')
}

onMount(() => {
  document.querySelector('html').classList.add('popup-lightbox')
  window.addEventListener('keyup', onCloseByKeyup, { once: true })
})
onDestroy(() => {
  document.querySelector('html').classList.remove('popup-lightbox')
})

</script>

<style src="./lightbox.scss" lang="scss"></style>
