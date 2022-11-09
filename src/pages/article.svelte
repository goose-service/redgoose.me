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
        <ContentBody
          body={_contentBody}
          on:openLightbox={onOpenLightbox}/>
      </div>
      <nav class="article__star">
        <StarButton
          count={starButton.count}
          disabled={starButton.disabled}
          on:click={onClickStar}/>
      </nav>
    </div>
  {/if}
</article>
{#if lightbox?.src}
  <LightBox
    {...lightbox}
    on:close={onCloseLightbox}/>
{/if}

<script lang="ts">
import { onMount } from 'svelte'
import { $fetch as fetch } from 'ohmyfetch'
import type { FetchOptions } from 'ohmyfetch'
import { error } from '../store'
import { hashScroll } from '../libs/util'
import Loading from '../components/loading/loading-page.svelte'
import Error from '../components/error.svelte'
import StarButton from '../components/pages/article/star-button.svelte'
import ContentBody from '../components/pages/article/content-body.svelte'
import LightBox from '../components/pages/article/lightbox.svelte'

interface Lightbox {
  src?: string
  alt?: string
}

export let route: Route
let loading: boolean = true
let srl: number
let title: string
let headDescription: string[]
let contentBody: string
let starButton = {
  disabled: false,
  count: 0,
}
let empty: boolean = false
let lightbox: Lightbox = {}

$: _contentBody = contentBody

async function fetchData(): Promise<void>
{
  try
  {
    loading = true
    let res = await fetch(`/api/article/${route.params.article}/`, <FetchOptions>{
      responseType: 'json',
    })
    srl = res.srl
    title = res.title
    headDescription = [ res.nestName, res.categoryName ]
    contentBody = res.content
    starButton.disabled = !res.enableStarButton
    starButton.count = res.star
    loading = false
    // move scroll
    hashScroll(location.hash)
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

async function onClickStar(): Promise<void>
{
  try
  {
    let res = await fetch(`/api/article/${route.params.article}/star/`, <FetchOptions>{
      method: 'post',
      responseType: 'json',
    })
    starButton.disabled = true
    starButton.count = Number(res.star)
    if (!res.success) throw new Error(res.message)
  }
  catch (e)
  {
    alert('Failed update star')
  }
}

function onOpenLightbox({ detail: { src, alt } }): void
{
  lightbox.src = src
  lightbox.alt = alt
}

function onCloseLightbox(): void
{
  lightbox.src = undefined
  lightbox.alt = undefined
}

onMount(() => fetchData().then())
</script>

<style src="./article.scss" lang="scss"></style>
