<template>
<component :is="_layout">
  <router-view/>
</component>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LayoutBlank from './layouts/blank.vue'
import LayoutDefault from './layouts/default.vue'

const router = useRouter()
const route = useRoute()

const _layout = computed(() => {
  switch (route.meta.layout)
  {
    case 'default':
      return LayoutDefault
    default:
      return LayoutBlank
  }
})
</script>

<style lang="scss" scoped></style>
