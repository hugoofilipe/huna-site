
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
    path: '/cam',
    component: () => import('layouts/Protected.vue'),
    children: [
      { path: '', component: () => import('pages/Cam.vue') }
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
