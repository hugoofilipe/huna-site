<template>
    <div>
        <q-header class=" bg-black"  elevated reveal>
            <q-toolbar class="q-px-lg q-my-md menu ">
              <q-btn
                  class="lt-sm"
                  flat
                  dense
                  round
                  icon="menu"
                  aria-label="Menu"
                  @click="leftDrawerOpen = !leftDrawerOpen"
              />
              <q-avatar
                square
                size=100px
              >
                <img src="images/huna.svg">
              </q-avatar>

              <q-space />
              <div>
                <q-btn no-caps :label="$t('services')" />
                <q-btn no-caps :label="$t('portfolio')" />
                <q-btn no-caps :label="$t('prices')" />
                <q-btn no-caps class="btn-goldenCustom" text-clor="white" rounded :label="$t('letsTalk')" />

                <q-btn :label="languageKeyNow">
                  <q-menu>
                    <q-list
                      v-for="item in langOptions" :key="item.value" >
                      <q-item
                        clickable
                        v-close-popup
                        @click="changeLang(item)"
                        class="text-weight-medium"
                        style="font-size:20px"
                      >
                          {{ item.label }}
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>

                <q-btn dense flat round
                  @click="$q.dark.toggle()"
                  color="white"
                  :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
                />
              </div>
            </q-toolbar>
        </q-header>

        <q-drawer
        v-model="leftDrawerOpen"

        bordered
        content-class="bg-grey-1"
        >
            <q-list>
            <q-item-label
                header
                class="text-grey-8"
            >
                Essential Links
            </q-item-label>
            <EssentialLink
                v-for="link in essentialLinks"
                :key="link.title"
                v-bind="link"
            />
            </q-list>
        </q-drawer>
    </div>
</template>

<style lang="sass">
  .menu
    padding: 0px 10%
    span
      font-size: 20px
</style>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github teste',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]
export default {
  name: 'MainMenu',
  components: { EssentialLink },
  methods: {
    changeLang (item) {
      this.lang = item.value
      this.languageKeyNow = item.label
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      lang: this.$i18n.locale,
      languageKeyNow: 'PT',
      langOptions: [
        { value: 'pt-PT', label: 'PT' },
        { value: 'en-US', label: 'EN' }
      ]
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
