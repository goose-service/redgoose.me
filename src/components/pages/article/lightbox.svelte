<div class="lightbox">
  <figure class="lightbox__image">
    {#if srcDark}
      <goose-dark-mode-image
        src-light={src}
        src-dark={srcDark}
        alt={alt}/>
    {:else}
      <img src={src} alt={alt}/>
    {/if}
  </figure>
  <button
    type="button"
    class="lightbox__close"
    on:click={() => dispatch('close')}>
    <Icon name="x"/>
  </button>
</div>

<script>
import { createEventDispatcher, onMount, onDestroy } from 'svelte'
import { Icon } from '../../icons'

const dispatch = createEventDispatcher()
export let src = undefined
export let srcDark = undefined
export let alt = undefined

function onCloseByKeyup(e)
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
