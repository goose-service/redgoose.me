<div class="viewport">
  <Header/>
  <div class="container">
    <Route path="/" let:meta>
      <Lazy component={import('./pages/home.svelte')} route={meta}/>
    </Route>
    <Route path="/nest/:nest/*">
      <Route path="/" let:meta>
        <Lazy component={import('./pages/nest.svelte')} route={meta}/>
      </Route>
      <Route path="/:category/" let:meta>
        <Lazy component={import('./pages/nest.svelte')} route={meta}/>
      </Route>
    </Route>
    <Route path="/article/:article/" let:meta>
      <Lazy component={import('./pages/article.svelte')} route={meta}/>
    </Route>
    <Route path="/page/*" let:meta>
      <Route path="/about/">
        <Lazy component={import('./pages/page/about.svelte')} route={meta}/>
      </Route>
    </Route>
    <Route fallback let:meta>
      <Lazy component={import('./pages/error/404.svelte')} route={meta}/>
    </Route>
  </div>
  <Footer/>
</div>

<script lang="ts">
import { Route, router } from 'tinro'
import Lazy from './components/layout/lazy.svelte'
import Header from './components/layout/header/index.svelte'
import Footer from './components/layout/footer/index.svelte'

router.subscribe(() => {})
</script>

<style src="./main.scss" lang="scss"></style>
