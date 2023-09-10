<div
  class="redgoose-body redgoose-body--dark"
  aria-hidden="true"
  on:click={onClickBody}>
  {#if body}
    {@html body}
  {/if}
</div>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let body = undefined

function onClickBody(e)
{
  let _target = e.target
  switch (_target.tagName?.toLowerCase())
  {
    case 'img':
      dispatch('openLightbox', {
        src: _target.src,
        alt: _target.alt,
      })
      break
  }
}
</script>

<style src="./content-body.scss" lang="scss"></style>
