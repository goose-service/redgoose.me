<template>
<article class="home">
  <h1>GoOSe works</h1>
  <div class="body">
    <Loading v-if="state.loading"/>
    <template v-else-if="state.total > 0">
      <Items v-if="state.index.head?.length > 0">
        <li v-for="o in state.index.head">
          <Item
            :srl="o.srl"
            :title="o.title"
            :image="o.image"
            :description="`${o.nest} / ${o.category}`"/>
        </li>
      </Items>
      <Items v-if="state.index.random?.length > 0" :random="true">
        <li v-for="o in state.index.random">
          <Item
            :srl="o.srl"
            :title="o.title"
            :image="o.image"
            :description="`${o.nest} / ${o.category}`"/>
        </li>
      </Items>
      <Items v-if="state.index.body?.length > 0">
        <li v-for="o in state.index.body">
          <Item
            :srl="o.srl"
            :title="o.title"
            :image="o.image"
            :description="`${o.nest} / ${o.category}`"/>
        </li>
      </Items>
    </template>
    <Error
      v-else
      page-title="No Content"
      :error="new ServiceError('No Content', 204)"
      class="empty"/>
    <div v-if="state.total > 0" class="pagination">
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
import Error from '../../pages/error/index.vue'
import Items from '../../components/content/items.vue'
import Item from '../../components/content/item.vue'
import Loading from '../../components/etc/loading.vue'
import Paginate from '../../components/etc/paginate.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
  loading: true,
  total: 0,
  index: {
    head: [],
    random: [],
    body: [],
  },
  assets: { size: 24 },
})

onMounted(_fetch)
watch(() => route.query, _fetch)

async function _fetch()
{
  try
  {
    scrollTo(0)
    state.loading = true
    const res = await ofetch('/api/', { query: route.query })
    if (!res) throw new ServiceError('No Content', 204)
    state.total = res.total
    state.index.head = res.head
    state.index.random = res.random
    state.index.body = res.body
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

function onChangePage(page)
{
  let _query = { ...route.query }
  _query.page = page > 1 ? page : NaN
  router.push(`./${serialize(_query, true)}`).then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
