<div
  class="redgoose-body redgoose-body--dark"
  aria-hidden="true"
  on:click={onClickBody}>
  {#if body}
    {@html body}
  {/if}
</div>

<script lang="ts">
export let body: string = undefined

function onClickBody(e): void
{
  let _target: HTMLElement = e.target
  switch (_target.tagName?.toLowerCase())
  {
    case 'img':
      console.log(_target)
      break
  }
}
</script>

<style src="./content-body.scss" global lang="scss"></style>
