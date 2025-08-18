<template>
<Error
  page-title="페이지가 없습니다."
  page-message="현재 페이지가 없거나 주소가 잘못되었습니다."
  :error="new ServiceError('Page not found', 404)"/>
</template>

<script setup>
import ServiceError from '../../libs/error.js'
import Error from '../../components/content/error.vue'
</script>
