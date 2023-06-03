<template>
  <q-layout view="hHh lpR fFf">
    <main-menu />
    <q-page-container class="container">
      <router-view />
      <footer-main />
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
  .container
    padding:0px !important
</style>

<script>
import MainMenu from 'components/MainMenu.vue'
import footerMain from 'src/components/Footer.vue'

export default {
  name: 'MainLayout',
  components: { MainMenu, footerMain }
}
</script>
