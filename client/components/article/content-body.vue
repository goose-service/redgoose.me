<template>
<div
  ref="$content"
  v-html="props.content"
  class="redgoose-body redgoose-body--dark"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  content: String,
})
const emits = defineEmits([ 'click:image' ])
const $content = ref()

onMounted(() => {
  $content.value.querySelectorAll('img, goose-dark-mode-image').forEach(el => {
    el.addEventListener('click', onClickImage)
  })
})

function onClickImage(e)
{
  emits('click:image', {
    src: e.target.getAttribute('src') || e.target.getAttribute('src-light'),
    srcDark: e.target.getAttribute('src-dark'),
    alt: e.target.getAttribute('alt'),
  })
}
</script>

<style src="./content-body.scss" lang="scss"></style>
