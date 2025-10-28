<template>
  <q-layout view="hHh lpR fFf" :class="{ 'cam4-layout': isCam4Page }">
    <main-menu />
    <q-page-container class="container">
      <router-view v-if="isLoggedIn || (this.$cookies.isKey('pwd') && this.$cookies.get('pwd').code === 'caparica' && this.$cookies.get('pwd').token === 'v1' ) "></router-view>
      <Login v-else @Login::loginResult="handleLoginResult"/>
    </q-page-container>
    <!-- <footer-main /> -->
  </q-layout>
</template>

<style lang="sass">
  .container
    padding:0px !important

  // Cam4 specific styles
  .cam4-layout
    .q-header
      position: absolute
</style>

<script>
import MainMenu from 'components/MainMenu.vue'
import Login from 'components/Login.vue'
// import footerMain from 'src/components/Footer.vue'

export default {
  name: 'Protected',
  components: { MainMenu, Login },
  data () {
    return {
      userIsLoggedIn: false
    }
  },
  computed: {
    isLoggedIn () {
      return this.userIsLoggedIn
    },
    isCam4Page () {
      // Check if current page is Cam4
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
