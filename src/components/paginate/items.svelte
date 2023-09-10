<nav class="paginate">
  {#if _page === 1}
    <strong
      title={`go to first page`}
      class="arrow">
      <Icon name="chevrons-left"/>
    </strong>
  {:else}
    <a
      href={makeUrl(1)}
      title={`go to first page`}
      class="arrow">
      <Icon name="chevrons-left"/>
    </a>
  {/if}
  {#if _block <= 0}
    <strong
      title={`go to ${range} page prev`}
      class="arrow">
      <Icon name="chevron-left"/>
    </strong>
  {:else}
    <a
      href={makeUrl(((_page - range) > 1) ? (_page - range) : 1)}
      title={`go to ${range} page prev`}
      class="arrow">
      <Icon name="chevron-left"/>
    </a>
  {/if}
  {#if _pageItems.length > 0}
    {#each _pageItems as item, key}
      {#if item.active}
        <strong title={`${item.key} page`} class="number">
          <em>{item.key}</em>
        </strong>
      {:else}
        <a href={makeUrl(item.key)} title={`go to ${item.key} page`} class="number">
          <em>{item.key}</em>
        </a>
      {/if}
    {/each}
  {:else}
    <strong title={`${_page || 1} page`} class="number">
      <em>{_page || 1}</em>
    </strong>
  {/if}
  {#if _block >= _blockTotal}
    <strong
      title={`go to ${range} page next`}
      class="arrow">
      <Icon name="chevron-right"/>
    </strong>
  {:else}
    <a
      href={makeUrl((_page + range) > _count ? _count : (_page + range))}
      title={`go to ${range} page next`}
      class="arrow">
      <Icon name="chevron-right"/>
    </a>
  {/if}
  {#if _page >= _count}
    <strong
      title="go to last page"
      class="arrow">
      <Icon name="chevrons-right"/>
    </strong>
  {:else}
    <a
      href={makeUrl(_count)}
      title="go to last page"
      class="arrow">
      <Icon name="chevrons-right"/>
    </a>
  {/if}
</nav>

<script>
import { Icon } from '../icons'
import { serialize, pureObject } from '../../libs/util'

export let page = 1
export let total = 0
export let size = 10
export let range = 5
export let url = '/'
export let query = {}
let _pageItems = []

$: _page = (() => ((Number(page) > 1) ? Number(page) : 1))()
$: _count = Math.ceil(total / size)
$: _block = Math.floor((_page - 1) / range)
$: _blockTotal = Math.floor((_count - 1) / range)
$: if (_block !== undefined && page > 0) _pageItems = reactivePageItems()

function reactivePageItems()
{
  let items = []
  let startPage = _block * range + 1
  for (let i = 1; i < range + 1 && startPage <= _count; i++, startPage++)
  {
    items[i - 1] = {
      key: startPage,
      active: (startPage === _page),
    }
  }
  let checkEmpty = false
  items.forEach(o => {
    if (o.active) checkEmpty = true
  })
  return checkEmpty ? items : []
}

function makeUrl(n)
{
  let newQuery = pureObject(query)
  newQuery.page = n
  if (newQuery.page === 1) delete newQuery.page
  return `${url}${serialize(newQuery, true)}`
}
</script>

<style src="./items.scss" lang="scss"></style>
