<template>
    <div>
        <q-header class=" bg-black"  elevated reveal>
            <q-toolbar class="lt-md q-my-sm menu_mobile">
              <q-btn
                  flat
                  dense
                  round
                  icon="menu"
                  aria-label="Menu"
                  @click="leftDrawerOpen = !leftDrawerOpen"
              />
              <router-link to="#welcome">
                <q-avatar
                  square
                  size=100px
                  class="q-px-sm"
                >
                  <img src="images/huna.svg" alt="Huna logo">
                </q-avatar>
              </router-link>
            </q-toolbar>

            <q-toolbar class="gt-sm q-px-lg q-my-sm menu ">
              <router-link to="#welcome">
                <q-avatar
                  square
                  size=100px
                >
                  <img src="images/huna.svg" alt="Huna logo" >
                </q-avatar>
              </router-link>
              <q-space />
              <div>
                <q-btn no-caps type="a" href="#how" :label="$t('how')" />
                <q-btn no-caps type="a" href="#services" :label="$t('services')" />
                <q-btn no-caps type="a" href="#prices" :label="$t('prices')" />
                <q-btn
                  no-caps
                  class="btn-goldenCustom btn-rounded"
                  type="a"
                  href="#contacto"
                  text-color="white"
                  rounded
                  :label="$t('letsTalk')"
                />
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
          <router-link to="#welcome">
            <q-avatar
              square
              size=100px
              class="q-px-sm text-center q-ma-lg"
            >
              <img src="images/huna.svg" alt="Huna logo" >
            </q-avatar>
          </router-link>
          <q-list padding style="color:white">
            <q-item clickable v-ripple class="text-h5">
              <q-item-section>
                <router-link tag="btn" to="#how">
                  {{$t('how')}}
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="text-h5">
              <q-item-section>
                <router-link tag="btn" to="#services">
                  {{$t('services')}}
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="text-h5">
              <q-item-section>
                <router-link tag="btn" to="#prices">
                  {{$t('prices')}}
                </router-link>
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
                type="a"
                href="#contacto"
                :label="$t('letsTalk')"
                class="col-12 btn-goldenCustom text-white"
              />

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
