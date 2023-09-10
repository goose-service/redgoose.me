<li class="item">
  <a
    href={`/article/${srl}/`}
    class="item__wrap"
    on:mouseenter={onEnterItem}>
    <figure class="item__image">
      {#if image}
        <img src={image} alt={title} loading="lazy"/>
      {:else}
        <i>
          <EmptyIcon/>
        </i>
      {/if}
    </figure>
    <div class="item__body">
      <strong bind:this={elements[0]}>{title}</strong>
      <span bind:this={elements[1]}>{description}</span>
    </div>
  </a>
</li>

<script>
import shuffle from 'auto-writer/src/shuffle'
import { EmptyIcon } from '../../icons'

let elements = []
export let srl
export let image
export let title
export let description

function onEnterItem()
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
