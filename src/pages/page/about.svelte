<article class="about">
  <div class="about__wrap">
    <header class="about__header">
      <p>Introduce</p>
      <h1>{content.title}</h1>
    </header>
    <figure class="about__profile">
      <img
        srcset={`${content.coverImage.src[1]} 2x, ${content.coverImage.src[0]} 1x`}
        src={content.coverImage.src[0]}
        alt={content.coverImage.alt}/>
    </figure>
    <div class="about__description">
      <p>
        {@html content.description}
      </p>
    </div>
    <div class="about__metas">
      <div>
        {#each content.information as o,k}
          <section>
            <h1>{o.title}</h1>
            <dl>
              {#each o.items as oo}
                <dt>{oo.label}</dt>
                <dd>{@html oo.body}</dd>
              {/each}
            </dl>
          </section>
        {/each}
      </div>
    </div>
  </div>
</article>

<script lang="ts">
import content from '../../../server/resource/about.json'
export let route: Route = undefined
</script>

<style src="./about.scss" lang="scss"></style>
