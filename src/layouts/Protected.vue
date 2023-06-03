<template>
  <q-layout view="hHh lpR fFf">
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
    }
  },
  methods: {
    handleLoginResult ({ loginResult }) {
      this.userIsLoggedIn = loginResult
    }
  }
}
</script>
