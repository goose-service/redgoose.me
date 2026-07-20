<template>
<router-link
  :to="`/article/${props.srl}/`"
  draggable="false"
  class="item"
  @mouseenter="onMouseEnter">
  <figure class="image">
    <img
      v-if="props.image"
      :src="props.image"
      :alt="props.title"
      draggable="false"
      loading="lazy"/>
    <i v-else>TODO: empty</i>
  </figure>
  <div class="body">
    <h3 ref="$title">{{props.title}}</h3>
    <p ref="$description">{{props.description}}</p>
  </div>
</router-link>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import autoWriter from 'auto-writer'

const props = defineProps({
  srl: { type: Number, required: true },
  title: { type: String, required: true },
  image: String,
  description: String,
})
const $title = ref()
const $description = ref()
const writerTimeouts = []

function getWriterTargets()
{
  return [
    { element: $title.value, text: props.title },
    { element: $description.value, text: props.description },
  ]
}

function stopWriter(element)
{
  if (!element) return
  const id = Number(element.dataset.id)
  if (Number.isInteger(id)) clearInterval(id)
  delete element.dataset.id
}

function stopWriters(reset = false)
{
  writerTimeouts.forEach(clearTimeout)
  writerTimeouts.length = 0

  getWriterTargets().forEach(({ element, text }) => {
    stopWriter(element)
    if (reset && element) element.textContent = text || ''
  })
}

function onMouseEnter()
{
  stopWriters(true)

  getWriterTargets().forEach(({ element, text }, k) => {
    if (!element || !text) return
    const timeout = setTimeout(() => {
      const index = writerTimeouts.indexOf(timeout)
      if (index !== -1) writerTimeouts.splice(index, 1)
      autoWriter(element, {
        text,
        pattern: 'abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ',
        randomTextType: k === 0 ? 'pattern' : 'unicode',
      })
    }, 180 * k)
    writerTimeouts.push(timeout)
  })
}

onBeforeUnmount(() => stopWriters())
</script>

<style src="./item.scss" lang="scss" scoped></style>
