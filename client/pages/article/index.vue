<template>
<article class="article">
  <Loading v-if="state.loading"/>
  <div v-else-if="state.srl" class="wrap">
    <header class="article-header">
      <p>
        <span v-for="o in state.headDescription">{{o}}</span>
        <em>{{_date}}</em>
      </p>
      <h1>{{state.title === '.' ? 'Untitled Work' : state.title}}</h1>
    </header>
    <div class="article-body">
      <ContentBody
        :content="state.content"
        @click:image="onClickImage"/>
    </div>
    <nav class="article-star">
      <StarButton
        :count="state.star.count"
        :disabled="state.star.disabled"
        @click:button="onClickStar"/>
    </nav>
  </div>
  <Error
    v-else
    page-title="No Content"
    :error="new ServiceError('No Content', 204)"
    class="article-empty"/>
  <teleport to="#modal">
    <Lightbox
      :src="state.lightbox?.src"
      :src-dark="state.lightbox?.srcDark"
      :alt="state.lightbox?.alt"
      @close="onCloseLightbox"/>
  </teleport>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ofetch } from 'ofetch'
import ServiceError from '../../libs/error.js'
import { hashScroll } from '../../libs/util.js'
import { dateFormat } from '../../libs/strings.js'
import Error from '../error/index.vue'
import Loading from '../../components/etc/loading.vue'
import ContentBody from '../../components/article/content-body.vue'
import StarButton from '../../components/article/star-button.vue'
import Lightbox from '../../components/article/lightbox.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
  loading: true,
  srl: NaN,
  title: '',
  headDescription: [],
  regdate: '',
  content: '',
  star: {
    disabled: false,
    count: 0,
  },
  lightbox: null, // { src, srcDark, alt }
})

const _date = computed(() => {
  if (!state.regdate) return null
  return dateFormat(new Date(state.regdate), '{yyyy}-{MM}-{dd}')
})

onMounted(async () => {
  try
  {
    state.loading = true
    const res = await ofetch(`/api/article/${route.params.srl}/`)
    if (!res) throw new ServiceError('No Content', 204)
    state.srl = res.srl
    state.title = res.title
    state.headDescription = [ res.nestName, res.categoryName ]
    state.regdate = res.regdate
    state.content = res.content
    state.star.count = res.star
    state.star.disabled = res.usedUpStar
    // scroll to hash content
    if (location.hash)
    {
      await nextTick()
      hashScroll(location.hash)
    }
  }
  catch (_e)
  {
    if (_e instanceof ServiceError)
    {
      if (_e.code !== 204) throw _e
    }
    else
    {
      throw new ServiceError(_e?.message)
    }
  }
  finally
  {
    state.loading = false
  }
})

function onClickImage({ src, srcDark, alt })
{
  state.lightbox = { src, srcDark, alt }
}

function onCloseLightbox()
{
  state.lightbox = null
}

async function onClickStar()
{
  try
  {
    const res = await ofetch(`/api/article/${route.params.srl}/star/`, {
      method: 'post',
    })
    state.star.disabled = true
    state.star.count = res.count
  }
  catch (_e)
  {
    alert('Failed update star.')
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
