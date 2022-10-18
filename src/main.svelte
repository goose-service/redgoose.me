<div class="viewport">
  <Header/>
  <div class="container">
    {#if !_error}
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
    {:else}
      <ErrorPage src={_error}/>
    {/if}
  </div>
  <Footer/>
</div>

<script lang="ts">
import { Route, router } from 'tinro'
import { error } from './store'
import Lazy from './components/layout/lazy.svelte'
import Header from './components/layout/header/index.svelte'
import Footer from './components/layout/footer/index.svelte'
import ErrorPage from './pages/error/500.svelte'

let _error: ServiceError

router.subscribe(() => {
  error.update(() => (undefined))
})
error.subscribe(value => {
  _error = value
})
</script>

<style src="./main.scss" lang="scss"></style>
