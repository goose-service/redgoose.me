<template>
<div :class="[ 'items', props.random ? 'random' : 'normal' ]">
  <div class="wrap">
    <ul>
      <slot/>
    </ul>
  </div>
</div>
</template>

<script setup>
const props = defineProps({
  random: Boolean,
})
</script>

<style src="./items.scss" lang="scss" scoped></style>
