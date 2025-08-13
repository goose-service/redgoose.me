
export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/home/index.vue'),
    meta: { layout: 'default', active: 'home' },
  },
  {
    path: '/nest/:code/',
    name: 'Nest',
    component: () => import('../pages/nest/index.vue'),
    meta: { layout: 'default', active: 'nest' },
  },
  {
    path: '/nest/:code/:category/',
    name: 'NestCategory',
    component: () => import('../pages/nest/index.vue'),
    meta: { layout: 'default', active: 'nest' },
  },
  {
    path: '/article/:srl/',
    name: 'Article',
    component: () => import('../pages/article/index.vue'),
    meta: { layout: 'default', active: 'article' },
  },
  {
    path: '/page/about/',
    name: 'PageAbout',
    component: () => import('../pages/page/about.vue'),
    meta: { layout: 'default', active: 'about' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/index.vue'),
    props: {
      code: 404,
      pageTitle: '페이지가 없습니다.',
      pageDescription: '현재 페이지가 없거나 주소가 잘못되었습니다.',
    },
    meta: { layout: 'blank', active: 'service' },
  },
]
