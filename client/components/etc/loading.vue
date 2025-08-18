<template>
<article class="loading">
  <h1>Loading..</h1>
  <div v-if="ready" class="unit">
    <div class="shadow"></div>
    <div class="box"></div>
  </div>
</article>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const ready = ref(false)

onMounted(() => {
  setTimeout(() => {
    ready.value = true
  }, 300)
})
onUnmounted(() => {
  ready.value = false
})
</script>

<style src="./loading.scss" lang="scss" scoped></style>
