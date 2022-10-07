
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/UnProtected.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('src/layouts/UnProtected.vue'),
    children: [
      { path: '', component: () => import('src/components/Login.vue') }
    ]
  },
  {
    // esta é a rota que deve apontar para a página correta
    path: '/cam',
    component: () => import('layouts/Protected.vue'),
    children: [
      { path: '', component: () => import('pages/Cam3.vue') }
    ]
  },
  {
    // primeira versão
    path: '/cam1',
    component: () => import('layouts/Protected.vue'),
    children: [
      { path: '', component: () => import('src/pages/Cam1.vue') }
    ]
  },
  {
    // Versão onde é necessario criar logica ainda
    path: '/cam2',
    component: () => import('layouts/Protected.vue'),
    children: [
      { path: '', component: () => import('src/pages/Cam2.vue') }
    ]
  },
  {
    // Versão usando navscroll-js
    path: '/cam3',
    component: () => import('layouts/Protected.vue'),
    children: [
      { path: '', component: () => import('src/pages/Cam3.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
