<template>
  <q-layout view="hHh lpR fFf" :style="{ '--camera-header-clearance': cameraLayout.clearance + 'px' }">
    <main-menu />
    <q-page-container class="container" :class="{ 'camera-container': isCameraPage }">
      <router-view v-if="isLoggedIn || (this.$cookies.isKey('pwd') && this.$cookies.get('pwd').code === 'caparica' && this.$cookies.get('pwd').token === 'v1' ) "></router-view>
      <Login v-else @Login::loginResult="handleLoginResult"/>
    </q-page-container>
    <!-- <footer-main /> -->
  </q-layout>
</template>

<style lang="sass">
  .container:not(.camera-container)
    padding:0px !important
</style>

<script>
import MainMenu from 'components/MainMenu.vue'
import Login from 'components/Login.vue'
import { observeHeaderClearance } from 'src/utils/header-clearance.mjs'
// import footerMain from 'src/components/Footer.vue'

export default {
  name: 'Protected',
  components: { MainMenu, Login },
  provide () {
    return { cameraLayout: this.cameraLayout }
  },
  data () {
    return {
      userIsLoggedIn: false,
      cameraLayout: { clearance: 0, height: 0 }
    }
  },
  mounted () {
    const header = this.$el.querySelector('.q-header')
    if (header) {
      this._stopHeaderObserver = observeHeaderClearance(header, (clearance, height) => {
        this.cameraLayout.clearance = clearance
        this.cameraLayout.height = height
      })
    }
  },
  beforeDestroy () {
    if (this._stopHeaderObserver) this._stopHeaderObserver()
  },
  computed: {
    isLoggedIn () {
      return this.userIsLoggedIn
    },
    isCameraPage () {
      return this.$route.path === '/cam' || this.$route.path === '/caparica'
    }
  },
  methods: {
    handleLoginResult ({ loginResult }) {
      this.userIsLoggedIn = loginResult
    }
  }
}
</script>
