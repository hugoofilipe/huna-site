import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCarousel from 'vue-carousel'
import Carousel3d from 'vue-carousel-3d'
import VueMeta from 'vue-meta'
import routes from './routes'
import VueGtag from 'vue-gtag'
// import VueScrollactive from 'vue-scrollactive'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies, { expire: '180d' })

// Vue.use(VueScrollactive)

Vue.use(VueRouter)
Vue.use(VueCarousel) // https://ssense.github.io/vue-carousel/examples/
Vue.use(Carousel3d) // https://wlada.github.io/vue-carousel-3d/guide/
Vue.use(VueGtag, { // https://matteo-gabriele.gitbook.io/vue-gtag/
  config: { id: 'UA-1378  07367-1' },
  routes
})
Vue.use(VueMeta) // https://www.digitalocean.com/community/tutorials/vuejs-vue-meta
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
    routes,
    mode: 'history',
    base: process.env.BASE_URL
    // base: process.env.VUE_ROUTER_BASE
  })
  return Router
}
