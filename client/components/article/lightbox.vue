<template>
<transition name="modal">
  <dialog
    ref="$root"
    v-if="open"
    class="lightbox"
    @click="onClose"
    @cancel.prevent="onClose">
    <div class="lightbox__body">
      <div class="image">
        <goose-dark-mode-image
          v-if="props.srcDark"
          :src-light="props.src"
          :src-dark="props.srcDark"
          :alt="props.alt"/>
        <img
          v-else
          :src="props.src"
          :alt="props.alt"
          loading="lazy"
          :draggable="false"/>
      </div>
    </div>
    <nav class="close">
      <button
        ref="_close"
        type="button"
        title="Close"
        @click.stop="onClose">
        <Icon name="x"/>
      </button>
    </nav>
  </dialog>
</transition>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Icon from '../icon/index.vue'

const _close = ref()
const props = defineProps({
  src: String,
  srcDark: String,
  alt: String,
})
const emits = defineEmits([ 'close' ])
const $root = ref()
const open = ref(false)
const backupScrollY = ref(0)
const modalRootClassName = 'popup-lightbox'

watch(() => !!props.src, control)
onUnmounted(() => control(false))

async function control(sw)
{
  if (sw)
  {
    backupScrollY.value = window.scrollY
    open.value = true
    await nextTick()
    $root.value.showModal()
    controlRoot(true)
    await nextTick()
    _close.value.blur()
  }
  else
  {
    open.value = false
    controlRoot(false)
    await nextTick()
    if ($root.value) $root.value.close()
    window.scrollTo({ top: backupScrollY.value })
  }
}

function controlRoot(sw)
{
  if (!sw && document.getElementById('modal')?.children.length > 1) return
  document.documentElement.classList[sw ? 'add' : 'remove'](modalRootClassName)
}

function onClose()
{
  emits('close')
}
</script>

<style src="./lightbox.scss" lang="scss" scoped></style>
