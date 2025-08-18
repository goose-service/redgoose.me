<template>
<article class="error">
  <div class="wrap">
    <figure class="cover-image">
      <img
        :src="_image"
        width="800"
        height="800"
        alt="Error image"
        draggable="false"/>
    </figure>
    <p class="code">{{_code}}</p>
    <h1 class="title">{{props.pageTitle}}</h1>
    <p class="message">{{props.pageMessage}}</p>
  </div>
</article>
</template>

<script setup>
import { computed } from 'vue'
import ServiceError from '../../libs/error.js'

const props = defineProps({
  pageTitle: { type: String, default: 'Service Error' },
  pageMessage: String,
  error: ServiceError,
})

const _code = computed(() => {
  return props.error?.code || 500
})
const _image = computed(() => {
  switch (props.error?.code)
  {
    case 204:
    case 404:
      return '/images/img-empty.webp'
    default:
      return '/images/img-error.webp'
  }
})
</script>

<style src="./error.scss" lang="scss" scoped></style>
