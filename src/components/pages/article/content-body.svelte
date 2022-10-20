<div class="redgoose-body redgoose-body--dark">
  {#if body}
    {@html body}
  {/if}
</div>

<script lang="ts">
export let body: string = undefined
</script>

<style src="./content-body.scss" global lang="scss"></style>
