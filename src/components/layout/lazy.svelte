{#await component.then ? component : component() then resolvedComponent}
  <svelte:component this={resolvedComponent.default} {route}/>
{/await}

<script>
export let component = undefined
export let route = undefined
</script>
