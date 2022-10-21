{#await component.then ? component : component() then resolvedComponent}
  <svelte:component this={resolvedComponent.default} {route}/>
{/await}

<script lang="ts">
export let component = undefined
export let route = undefined
</script>
