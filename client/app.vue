<template>
<component :is="_layout">
  <Error
    v-if="_error"
    page-title="Service Error"
    :page-message="error?.message || '알 수 없는 오류가 발생했습니다.'"
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
    error.value = new ServiceError(e.message)
  }
  else if (typeof e === 'string')
  {
    error.value = new ServiceError(e)
  }
  else
  {
    error.value = new ServiceError('Invalid Error')
  }
})

watch(() => route.name, () => {
  if (!!error.value) error.value = undefined
})
</script>
