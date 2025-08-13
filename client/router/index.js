import { createRouter, createWebHistory } from 'vue-router'
import map from './map.js'

/** @var {Router} router */
const router = createRouter({
  history: createWebHistory('/'),
  routes: map,
})

// hook
router.beforeEach(async (to, _from) => {
  // console.log('to', to)
  // TODO: scroll-y reset
})

export default router
