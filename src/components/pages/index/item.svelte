<li class="item">
  <a
    href={`/article/${srl}/`}
    class="item__wrap"
    on:mouseenter={onEnterItem}>
    <figure class="item__image">
      {#if true}
        <img src={image} alt={title} loading="lazy"/>
      {:else}
        <EmptyIcon/>
      {/if}
    </figure>
    <div class="item__body">
      <strong bind:this={elements[0]}>{title}</strong>
      <span bind:this={elements[1]}>{description}</span>
    </div>
  </a>
</li>

<script lang="ts">
import shuffle from 'auto-writer/src/shuffle'
import EmptyIcon from '../../icons/empty/index.svelte'

let elements = []
export let srl: number = 123
export let image: string = 'https://images.unsplash.com/photo-1664627206290-9a9877f81da3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60'
export let title: string = 'title'
export let description: string = 'description'

function onEnterItem(e: MouseEvent): void
{
  elements.forEach((el, k) => {
    setTimeout(() => shuffle(el, {
      text: el.innerText,
      pattern: 'abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ',
      randomTextType: k === 0 ? 'pattern' : 'unicode',
    }), 180 * k);
  })
}
</script>

<style src="./item.scss" lang="scss"></style>
