<!--
DONE - Alterar tempo da cookie
DONE - Scrollactive (ou tentar usar calss CSS usando focus para ver o active)
DONE - validação pela cookie nao me está a permitir fazer play em todos os videos no momento de carregamento da página (Fixe era fazer o play do primeiro video, depois fazer sempre play do focus juntamente com o anterior e o seguinte, e fazer play sempre que se carregasse no butão)
DONE - Corrigir mobile
DONE Correção de titulos e animações
Corrigur cache porque as novas versões necessitam de force refresh, nao pode ser;
Reduzir o tamanho dos titulos das camaras em MOBILE
Criar um buttao de capture e enviar para whatsapp
Verificar se a password está mesmo a guardar 180 dias

Talves o menu tenha que ter scroll
Corrigir visao landscape (pelo meno remover o header)
versao mobile -> https://www.npmjs.com/package/vue-scroll-picker
criar top ten de captures
criar pagina apos login para mostrar "cam" e "campeonato Padel";
evocar o formulario de contacto
notificaoes como o atalho para desktop, guardar bookmark, banner de publicidade, etc...
Corrigir scroll vuejs add space before section when jump by anchor
user online para uma api
Rating das ondas para uma api - https://quasar.dev/vue-components/rating
Criar vários tipo de user (admin, cam, etc...)
botao para by coffee
banner de publicidade
limpar erros

-->
<template>
  <q-layout view="lhr lpR lFr" class="camera-page bg-white" @scroll="scrollHandler">
    <webcam-sidebar
      v-model="drawer"
      :webcams="webcams"
      :mobile="mobile"
      :expanded-item="expandedItem"
      @go-to-camera="goToCamera"
      @update:expanded-item="expandedItem = $event"
    />
    <q-page-container>
      <div v-if="captureError" class="q-pa-md" role="alert">{{ captureError }}</div>
      <div v-if="cameraSwitchError" class="q-pa-md" role="alert">{{ cameraSwitchError }}</div>
      <div v-if="showWeather" class="weather-widget q-pa-md">
        <div v-if="weatherWidgetError" role="alert">
          Não foi possível carregar a previsão meteorológica.
          <q-btn flat no-caps label="Tentar novamente" @click="loadWeatherWidget" />
        </div>
        <bestweather-forecast
          location="Caparica"
          latitude="38.6175"
          longitude="-9.191389"
          layout="auto"
          lang="pt"
          theme="light"
          data-source="live"
          max-days="3"
        ></bestweather-forecast>
      </div>
      <div class="camera-sections">
        <webcam-item
          v-for="(beach, index) in webcams"
          :key="beach.anchor"
          :beach="beach"
          :index="index"
          :mobile="mobile"
          :video-options="videoOptions"
          :has-previous="hasCamera(index, -1)"
          :has-next="hasCamera(index, 1)"
          :displayed-camera="displayedCamera(index)"
          @copy-url="showDialog = true; copyURL($event)"
          @capture-image="captureImage"
          @previous-camera="navigateCamera($event, -1)"
          @next-camera="navigateCamera($event, 1)"
          @fullscreen-change="onFullscreenChange"
          ref="webcamItems"
        />
      </div>

      <q-dialog v-model="showDialog">
        <q-card class="bg-white text-black q-pa-md" style="width: 700px; max-width: 80vw;">
          <q-toolbar class="row items-center">
            <q-avatar size=70px style="height: auto;">
              <img src="icons/android-chrome-192x192.png" alt="Huna logo">
            </q-avatar>
            <q-toolbar-title><span class="text-weight-bold text-h5">Link copiado com sucesso</span></q-toolbar-title>
          </q-toolbar>
          <q-card-section class="text-h6">
            <span class="text-h6">Atenção:</span> Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo.
          </q-card-section>
          <q-card-actions align="right">
              <q-btn flat label="Eu entendi" color="black" v-close-popup />
            </q-card-actions>
        </q-card>
      </q-dialog>

      <q-page-sticky position="bottom-right" :offset="[4, 12]">
        <div class="q-mini-drawer-hide">
          <q-btn
            round
            unelevated
            :icon="drawer ? 'chevron_right' : 'chevron_left'"
            :aria-label="drawer ? 'Fechar menu de câmaras' : 'Abrir menu de câmaras'"
            @click="drawer = !drawer"
          />
        </div>
      </q-page-sticky>

    </q-page-container>
  </q-layout>
</template>

<script>
import WebcamItem from 'components/WebcamItem.vue'
import WebcamSidebar from 'components/WebcamSidebar.vue'
import axios from 'axios'
import { loadWeatherWidget } from 'src/utils/weather-widget.mjs'
import { findCamera } from 'src/utils/camera-navigation.mjs'
import { copyText } from 'src/utils/clipboard.mjs'

export default {
  name: 'Cam4',
  components: {
    WebcamItem,
    WebcamSidebar
  },
  inject: {
    cameraLayout: { default: () => ({ clearance: 0, height: 0 }) }
  },
  methods: {
    async getLinks () {
      try {
        const response = await axios.get(this.url_links)
        this.webcams = response.data
        console.log(this.webcams)
      } catch (error) {
        console.log('[foo] Something is wrong with urllinks.json file: ', error)
      }
    },
    iconSelect (type) {
      if (type === 'previsoes') {
        return 'img:/icons/analytics.svg'
      } else {
        return 'img:/icons/beach.svg'
      }
    },
    async copyURL (anchor) {
      try {
        this.copiedUrl = window.location.origin + this.$route.path + '#' + anchor
        await copyText(this.copiedUrl)
        // this.toolbar = true
      } catch ($e) {
        alert('Cannot copy')
      }
    },
    scrollHandler () {
      if (this.cameraDisposed || this.fsComponentIndex >= 0) return
      if (this.navigationTarget >= 0) {
        clearTimeout(this._navigationTimer)
        this._navigationTimer = setTimeout(this.cancelNavigation, 180)
        return
      }
      const current = this.webcams[this.activeCameraIndex]
      const currentElement = current && document.getElementById(current.anchor)
      const activeIndex = currentElement && this.isInViewport(currentElement)
        ? this.activeCameraIndex
        : this.webcams.findIndex(item => {
          const element = document.getElementById(item.anchor)
          return element && this.isInViewport(element)
        })
      // Only change playback when entering/leaving a camera. Scroll events must
      // not override a user's play/pause click on the current camera.
      if (activeIndex === this.activeCameraIndex) return
      this.selectCamera(activeIndex)
    },
    videoAt (index) {
      const component = this.$refs.webcamItems && this.$refs.webcamItems[index]
      return component && component.$refs.video
    },
    selectCamera (activeIndex, { play = true } = {}) {
      this.activeCameraIndex = activeIndex
      this.webcams.forEach((item, index) => {
        const navBar = document.getElementsByClassName(item.anchor)[0]
        if (navBar) navBar.classList.toggle('btn_active', index === activeIndex)
        const video = this.videoAt(index)
        if (video) {
          if (index === activeIndex && play) video.play()
          else video.pause()
        }
      })
    },
    start () {
      // console.log('start')
      const video = this.$refs.webcamItems && this.$refs.webcamItems[0].$refs.video
      if (video) video.play()
    },
    isInViewport (element) {
      const rect = element.getBoundingClientRect()
      return rect.bottom > this.cameraLayout.clearance && rect.top < window.innerHeight
    },
    isMobile () {
      if (window.innerWidth <= 760) {
        this.mobile = true
        // console.log('mobile foo TRUE')
      } else {
        this.mobile = false
        // console.log('mobile foo FALSE')
      }
    },
    findCamera (index, step, fullscreen = false) {
      return findCamera(this.webcams, index, step, fullscreen)
    },
    goToCamera (anchor) {
      const index = this.webcams.findIndex(camera => camera.anchor === anchor)
      if (index < 0 || this.cameraDisposed) return
      this.cancelNavigation()
      this.navigationTarget = index
      // Explicit selection always plays the requested camera, including a
      // paused/reselected card, even when the previous card is still visible.
      this.selectCamera(index)
      this._navigationTimer = setTimeout(this.cancelNavigation, 2000)
      if (this.mobile) this.drawer = false
      this.$nextTick(() => {
        if (this.cameraDisposed || this.navigationTarget !== index) return
        const element = document.getElementById(anchor)
        if (element) {
          // Scrolling upward can reveal the header before arrival. Reserve its
          // measured full height; landscape with no toolbar measures zero.
          const top = window.pageYOffset + element.getBoundingClientRect().top - this.cameraLayout.height
          window.scrollTo({ top, behavior: 'smooth' })
        }
      })
    },
    cancelNavigation () {
      clearTimeout(this._navigationTimer)
      this.navigationTarget = -1
    },
    onNavigationEnd () {
      const camera = this.webcams[this.navigationTarget]
      const element = camera && document.getElementById(camera.anchor)
      if (!element) return
      const requested = window.pageYOffset + element.getBoundingClientRect().top - this.cameraLayout.height
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const destination = Math.max(0, Math.min(requested, maximum))
      if (Math.abs(window.pageYOffset - destination) < 2) this.cancelNavigation()
    },
    onNavigationInput (event) {
      if (event.type !== 'keydown' || ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
        this.cancelNavigation()
      }
    },
    displayedCamera (index) {
      return this.webcams[this.fsComponentIndex === index ? this.fsCameraIndex : index]
    },
    hasCamera (index, step) {
      const fullscreen = this.fsComponentIndex === index
      return this.findCamera(fullscreen ? this.fsCameraIndex : index, step, fullscreen) >= 0
    },
    onFullscreenChange ({ index, isFullscreen }) {
      if (this.cameraDisposed) return
      const video = this.videoAt(index)
      if (!video) return
      const playback = video.getPlaybackIntent()
      this.fsSession += 1
      this.fsQueue = []
      this.cancelNavigation()
      if (isFullscreen) {
        video.cancelSourceChange()
        this.fsComponentIndex = index
        this.fsCameraIndex = index
        this.selectCamera(index, { play: playback })
      } else if (this.fsComponentIndex === index) {
        this.fsComponentIndex = -1
        this.fsCameraIndex = -1
        video.cancelSourceChange()
        // Both the button and Escape use this restoration path. Preserve the
        // user's current pause/play intent, not the incidental loading pause.
        const camera = this.webcams[index]
        const session = this.fsSession
        Promise.resolve(video.restoreSource(camera.src, camera.type, { play: playback })).catch(error => {
          if (!this.cameraDisposed && session === this.fsSession && error.code !== 'SOURCE_CHANGE_CANCELLED') {
            this.cameraSwitchError = 'Não foi possível restaurar esta câmara.'
          }
        })
      }
    },
    navigateCamera (index, step) {
      if (this.fsComponentIndex === index) {
        this.fsQueue.push(step)
        this.processFullscreenQueue()
        return
      }
      const target = this.findCamera(index, step)
      if (target >= 0) {
        this.goToCamera(this.webcams[target].anchor)
      }
    },
    async processFullscreenQueue () {
      const session = this.fsSession
      if (this.processingFullscreenSession === session || this.cameraDisposed) return
      this.processingFullscreenSession = session
      const componentIndex = this.fsComponentIndex
      try {
        while (this.fsQueue.length && session === this.fsSession && this.fsComponentIndex >= 0 && !this.cameraDisposed) {
          const target = this.findCamera(this.fsCameraIndex, this.fsQueue.shift(), true)
          if (target < 0) continue
          const camera = this.webcams[target]
          const video = this.videoAt(componentIndex)
          if (!video) break
          try {
            await video.changeCameraSource(camera.src, camera.type, { play: video.getPlaybackIntent() })
            if (session !== this.fsSession || this.cameraDisposed) break
            this.fsCameraIndex = target
            this.cameraSwitchError = ''
          } catch (error) {
            if (session !== this.fsSession || this.cameraDisposed) break
            // The player rolls back transactionally; the committed identity
            // stays on the previous feed. Drop queued retries after a failure.
            this.fsQueue = []
            if (error.code !== 'SOURCE_CHANGE_CANCELLED') this.cameraSwitchError = 'Não foi possível mudar de câmara. A câmara anterior foi restaurada.'
          }
        }
      } finally {
        if (this.processingFullscreenSession === session) this.processingFullscreenSession = null
        if (!this.cameraDisposed && session === this.fsSession && this.fsQueue.length && this.fsComponentIndex >= 0) this.processFullscreenQueue()
      }
    },
    async captureImage (index) {
      this.captureError = ''
      try {
        const video = this.videoAt(index)
        if (!video || video.sourceChanging) return
        const camera = this.displayedCamera(index)
        const blob = await video.captureFrame()
        if (!blob) throw new Error('No frame available')
        if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
            return
          } catch (error) {
            // Clipboard requires HTTPS and browser permission; offer a download instead.
          }
        }
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = camera.anchor + '.png'
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch (error) {
        this.captureError = 'Não foi possível capturar a imagem desta câmara.'
      }
    },
    async loadWeatherWidget () {
      this.weatherWidgetError = false
      try {
        await loadWeatherWidget()
      } catch (error) {
        this.weatherWidgetError = true
      }
    }
  },
  beforeMount () {
    this.getLinks()
    this.isMobile()
  },
  mounted () {
    window.addEventListener('resize', this.isMobile)
    window.addEventListener('scrollend', this.onNavigationEnd)
    window.addEventListener('wheel', this.onNavigationInput, { passive: true })
    window.addEventListener('touchstart', this.onNavigationInput, { passive: true })
    window.addEventListener('keydown', this.onNavigationInput)
  },
  beforeDestroy () {
    this.cameraDisposed = true
    this.cancelNavigation()
    window.removeEventListener('resize', this.isMobile)
    window.removeEventListener('scrollend', this.onNavigationEnd)
    window.removeEventListener('wheel', this.onNavigationInput)
    window.removeEventListener('touchstart', this.onNavigationInput)
    window.removeEventListener('keydown', this.onNavigationInput)
    const video = this.videoAt(this.fsComponentIndex)
    if (video) video.cancelSourceChange({ rollback: false })
    this.fsSession += 1
    this.fsQueue = []
    this.fsComponentIndex = -1
    this.fsCameraIndex = -1
  },
  watch: {
    showWeather: {
      immediate: true,
      handler (visible) {
        if (visible) this.loadWeatherWidget()
      }
    }
  },
  computed: {
    showWeather () {
      return this.$route.path === '/caparica'
    }
  },
  data () {
    return {
      showDialog: false,
      weatherWidgetError: false,
      captureError: '',
      cameraSwitchError: '',
      fsComponentIndex: -1,
      fsCameraIndex: -1,
      fsSession: 0,
      fsQueue: [],
      processingFullscreenSession: null,
      activeCameraIndex: -1,
      navigationTarget: -1,
      cameraDisposed: false,
      key: 0,
      drawer: false,
      expandedItem: null,
      mobile: true,
      videoOptions: {
        controls: true,
        muted: 'muted'
      },
      webcams: [],
      url_links: 'https://api.huna.pt/urllinks.json' // Guardei o ficherio na raiz do projeto para backup
    }
  }
}
</script>

<style lang="sass">

.camera-page .camera-sections
  padding-top: 16px
  h4
    margin: 10px
.camera-page .q-page-sticky
  z-index: 3100
  .q-btn
    background: #ffa000
.camera-page .sidebar
  .q-drawer
    top: var(--camera-header-clearance, 0px)
</style>
