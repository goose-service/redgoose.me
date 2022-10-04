{#await component.then ? component : component()}
  <Loading/>
{:then comp}
  <svelte:component
    this={comp.default}
    bind:route={route}/>
{/await}

<script lang="ts">
import Loading from '../loading/index.svelte'

export let component
export let route = undefined
</script>
