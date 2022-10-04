<nav
  class="categories"
  class:active={opened}>
  <button
    type="button"
    class="categories__button"
    on:click={onClickControlButton}>
    <span>Categories / All</span>
    <Icon name="chevron-down"/>
  </button>
  <ul class="categories__index">
    {#each items as item, k}
      <li class:on={item.key === active}>
        <a href={item.link}>
          <span>{item.label}</span>
          <em>{item.count}</em>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<script lang="ts">
import { Icon } from '../../icons'

interface Item {
  key: string
  label: string
  count: number
}

let opened: boolean = false
export let active: string = undefined
export let items: Item[] = []

function onClickControlButton()
{
  opened = !opened
}
</script>

<style src="./categories.scss" lang="scss"></style>
