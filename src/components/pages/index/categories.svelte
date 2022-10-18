<nav
  class="categories"
  class:active={opened}>
  <button
    type="button"
    class="categories__button"
    on:click={onClickControlButton}>
    <span>Categories / {_activeCategoryName}</span>
    <Icon name="chevron-down"/>
  </button>
  <ul class="categories__index">
    {#each items as item, k}
      <li class:on={item.srl === active}>
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
  srl: string
  label: string
  count: number
  link: string
}

let opened: boolean = false
export let active: string = ''
export let items: Item[] = []

$: _activeCategoryName = items.filter(o => (o.srl === active))[0]?.label || 'All'

function onClickControlButton()
{
  opened = !opened
}
</script>

<style src="./categories.scss" lang="scss"></style>
