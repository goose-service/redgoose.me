<template>
<nav class="paginate">
  <button
    type="button"
    :title="!_disabledFirstArrow ? '첫 페이지로 이동' : ''"
    :disabled="_disabledFirstArrow"
    :class="[ 'dir', 'dir--first' ]"
    @click="onFirstPage">
    <Icon name="chevrons-left"/>
  </button>
  <button
    type="button"
    :title="!(_pageBlock <= 0) ? `${range}페이지 이전으로 이동` : ''"
    :disabled="_pageBlock <= 0"
    :class="[ 'dir', 'dir--prev' ]"
    @click="onPrevRange">
    <Icon name="chevron-left"/>
  </button>
  <template v-if="_pages.length > 0">
    <button
      v-for="o in _pages"
      type="button"
      :title="`${o.key}페이지`"
      :disabled="o.active"
      :class="[ 'number', o.active && 'on' ]"
      @click="go(o.key)">
      <component :is="o.active ? 'strong' : 'em'">{{o.key}}</component>
    </button>
  </template>
  <template v-else>
    <button
      type="button"
      :title="`${page || 1}페이지`"
      :disabled="true"
      :class="[ 'number', page === 1 && 'on' ]">
      <component :is="_page === 1 ? 'strong' : 'em'">{{_page || 1}}</component>
    </button>
  </template>
  <button
    type="button"
    :title="!(_pageBlock >= _pageBlockTotal) ? `${range}페이지 다음으로 이동` : ''"
    :disabled="_pageBlock >= _pageBlockTotal"
    :class="[ 'dir', 'dir--next' ]"
    @click="onNextRange">
    <Icon name="chevron-right"/>
  </button>
  <button
    type="button"
    :title="!_disabledLastArrow ? '마지막 페이지로 이동' : ''"
    :disabled="_disabledLastArrow"
    :class="[ 'dir', 'dir--last' ]"
    @click="onLastPage">
    <Icon name="chevrons-right"/>
  </button>
</nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '../icon/index.vue'

const props = defineProps({
  page: { type: [ Number, String ] }, // 1
  total: { type: Number, required: true }, // 0
  size: { type: Number, default: 16 }, // 10
  range: { type: Number, default: 10 }, // 5
})
const emits = defineEmits([ 'update:page' ])
const size = ref(props.size || 10)
const range = ref(props.range || 5)

const _page = computed(() => (Number(props.page) > 1 ? Number(props.page) : 1))
const _pageCount = computed(() => (Math.ceil(props.total / size.value)))
const _pageBlock = computed(() => (Math.floor((_page.value - 1) / range.value)))
const _pageBlockTotal = computed(() => (Math.floor((_pageCount.value - 1) / range.value)))
const _pages = computed(() => {
  let items = []
  let startPage = _pageBlock.value * range.value + 1
  for (let i = 1; i < range.value + 1 && startPage <= _pageCount.value; i++, startPage++)
  {
    items[i - 1] = {
      key: startPage,
      active: (startPage === _page.value),
    }
  }
  // check empty item
  let checkEmpty = false
  items.forEach(o => {
    if (o.active) checkEmpty = true
  })
  return checkEmpty ? items : []
})
const _disabledFirstArrow = computed(() => {
  return _pageBlock.value === 0
})
const _disabledLastArrow = computed(() => {
  return _page.value >= _pageCount.value || _pageBlock.value === _pageBlockTotal.value
})

function onPrevRange()
{
  if (_page.value > 1)
  {
    let n = _page.value - range.value
    go((n > 1) ? n : 1)
  }
}
function onNextRange()
{
  if (_pageBlock.value < _pageBlockTotal.value)
  {
    let n = _page.value + range.value
    go(n > _pageCount.value ? _pageCount.value : n)
  }
}

function onFirstPage()
{
  if (_page.value > 1) go(1)
}
function onLastPage()
{
  if (_page.value < _pageCount.value) go(_pageCount.value)
}

function go(n)
{
  if (_page.value !== n) emits('update:page', n)
}
</script>

<style src="./paginate.scss" lang="scss" scoped></style>
