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
import { ref } from 'vue'
import shuffle from 'auto-writer/src/shuffle'

const props = defineProps({
  srl: { type: Number, required: true },
  title: { type: String, required: true },
  image: String,
  description: String,
})
const $title = ref()
const $description = ref()

function onMouseEnter(e)
{
  const arr = [ $title.value, $description.value ]
  arr.forEach((el, k) => {
    if (!el) return
    setTimeout(() => shuffle(el, {
      text: el.innerText,
      pattern: 'abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ',
      randomTextType: k === 0 ? 'pattern' : 'unicode',
    }), 180 * k)
  })
}
</script>

<style src="./item.scss" lang="scss" scoped></style>
