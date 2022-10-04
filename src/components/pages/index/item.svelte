<li class="item">
  <a href="/article/123/" class="item__wrap">
    <figure class="item__image">
      {#if true}
        <img src="https://images.unsplash.com/photo-1664627206290-9a9877f81da3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60" alt="">
      {:else}
        <EmptyIcon/>
      {/if}
    </figure>
    <div class="item__body">
      <strong>title</strong>
      <span>
        <em>nest name</em>
        <em>category</em>
      </span>
    </div>
  </a>
</li>

<script lang="ts">
import EmptyIcon from '../../icons/empty/index.svelte'
</script>

<style src="./item.scss" lang="scss"></style>
