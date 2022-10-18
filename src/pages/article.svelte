<article class="article">
  {#if loading}
    <Loading full={true} move={true}/>
  {:else if error}
    <div class="article__error">
      <img src="/assets/images/img-error.png" alt="error"/>
      <p>Not found data</p>
    </div>
  {:else}
    <div class="article__wrap">
      <header class="article__header">
        <p>
          {#each headDescription as label}
            <span>{label}</span>
          {/each}
        </p>
        <h1>{title === '.' ? 'Untitled work' : title}</h1>
      </header>
      <div class="article__body redgoose-body redgoose-body--dark">
        {@html _contentBody}
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
import { error } from '../store'
import { sleep } from '../libs/util'
import Loading from '../components/loading/loading-page.svelte'
import LikeButton from '../components/pages/article/like-button.svelte'

export let route: Route
let loading: boolean = false
let title: string = '아티클 제목제목'
let error: object = undefined
let headDescription: string[] = [ 'foo', 'bar' ]
let contentBody: string = '# sndogjnsdg\nsdnmgksd gmk sdgpmksdg'
let likeButton = {
  disabled: false,
  count: 0,
}

$: _contentBody = contentBody

async function fetchData(): Promise<void>
{
  try
  {
    loading = true
    console.log('fetchData()', route)
    // TODO: /api/article/{SRL}/ 요청
    await sleep(1000)
    loading = false
  }
  catch (e)
  {
    const { status, message } = e.response?._data
    error.update(() => ({
      status: status || 500,
      message: message || 'Unknown error',
    }))
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
