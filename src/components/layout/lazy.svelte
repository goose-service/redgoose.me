{#await component.then ? component : component() then resolvedComponent}
  <svelte:component this={resolvedComponent.default} {route}/>
{/await}

<script lang="ts">
export let component
export let route
</script>
