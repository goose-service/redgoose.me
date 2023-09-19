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
            <em>{order}</em>
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

<script>
import { onMount } from 'svelte'
import { ofetch } from 'ofetch'
import { error } from '../store'
import { hashScroll } from '../libs/util'
import Loading from '../components/loading/loading-page.svelte'
import Error from '../components/error.svelte'
import StarButton from '../components/pages/article/star-button.svelte'
import ContentBody from '../components/pages/article/content-body.svelte'
import LightBox from '../components/pages/article/lightbox.svelte'

export let route
let loading = true
let srl
let title
let headDescription
let order
let contentBody
let starButton = {
  disabled: false,
  count: 0,
}
let empty = false
let lightbox = {}

$: _contentBody = contentBody

async function fetchData()
{
  try
  {
    loading = true
    let res = await ofetch(`/api/article/${route.params.article}/`, {
      responseType: 'json',
    })
    srl = res.srl
    title = res.title
    headDescription = [ res.nestName, res.categoryName ]
    order = res.order
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

async function onClickStar()
{
  try
  {
    let res = await ofetch(`/api/article/${route.params.article}/star/`, {
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

function onOpenLightbox({ detail: { src, srcDark, alt } })
{
  lightbox.src = src
  lightbox.srcDark = srcDark
  lightbox.alt = alt
}

function onCloseLightbox()
{
  lightbox.src = undefined
  lightbox.srcDark = undefined
  lightbox.alt = undefined
}

onMount(() => fetchData().then())
</script>

<style src="./article.scss" lang="scss"></style>
