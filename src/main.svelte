<div class="viewport">
  <Header/>
  <div class="container">
    <Route path="/" let:meta>
      <Lazy
        component={import('./pages/home/index.svelte')}
        route={meta}/>
    </Route>
    <Route path="/nest/*">
      <Route path="/:nest/*">
        <Route path="/" let:meta>
          <Lazy
            component={import('./pages/nest/index.svelte')}
            route={meta}/>
        </Route>
        <Route path="/:category" let:meta>
          <Lazy
            component={import('./pages/nest/index.svelte')}
            route={meta}/>
        </Route>
      </Route>
    </Route>
    <Route path="/article/:article" let:meta>
      <Lazy
        component={import('./pages/article/index.svelte')}
        route={meta}/>
    </Route>
    <Route path="/page/*">
      <Route path="/about">
        <Lazy component={import('./pages/page/about.svelte')}/>
      </Route>
    </Route>
    <Route fallback>
      <Lazy component={import('./pages/error/404.svelte')}/>
    </Route>
  </div>
  <Footer/>
</div>

<script lang="ts">
import { Route } from 'tinro'
import Lazy from './components/layout/lazy/index.svelte'
import Header from './components/layout/header/index.svelte'
import Footer from './components/layout/footer/index.svelte'
</script>

<style src="./main.scss" lang="scss"></style>
