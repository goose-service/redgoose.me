<article class="article">
  {#if loading}
    <Loading full={true} move={true}/>
  {:else if empty}
    <div class="article__empty">
      <Error status={204} message="no article"/>
    </div>
  {:else}
    <div class="article__wrap">
      <header class="article__header">
        {#if headDescription?.length > 0}
          <p>
            {#each headDescription as label}
              <span>{label}</span>
            {/each}
          </p>
        {/if}
        <h1>{title === '.' ? 'Untitled work' : title}</h1>
      </header>
      <div class="article__body">
        <ContentBody body={_contentBody}/>
      </div>
      <nav class="article__like">
        <LikeButton
          count={likeButton.count}
          disabled={likeButton.disabled}/>
      </nav>
    </div>
  {/if}
</article>

<script lang="ts">
import { onMount } from 'svelte'
import { $fetch as fetch } from 'ohmyfetch'
import { error } from '../store'
import Loading from '../components/loading/loading-page.svelte'
import Error from '../components/error.svelte'
import LikeButton from '../components/pages/article/like-button.svelte'
import ContentBody from '../components/pages/article/content-body.svelte'

export let route: Route
let loading: boolean = true
let srl: number
let title: string
let headDescription: string[]
let contentBody: string
let likeButton = {
  disabled: false,
  count: 0,
}
let empty: boolean = false

$: _contentBody = contentBody

async function fetchData(): Promise<void>
{
  try
  {
    loading = true
    let res = await fetch(`/api/article/${route.params.article}/`, {
      responseType: 'json',
    })
    srl = res.srl
    title = res.title
    headDescription = [ res.nestName, res.categoryName ]
    contentBody = res.content
    likeButton.disabled = false
    likeButton.count = res.star
    loading = false
  }
  catch (e)
  {
    const status = e.response?._data?.status || 500
    const message = e.response?._data?.message || 'Unknown error'
    if (status === 404)
    {
      empty = true
    }
    else
    {
      error.update(() => ({ status, message }))
    }
    loading = false
  }
}

async function onClickLike(): Promise<void>
{
  console.log('onClickLike()')
  // TODO: /api/article/{SRL}/onLike/ 요청
}

onMount(() => fetchData().then())
</script>

<style src="./article.scss" lang="scss"></style>
