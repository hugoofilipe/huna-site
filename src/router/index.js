import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCarousel from 'vue-carousel'
import Carousel3d from 'vue-carousel-3d'

import routes from './routes'

import VueGtag from 'vue-gtag'

Vue.use(VueRouter)
Vue.use(VueCarousel) // https://ssense.github.io/vue-carousel/examples/
Vue.use(Carousel3d) // https://wlada.github.io/vue-carousel-3d/guide/
Vue.use(VueGtag, {
  config: { id: 'UA-137807367-1' }
})

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    // scrollBehavior: () => ({ x: 0, y: 0 }),
    scrollBehavior: function (to, from, savedPosition) {
      if (to.hash) {
        return { selector: to.hash }
      } else {
        return { x: 0, y: 0 }
      }
    },
    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    // mode: process.env.VUE_ROUTER_MODE,
    mode: 'history',
    base: process.env.BASE_URL,
    routes
    // base: process.env.VUE_ROUTER_BASE
  })

  // // This callback runs before every route change, including on page load.
  // Router.beforeEach((to, from, next) => {
  //   // This goes through the matched routes from last to first, finding the closest route with a title.
  //   // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  //   // `/nested`'s will be chosen.
  //   const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

  //   // Find the nearest route element with meta tags.
  //   const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  //   const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  //   // If a route with a title was found, set the document (page) title to that value.
  //   if (nearestWithTitle) {
  //     document.title = nearestWithTitle.meta.title
  //   } else if (previousNearestWithMeta) {
  //     document.title = previousNearestWithMeta.meta.title
  //   }

  //   // Remove any stale meta tags from the document using the key attribute we set below.
  //   Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

  //   // Skip rendering meta tags if there are none.
  //   if (!nearestWithMeta) return next()

  //   // Turn the meta tag definitions into actual elements in the head.
  //   nearestWithMeta.meta.metaTags.map(tagDef => {
  //     const tag = document.createElement('meta')

  //     Object.keys(tagDef).forEach(key => {
  //       tag.setAttribute(key, tagDef[key])
  //     })

  //     // We use this to track which meta tags we create so we don't interfere with other ones.
  //     tag.setAttribute('data-vue-router-controlled', '')

  //     return tag
  //   })
  //   // Add the meta tags to the document head.
  //     .forEach(tag => document.head.appendChild(tag))
  //   next()
  // })

  return Router
}
