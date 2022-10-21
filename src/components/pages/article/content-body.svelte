<div
  class="redgoose-body redgoose-body--dark"
  aria-hidden="true"
  on:click={onClickBody}>
  {#if body}
    {@html body}
  {/if}
</div>

<script lang="ts">
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let body: string = undefined

function onClickBody(e): void
{
  let _target: HTMLElement = e.target
  switch (_target.tagName?.toLowerCase())
  {
    case 'img':
      dispatch('openLightbox', {
        src: (_target as HTMLImageElement).src,
        alt: (_target as HTMLImageElement).alt,
      })
      break
  }
}
</script>

<style src="./content-body.scss" global lang="scss"></style>
