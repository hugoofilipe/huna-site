<template>
    <div>
        <q-header class=" bg-black"  elevated reveal>
            <q-toolbar class="lt-md q-my-lg menu_mobile">
              <q-btn
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
                class="q-px-sm"
              >
                <img src="images/huna.svg">
              </q-avatar>
            </q-toolbar>

            <q-toolbar class="gt-sm q-px-lg q-my-md menu ">
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
          content-class="bg-black"
          :width="300"
        >
          <q-avatar
                square
                size=100px
                class="q-px-sm text-center q-ma-lg"
              >
                <img src="images/huna.svg">
              </q-avatar>
          <q-list padding style="color:white">
            <q-item clickable v-ripple class="text-h5">
              <q-item-section>
                {{$t('services')}}
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="text-h5">
              <q-item-section>
                {{$t('portfolio')}}
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="text-h5">
              <q-item-section>
                {{$t('prices')}}
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Bottom -->
          <q-list
            class="fixed-bottom"
          >
            <div class="row">
              <q-btn
                flat
                clickable
                v-ripple
                :to="{ name:'request'}"
                class="col-12 btn-goldenCustom text-white"
              >
                {{ $t('letsTalk') }}
              </q-btn>

              <q-btn
                :label="languageKeyNow"
                class="col-6 q-tab q-tab--no-caps"
                exact
                flat
                color="white"
              >
                <q-menu>
                  <q-list
                    v-for="item in langOptions" :key="item.value" >
                    <q-item
                      clickable
                      v-close-popup
                      class="text-weight-medium"
                      style="font-size:20px"
                    >
                    <q-item-section @click="changeLang(item)">
                        {{ item.label }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn
                flat
                color="white"
                class="col-6"
                @click="$q.dark.toggle()"
                :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
              />
            </div>
          </q-list>
        </q-drawer>
    </div>
</template>

<style lang="sass">
  .menu
    padding: 0px 10%
    span
      font-size: 20px
  .menu_mobile
    span
      font-size: 20px
</style>

<script>
export default {
  name: 'MainMenu',
  methods: {
    changeLang (item) {
      this.lang = item.value
      this.languageKeyNow = item.label
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
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
