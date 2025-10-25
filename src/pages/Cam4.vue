<template>
  <q-layout view="lhr lpR lFr" class="bg-white" @scroll="scrollHandler">
    <!-- Ajuste no q-drawer para posicioná-lo abaixo do header -->
    <q-drawer
      v-model="drawer"
      show-if-above
      side="right"
      :width="320"
      :breakpoint="600"
      class="bg-grey-3 sidebar"
      :content-style="mobile ? {} : { top: '60px' }"
      :overlay="mobile"
      @hide="drawer = false"
    >
      <!-- Drawer header (useful on mobile) -->
      <q-toolbar class="q-pa-sm">
        <q-toolbar-title class="text-h6">Câmaras</q-toolbar-title>
        <q-btn dense flat icon="close" v-if="mobile" @click="drawer = false" aria-label="Fechar menu" />
      </q-toolbar>

      <div class="sidebar-content q-pa-xs">
        <q-list padding>
          <!-- Mobile: Simple clickable items for direct navigation -->
          <template v-if="mobile">
            <q-item
              v-for="(beach, index) in webcams"
              :key="index"
              clickable
              v-ripple
              @click="goToCamera(beach.anchor, index)"
              :class="'text-h6 menu-item-mobile ' + beach.anchor"
              active-class="text-black"
            >
              <q-item-section avatar>
                <q-icon :name="iconSelect(beach.type)" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ beach.title }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </template>

          <!-- Desktop: Expansion items with details -->
          <template v-else>
            <q-expansion-item
              v-for="(beach, index) in webcams"
              :key="index"
              :label="beach.title"
              dense
              dense-toggle
              expand-icon-toggle
              expand-separator
              @click="goToCamera(beach.anchor, index)"
              group="beach"
              :class="'text-h6 ' + beach.anchor"
              :icon="iconSelect(beach.type)"
              active-class="text-black"
              :name="index"
              :model-value="expandedItem === index"
            >
              <q-card>
                <q-card-section style="white-space: normal">
                  <p class="text-subtitle2">Type: <strong>{{beach.type}}</strong></p>
                  <p class="text-caption">SRC: {{beach.src}}</p>
                  <p class="text-caption">Anchor: {{beach.anchor}}</p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </template>
        </q-list>
      </div>
    </q-drawer>
    <q-page-container>
      <div>
        <div v-for="(beach, index) in webcams" v-bind:key="index" class="section q-pa-md" :id="beach.anchor">
          <div class="title row items-start items-center">
            <h4 class="text-weight-medium ">
              {{beach.title}}
            </h4>
            <q-btn icon="link" @click="showDialog = true; copyURL(beach.anchor)" name="copy-link"  aria-label="Copiar link" flat round size="small" style="color: #ffa000;" />
          </div>
          <q-btn v-if="!mobile" round icon="camera_alt" style="font-size: 14px;margin-top: 8px;top: 60px;float: right;z-index: 20;right: 60px; cursor: pointer; background: #ffa000;" size="md" @click.stop.prevent="captureImage(index)" title="Capturar imagem" />

          <video-player
            v-if="beach.type === 'application/x-mpegURL'"
            :options="videoOptions"
            :src="beach.src"
            :type="beach.type"
            :anchor="beach.anchor"
            :userAgent="beach.userAgent"
            :referer="beach.referer"
            :has-previous="hasPreviousCamera(index)"
            :has-next="hasNextCamera(index)"
            ref="video"
            @capture-request="captureImage(index)"
            @previous-camera="navigateToPreviousCamera(index)"
            @next-camera="navigateToNextCamera(index)"
          />
          <video-youtube v-else-if="beach.type === 'video/youtube'" :src="beach.src" ref="video" :anchor="beach.anchor" :type="beach.type"/>

          <div v-else-if="beach.type === 'previsoes' && beach.anchor === 'windguru'"  class="section q-pa-md">
            <iframe scrolling="no" seamless="seamless" style="border: none; width: 100%; overflow: hidden; height: 823px;" src="https://www.windguru.cz/widget-fcst-iframe.php?s=48963&amp;m=3&amp;mw=84&amp;uid=wg_fwdg_48963_3_1616953874460&amp;wj=kmh&amp;tj=c&amp;waj=m&amp;odh=0&amp;doh=24&amp;fhours=240&amp;hrsm=1&amp;vt=forecasts&amp;lng=pt&amp;ts=2&amp;p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,SWELL1,SWPER1,SWDIR1,SWELL2,SWPER2,SWDIR2,WVHGT,WVPER,WVDIR,TMP,TMPE,WCHILL,FLHGT,CDC,TCDC,APCP1s,SLP,RH,RATING&amp;hostname=huna.pt&amp;url=https%3A%2F%2Fhuna.pt%2Fcam%2F" id="iFrameResizer0"></iframe>
          </div>

          <div v-else-if="beach.type === 'previsoes' && beach.anchor === 'tide'" class="tideschart window-height items-center section q-pa-md" style="padding-top:100px" >
            <iframe scrolling="no" src="https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day" height="700px" width="500px"></iframe>
          </div>

          <div v-else-if="beach.type === 'previsoes' && beach.anchor === 'surfforecast'" style="padding-top:100px" class="section q-pa-md">
            <div class="wf-width-cont surf-fc-widget">
              <div class="widget-container">
                <div class="external-cont">
                  <iframe class="surf-fc-i" allowtransparency="true" src="//pt.surf-forecast.com/breaks/Costada-Caparica/forecasts/widget/a" height="400px" width="100%" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="beach.type === 'previsoes' && beach.anchor === 'magicseaweed'" style="padding-top:200px" class="section q-pa-xl box">
            <iframe src="https://magicseaweed.com/Costa-da-Caparica-Surf-Report/874/Embed/" scrolling="no" width="100%" height="5000px" frameborder="0"></iframe>
          </div>
          <div v-else > something goes wrong code 5000</div>
        </div>

        <div class="title row items-center q-pa-md">
          <h4 class="text-weight-medium col-9 col-md-10">
            Livros e dicas
          </h4>
          <div class="row items-center">
            <div class="col-3 col-md-2 flex flex-center">
              <img src="images/book_windguru_for_dummies.png" alt="Livros e dicas" style="max-width: 100%; height: auto; cursor: pointer;" @click="showDialog_dontDontNeedThis = true"/>
            </div>
          </div>
        </div>
      </div>

      <!-- message: thanks for sharing -->
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

       <!-- message: dont need this, just talk with Hugo -->
        <q-dialog v-model="showDialog_dontDontNeedThis">
         <q-card class="bg-white text-black q-pa-md" style="width: 900px; max-width: 80vw;">
           <q-toolbar class="row items-center">
             <q-avatar size=70px style="height: auto;">
               <img src="icons/android-chrome-192x192.png" alt="Huna logo">
             </q-avatar>
             <q-toolbar-title><span class="text-weight-bold text-h5">Tu não precisas disso</span></q-toolbar-title>
           </q-toolbar>
           <q-card-section class="text-h6">
             Basta falares com o Hugo, ele tem tudo o que precisas.
           </q-card-section>
           <q-card-actions align="right">
               <q-btn flat label="Eu entendi" color="black" v-close-popup />
             </q-card-actions>
         </q-card>
       </q-dialog>

         <!-- Real estate ad popup (extracted) -->
         <ad-dialog
           :model-value="showAdDialog"
           :value="showAdDialog"
           :mobile="mobile"
           poster-desktop="images/poster_bg.png"
           poster-mobile="images/poster_bg_mobile.png"
           @update:modelValue="v => showAdDialog = v"
           @input="v => showAdDialog = v"
         ></ad-dialog>
      <q-page-sticky position="bottom-right" :offset="[22, 50]">
        <!-- remove manual absolute offsets so q-page-sticky can position the button reliably -->
        <div class="q-mini-drawer-hide">
          <q-btn
            round
            unelevated
            icon="chevron_left"
            @click="drawer = !drawer"
          />
        </div>
      </q-page-sticky>

    </q-page-container>
  </q-layout>
</template>

<script>
import VideoPlayer from 'components/VideoPlayer.vue'
import VideoYoutube from 'components/VideoYoutube.vue'
// import socialSharing from 'components/SocialSharing.vue'
import AdDialog from 'components/AdDialog.vue'
import axios from 'axios'
export default {
  name: 'Cam4',
  components: {
    VideoPlayer,
    VideoYoutube,
    // socialSharing,
    AdDialog
  },
  methods: {
    // Método para controlar o comportamento de acordeão
    toggleExpand (index) {
      // Se clicar no item já expandido, fecha-o
      if (this.expandedItem === index) {
        this.expandedItem = null
      } else {
        // Caso contrário, expande o novo item e fecha os outros
        this.expandedItem = index
      }
    },
    async getLinks () {
      try {
        const response = await axios.get(this.url_links)
        this.webcams = response.data
        console.log(this.webcams)
        // If URL contains a hash (e.g. /cam#someAnchor), attempt to scroll to it
        this.$nextTick(() => {
          this.scrollToHash()
        })
      } catch (error) {
        console.log('[foo] Something is wrong with urllinks.json file: ', error)
      }
    },
    // Smooth scroll to the current location.hash anchor (if present).
    // Retry a few times in case the DOM element isn't yet rendered.
    scrollToHash (attempt = 0) {
      try {
        const hash = (window.location.hash || '').replace('#', '')
        if (!hash) return
        const el = document.getElementById(hash)
        if (el) {
          // scrollIntoView with padding to account for fixed header
          const rect = el.getBoundingClientRect()
          const offset = 60 // header height
          const top = window.pageYOffset + rect.top - offset
          window.scrollTo({ top, behavior: 'smooth' })
          // mark the drawer button as active if present
          const navBar = document.getElementsByClassName(hash)
          if (navBar && navBar[0]) navBar[0].classList.add('btn_active')
        } else if (attempt < 5) {
          // retry after a short delay
          setTimeout(() => this.scrollToHash(attempt + 1), 150)
        }
      } catch (e) {
        console.warn('scrollToHash failed', e)
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
        this.copiedUrl = 'www.huna.pt/cam#' + anchor
        await navigator.clipboard.writeText(this.copiedUrl)
        // this.toolbar = true
      } catch ($e) {
        alert('Cannot copy')
      }
    },
    scrollHandler () {
      this.webcams.forEach((item, index) => {
        try {
          const navBar = document.getElementsByClassName(item.anchor)
          if (this.isInViewport(document.getElementById(item.anchor))) {
            // console.log(item.anchor)
            navBar[0].classList.add('btn_active')
            this.$refs.video[index].play()
          } else {
            navBar[0].classList.remove('btn_active')
            this.$refs.video[index].pause()
          }
        } catch {
          console.log('something goes wrong code:4000')
        }
      })
    },
    start () {
      // console.log('start')
      this.$refs.video[0].play()
    },
    isInViewport (element) {
      const rect = element.getBoundingClientRect()
      if (this.mobile) {
        return (
          rect.top - 350 <= 0 &&
          rect.bottom - 350 >= 0
        )
      } else {
        return (
          rect.top - 500 <= 0 &&
          rect.bottom - 500 >= 0
        )
      }
    },
    isMobile () {
      if (screen.width <= 760) {
        this.mobile = true
        // console.log('mobile foo TRUE')
      } else {
        this.mobile = false
        // console.log('mobile foo FALSE')
      }
    },
    // Scroll to camera anchor and close drawer on mobile
    goToCamera (anchor, index) {
      try {
        console.log('goToCamera called', { anchor, index, mobile: this.mobile })

        // close drawer on mobile so content is visible
        if (this.mobile) {
          this.drawer = false
        }

        // Use nextTick to ensure drawer closes before scrolling
        this.$nextTick(() => {
          const el = document.getElementById(anchor)
          if (el) {
            const rect = el.getBoundingClientRect()
            const offset = this.mobile ? 20 : 60
            const top = window.pageYOffset + rect.top - offset
            window.scrollTo({ top, behavior: 'smooth' })

            // mark active in drawer
            try {
              const navBar = document.getElementsByClassName(anchor)
              if (navBar && navBar[0]) navBar[0].classList.add('btn_active')
            } catch (e) {}
          } else {
            // fallback: set location.hash which will trigger scrollToHash
            console.log('Element not found, using hash fallback')
            window.location.hash = '#' + anchor
          }
        })
      } catch (e) {
        console.warn('goToCamera failed', e)
      }
    },
    // Navigate to a specific camera by index
    navigateToCamera (targetIndex) {
      if (!this.webcams || targetIndex < 0 || targetIndex >= this.webcams.length) {
        console.log('navigateToCamera: invalid index', targetIndex)
        return
      }
      const targetCamera = this.webcams[targetIndex]
      if (targetCamera && targetCamera.anchor) {
        console.log('navigateToCamera: navigating to', targetIndex, targetCamera.anchor)
        this.goToCamera(targetCamera.anchor, targetIndex)
      }
    },
    // Navigate to previous camera (skipping previsoes)
    navigateToPreviousCamera (currentIndex) {
      console.log('navigateToPreviousCamera called from index', currentIndex)
      if (currentIndex <= 0) return
      // Find previous camera that is not a 'previsoes' type
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (this.webcams[i] && this.webcams[i].type !== 'previsoes') {
          console.log('Found previous camera at index', i)
          this.switchToCamera(currentIndex, i)
          return
        }
      }
      console.log('No previous camera found')
    },
    // Navigate to next camera (skipping previsoes)
    navigateToNextCamera (currentIndex) {
      console.log('navigateToNextCamera called from index', currentIndex)
      if (!this.webcams || currentIndex >= this.webcams.length - 1) return
      // Find next camera that is not a 'previsoes' type
      for (let i = currentIndex + 1; i < this.webcams.length; i++) {
        if (this.webcams[i] && this.webcams[i].type !== 'previsoes') {
          console.log('Found next camera at index', i)
          this.switchToCamera(currentIndex, i)
          return
        }
      }
      console.log('No next camera found')
    },
    // Switch to a different camera (change video source in place, maintaining fullscreen)
    switchToCamera (fromIndex, toIndex) {
      try {
        const videosRef = this.$refs && this.$refs.video
        if (!videosRef || !this.webcams) return

        const currentPlayer = Array.isArray(videosRef) ? videosRef[fromIndex] : videosRef
        const targetCamera = this.webcams[toIndex]

        if (!currentPlayer || !targetCamera) {
          console.log('switchToCamera: missing player or camera')
          return
        }

        console.log('Switching from', fromIndex, 'to', toIndex, targetCamera)

        // Check if currently in fullscreen
        const inFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement ||
                                document.mozFullScreenElement || document.msFullscreenElement)

        if (inFullscreen && typeof currentPlayer.changeCameraSource === 'function') {
          // Use the player's method to change source while staying in fullscreen
          console.log('Changing source to:', targetCamera.src)
          currentPlayer.changeCameraSource(targetCamera.src, targetCamera.type)

          // Update URL hash to reflect current camera
          window.location.hash = '#' + targetCamera.anchor

          // Update active class in drawer
          try {
            // Remove active from all
            const allItems = document.querySelectorAll('.btn_active')
            allItems.forEach(item => item.classList.remove('btn_active'))
            // Add active to target
            const navBar = document.getElementsByClassName(targetCamera.anchor)
            if (navBar && navBar[0]) navBar[0].classList.add('btn_active')
          } catch (e) {
            console.warn('Error updating active class:', e)
          }
        } else {
          // Not in fullscreen, use normal navigation
          console.log('Not in fullscreen, using normal navigation')
          this.navigateToCamera(toIndex)
        }
      } catch (e) {
        console.error('switchToCamera failed:', e)
        // Fallback to normal navigation
        this.navigateToCamera(toIndex)
      }
    },
    // Check if there's a previous camera (non-preview type)
    hasPreviousCamera (currentIndex) {
      if (currentIndex <= 0) return false
      // Find previous camera that is not a 'previsoes' type
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (this.webcams[i] && this.webcams[i].type !== 'previsoes') {
          return true
        }
      }
      return false
    },
    // Check if there's a next camera (non-preview type)
    hasNextCamera (currentIndex) {
      if (!this.webcams || currentIndex >= this.webcams.length - 1) return false
      // Find next camera that is not a 'previsoes' type
      for (let i = currentIndex + 1; i < this.webcams.length; i++) {
        if (this.webcams[i] && this.webcams[i].type !== 'previsoes') {
          return true
        }
      }
      return false
    },
    // Capture the current frame from the video component and copy image to clipboard
    async captureImage (index) {
      try {
        const videosRef = this.$refs && this.$refs.video
        const vp = Array.isArray(videosRef) ? videosRef[index] : videosRef
        if (!vp || typeof vp.captureFrame !== 'function') {
          if (this.$q && this.$q.notify) this.$q.notify({ type: 'negative', message: 'Captura indisponível' })
          return
        }
        const blob = await vp.captureFrame()
        if (!blob) {
          if (this.$q && this.$q.notify) this.$q.notify({ type: 'negative', message: 'Não foi possível capturar imagem' })
          return
        }
        // Use Clipboard API to write image
        try {
          // ClipboardItem requires an object mapping MIME to Blob
          const ClipboardItemCtor = window.ClipboardItem
          if (ClipboardItemCtor) {
            const item = new ClipboardItemCtor({ 'image/png': blob })
            await navigator.clipboard.write([item])
            if (this.$q && this.$q.notify) this.$q.notify({ type: 'positive', message: 'Imagem copiada' })
          } else {
            throw new Error('ClipboardItem not supported')
          }
        } catch (e) {
          // fallback: offer download
          console.warn('clipboard write failed, falling back to download', e)
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'capture.png'
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)
          if (this.$q && this.$q.notify) this.$q.notify({ type: 'positive', message: 'Imagem preparada para download' })
        }
      } catch (e) {
        console.warn('captureImage failed', e)
        if (this.$q && this.$q.notify) this.$q.notify({ type: 'negative', message: 'Erro na captura' })
      }
    }
  },
  beforeMount () {
    this.getLinks()
    this.isMobile()
  },
  mounted () {
    setTimeout(() => {
      this.showAdDialog = true
    }, 10000)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-blacklist.js', { scope: '/' }).then(reg => console.log('SW registered', reg.scope)).catch(err => console.warn('SW register failed', err))
    }
  },
  watch: {
    $route (to, from) {
      // when navigating to a hash like /cam#anchor, attempt to scroll
      this.$nextTick(() => this.scrollToHash())
    },
    webcams (newVal, oldVal) {
      // if webcams were empty and now populated, ensure we honor hash
      if (Array.isArray(newVal) && newVal.length > 0) {
        this.$nextTick(() => this.scrollToHash())
      }
    }
  },
  data () {
    return {
      // Nova propriedade para controlar qual item está expandido
      expandedItem: null,
      showDialog: false,
      showDialog_dontDontNeedThis: false,
      showAdDialog: false,
      key: 0,
      drawer: false,
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
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400;500;600;700&display=swap')

// Ajustes no CSS para garantir que a barra lateral apareça abaixo do header
.q-page-container > div
  padding-top:60px
  h4
    margin: 10px
  .tideschart
    iframe
      height:600px
      width: 100%
  @media (min-width: 1080px) and (max-width: 1366px)
    .title
      .q-fab
        display: block
        position: relative
        z-index: 1
        margin-left:50px
      .q-btn__wrapper
        position: absolute
        background: green
        top: 50px
        transform: scale(0.9)
  @media (max-width: 768px)
    div
      padding: 1px 0px
  .q-page-sticky
    .q-btn
      background: #ffa000
.q-drawer
  z-index: 2001
  @media (max-width: 600px)
    z-index: 6000
.sidebar
  // Ajuste para garantir que a barra lateral começa abaixo do header
  margin-top: 60px
  @media (max-width: 600px)
    margin-top: 0
  .sidebar-content
    max-height: calc(100vh - 60px)
    overflow-y: auto
    padding: 8px
    @media (max-width: 600px)
      max-height: calc(100vh - 60px)
  .menu-item-mobile
    padding: 5px 5px
    transition: background-color 0.2s
    &:active
      background-color: rgba(0, 0, 0, 0.1)
    .q-item__label
      font-size: 20px
      font-weight: 500
  .align
    position: static
  p
    font-size: 15px
    line-height: 1.2rem
    margin-bottom:0px
    color: gray
  .q-item__section--avatar
    min-width: 40px
    padding: 0px
    img
      margin:0px
  .q-expansion-item__container
    a
      border-radius: 6px
  .text-h6
    font-size: 18px
    line-height: 0.7rem
  .btn_active
    background: #ffa000
    border-radius: 50px
    font-weight: 600
    .q-item__label
      line-height: 1.4rem !important
    a
      padding: 8px 0px
    img
      padding-left: 10px
  @media (min-width: 1080px) and (max-width: 1366px)
    .q-item--dense
      min-height: 13px
    .text-h6
      font-size: 15px
    .q-item__section--side > .q-icon
      font-size: 20px
  .q-card__section
    padding-right: 20px
    word-break: break-all      // Mantido conforme sugestão anterior
    overflow-wrap: break-word  // Mantido conforme sugestão anterior
    @media (max-width: 768px)
      .q-item
        min-height: 25px
        padding: 0px 5px 0px 10px
        .text-h6
          font-size: 14px
          line-height: 0.7rem
        .q-icon
          font-size: 20px
        .btn_active
          font-size: 18px
  .ad-popup-card
    position: relative
  .transparent-dialog
    .q-dialog__inner
      background: transparent !important
    .q-dialog__backdrop
      background: rgba(0, 0, 0, 0.8) !important
  .logo-layer
    position: absolute
    top: 16px
    right: 16px
    z-index: 1
  .ad-popup-section
    position: relative
  .casa-title
    font-family: 'Josefin Sans', sans-serif !important
    font-size: 96px !important
    font-weight: 700 !important
  .ad-popup-actions
    bottom: 20px
    @media (max-width: 680px)
      bottom: 100px

  /* New ad popup styles: padded container with cover image */
  .ad-popup-card
    padding: 0
    background: transparent
    // ensure card centers and doesn't exceed viewport
    max-height: 90vh
    display: flex
    justify-content: center
    align-items: center

  .ad-image
    height: 100%
    object-fit: cover
    display: block

  /* Reduce padding on small screens to avoid cutting too much of the image */
  @media (max-width: 680px)
    .ad-popup-card
      padding: 20px 0
    .ad-image-wrapper
      max-height: calc(80vh - 40px)
      height: calc(60vh - 40px)
</style>
