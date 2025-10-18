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
  <q-layout view="lhr lpR lFr" class="bg-white" @scroll="scrollHandler">
    <!-- Ajuste no q-drawer para posicioná-lo abaixo do header -->
    <q-drawer v-model="drawer" show-if-above side='right'
      :width="320" :breakpoint="500" class="bg-grey-3 sidebar" :content-style="{ top: '60px' }">
      <div class="align">
        <q-list>
          <!-- Adicionado o model-value e @update:model-value para controlar o comportamento de acordeão -->
          <q-expansion-item
            v-for="(beach, index) in webcams"
            :key="index"
            :label="beach.title"
            :to="'#' + beach.anchor"
            dense
            dense-toggle
            expand-separator
            :class="'text-h6 ' + beach.anchor"
            :icon="iconSelect(beach.type)"
            active-class="text-black"
            :name="index"
            :model-value="expandedItem === index"
            @update:model-value="toggleExpand(index)"
          >
            <q-card>
              <q-card-section style="white-space: normal">
                <p>Title: {{beach.title}}</p>
                <p>Type: {{beach.type}}</p>
                <p>SRC: {{beach.src}}</p>
                <p>Link: {{beach.link}}</p>
                <p>Anchor: {{beach.anchor}}</p>
                <p>Index: {{index}}</p>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </q-drawer>
    <q-page-container>
      <div>
        <div v-for="(beach, index) in webcams" v-bind:key="index" class="section q-pa-md" :id="beach.anchor">

          <div class="title row items-center">
            <h4 class="text-weight-medium col-9 col-md-10">
              {{beach.title}}
            </h4>
            <!-- <socialSharing /> -->
            <q-fab color="green"  icon="share" direction="down" class="desktop-only">
              <socialSharing style="padding-top:40px" :anchor="beach.anchor" :title="beach.title" position="top"/>
              <q-btn push round color="white" icon="link" style="margin-top:80px" size="xl" @click="showDialog = true; copyURL(beach.anchor)"/>
            </q-fab>
          </div>

          <video-player v-if="beach.type === 'application/x-mpegURL'" :options="videoOptions" :src="beach.src" :type="beach.type" :anchor="beach.anchor" :userAgent="beach.userAgent" :referer="beach.referer" ref="video"/>

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
        <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
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
import socialSharing from 'components/SocialSharing.vue'
import AdDialog from 'components/AdDialog.vue'
import axios from 'axios'

export default {
  name: 'Cam4',
  components: {
    VideoPlayer,
    VideoYoutube,
    socialSharing,
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
  .title
    .q-fab
      display: block
      position: relative
      z-index: 1
      margin-left:100px
    .q-btn__wrapper
      position: absolute
      background: green
      top: 120px
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
      margin-bottom: 10px
.q-page-sticky
  .q-btn
    background: #ffa000
.sidebar
  // Ajuste para garantir que a barra lateral começa abaixo do header
  margin-top: 60px
  .align
    position: fixed
    bottom: 30px
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
    font-size: 25px
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
