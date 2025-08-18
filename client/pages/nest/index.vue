<template>
<Loading v-if="state.loading"/>
<article v-else class="nest">
  <header v-if="state.nest?.name" class="nest-header">
    <h1>{{state.nest.name}}</h1>
  </header>
  <nav v-if="state.category.length > 0" class="nest-category">
    <Category
      :nest="route.params.code"
      :items="state.category"
      :active="route.params.category"/>
  </nav>
  <div class="body">
    <Loading v-if="state.articleLoading"/>
    <div v-else-if="state.article?.length > 0" class="index">
      <Items>
        <li v-for="o in state.article">
          <Item
            :srl="o.srl"
            :title="o.title"
            :image="o.image"
            :description="`${o.nest} / ${o.category}`"/>
        </li>
      </Items>
    </div>
    <Error
      v-else
      page-title="No Content"
      :error="new ServiceError('No Content', 204)"
      class="empty"/>
  </div>
  <div v-if="state.total > 0" class="nest-paginate">
    <Paginate
        :page="route.query.page"
        :total="state.total"
        :size="state.assets.size"
        :range="3"
        class="paginate--mobile"
        @update:page="onChangePage"/>
      <Paginate
        :page="route.query.page"
        :total="state.total"
        :size="state.assets.size"
        :range="10"
        class="paginate--desktop"
        @update:page="onChangePage"/>
  </div>
</article>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ofetch } from 'ofetch'
import ServiceError from '../../libs/error.js'
import { serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import Error from '../../components/content/error.vue'
import Category from '../../components/content/category.vue'
import Items from '../../components/content/items.vue'
import Item from '../../components/content/item.vue'
import Loading from '../../components/etc/loading.vue'
import Paginate from '../../components/etc/paginate.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
  loading: true,
  articleLoading: false,
  total: 0,
  nest: {},
  article: [],
  category: [],
  assets: {
    size: 24,
  },
})

onMounted(_fetch)
watch(() => [ route.params, route.query.page ], (value, oldValue) => {
  const [ params, page ] = value
  const [ oldParams, oldPage ] = oldValue
  if (params.code !== oldParams.code)
  {
    _fetch().then()
  }
  else if (params.category !== oldParams.category)
  {
    _fetchArticle().then()
  }
  else if (page !== oldPage)
  {
    _fetchArticle().then()
  }
})

async function _fetch()
{
  try
  {
    scrollTo(0)
    state.loading = true
    let _url = `/api/nest/${route.params.code}/`
    if (route.params.category) _url += `${route.params.category}/`
    let _query = { nest: state.nest.srl }
    if (route.query.page > 1) _query.page = Number(route.query.page)
    const res = await ofetch(_url, { query: _query })
    if (!res) throw new ServiceError('No Content', 204)
    state.nest = res.nest
    state.category = res.category
    state.total = res.article.total
    state.article = res.article.index
    state.assets.size = res.assets.size
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
}

async function _fetchArticle()
{
  if (state.loading) return
  try
  {
    scrollTo(0)
    state.articleLoading = true
    let _query = { nest: state.nest.srl }
    if (route.params.category) _query.category = route.params.category
    if (route.query.page > 1) _query.page = Number(route.query.page)
    const res = await ofetch(`/api/article/`, { query: _query })
    if (!res) throw new ServiceError('No Content', 204)
    state.total = res.total
    state.article = res.index
  }
  catch (_e)
  {
    if (_e instanceof ServiceError)
    {
      if (_e.code === 204) state.article = []
      else throw _e
    }
    else
    {
      throw new ServiceError(_e?.message)
    }
  }
  finally
  {
    state.articleLoading = false
  }
}

function onChangePage(page)
{
  let _query = { ...route.query }
  _query.page = page > 1 ? page : NaN
  router.push(`./${serialize(_query, true)}`).then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
