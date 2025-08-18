<template>
<article class="about">
  <div class="wrap">
    <header class="header">
      <p>Introduce</p>
      <h1>{{data.title}}</h1>
    </header>
    <figure class="profile">
      <img
        :srcset="[ `${data.coverImage.src[1]} 2x`, `${data.coverImage.src[0]} 1x` ].join(', ')"
        :src="data.coverImage.src[0]"
        :alt="data.coverImage.alt"
        width="256"
        height="256"/>
    </figure>
    <div class="description">
      <p v-html="data.description"/>
    </div>
    <div class="meta">
      <section v-for="o in data.information">
        <h1>{{o.title}}</h1>
        <dl>
          <template v-for="oo in o.items">
            <dt>{{oo.label}}</dt>
            <dd v-html="oo.body"/>
          </template>
        </dl>
      </section>
    </div>
  </div>
</article>
</template>

<script setup>
import data from '../../../server/resource/about.json'
</script>

<style src="./about.scss" lang="scss" scoped></style>
