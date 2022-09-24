<template>
  <q-layout view="hHh lpR fFf">
    <main-menu />
    <q-page-container class="container">
      <!-- foo a validação pela cookie nao me está a permitir fazer play em todos os videos no momento de carregamento da página -->
      <router-view v-if="isLoggedIn || (this.$cookies.isKey('pwd') && this.$cookies.get('pwd').code === 'caparica' && this.$cookies.get('pwd').token === 'v1' ) "></router-view>
      <Login v-else @Login::loginResult="handleLoginResult"/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
  .container
    padding:0px !important
</style>

<script>
import MainMenu from 'components/MainMenu.vue'
import Login from 'components/Login.vue'

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
