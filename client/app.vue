<template>
<component :is="_layout">
  <Error
    v-if="_error"
    page-title="서비스 오류"
    :page-message="error?.message || '서비스를 불러오지 못했어요.'"
    :error="error"/>
  <router-view v-else/>
</component>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured, provide } from 'vue'
import { useRoute } from 'vue-router'
import Store from './store.js'
import ServiceError from './libs/error.js'
import LayoutBlank from './layouts/blank.vue'
import LayoutDefault from './layouts/default.vue'
import Error from './components/content/error.vue'

const route = useRoute()
const error = ref(undefined)

// set provides
provide('store', new Store())

const _layout = computed(() => {
  switch (route.meta.layout)
  {
    case 'blank':
      return LayoutBlank
    default:
      return LayoutDefault
  }
})
const _error = computed(() => {
  return Boolean(error.value || null)
})

// captured error
onErrorCaptured(e => {
  if (e instanceof ServiceError)
  {
    error.value = e
  }
  else if (e?.message)
  {
    error.value = ServiceError.from(e)
  }
  else if (typeof e === 'string')
  {
    error.value = ServiceError.from({ message: e })
  }
  else
  {
    error.value = ServiceError.from(e)
  }
})

watch(() => route.name, () => {
  if (!!error.value) error.value = undefined
})
</script>

<style src="./app.scss" lang="scss"></style>
