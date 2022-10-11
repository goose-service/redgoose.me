<div class="viewport">
  <Header/>
  <div class="container">
    <Route path="/" let:meta>
      <Index route={meta}/>
    </Route>
    <Route path="/nest/:nest/*">
      <Route path="/" let:meta>
        <Nest route={meta}/>
      </Route>
      <Route path="/:category/" let:meta>
        <Nest route={meta}/>
      </Route>
    </Route>
    <Route path="/article/:article/" let:meta>
      <Article route={meta}/>
    </Route>
    <Route path="/page/*">
      <Route path="/about/">
        <About/>
      </Route>
    </Route>
    <Route fallback>
      <NotFound/>
    </Route>
  </div>
  <Footer/>
</div>

<script lang="ts">
import { Route, router } from 'tinro'
import Header from './components/layout/header/index.svelte'
import Footer from './components/layout/footer/index.svelte'
import Index from './pages/home/index.svelte'
import Nest from './pages/nest/index.svelte'
import Article from './pages/article/index.svelte'
import About from './pages/page/about.svelte'
import NotFound from './pages/error/404.svelte'

router.subscribe(() => {
  // console.log('============+>')
})
</script>

<style src="./main.scss" lang="scss"></style>
