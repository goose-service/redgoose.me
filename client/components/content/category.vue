<template>
<button
  type="button"
  :class="[
    'toggle',
    opened && 'open',
  ]"
  @click="onClickToggle">
  <span>Category / {{_activeName}}</span>
  <Icon name="chevron-down"/>
</button>
<ul class="category-items">
  <li v-for="o in props.items">
    <component
      :is="String(o.srl) === String(props.active) ? 'strong' : 'router-link'"
      :to="o.srl ? `/nest/${props.nest}/${o.srl}/` : `/nest/${props.nest}/`">
      <span>{{o.name}}</span>
      <em>{{o.count}}</em>
    </component>
  </li>
</ul>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '../icon/index.vue'

const props = defineProps({
  nest: String,
  items: Array,
  active: String,
})
const opened = ref(false)

const _activeName = computed(() => {
  const item = props.items.find(o => (o.srl === props.active))
  return item?.name || 'All'
})

function onClickToggle()
{
  opened.value = !opened.value
}
</script>

<style src="./category.scss" lang="scss" scoped></style>
