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
    <q-drawer v-model="drawer" show-if-above side='right'
      :width="320" :breakpoint="500" class="bg-grey-3 sidebar">
      <div class="align">
        <q-list>
          <q-item v-for="(beach, index) in webcams" v-bind:key="index" dense>
            <q-item-section>
              <q-expansion-item :label="beach.title" :to="'#' + beach.anchor" dense dense-toggle
                :class="'text-h6 ' + beach.anchor" :icon="iconSelect(beach.type)" active-class="text-black">
                <q-card>
                  <q-card-section>
                    <p>
                      Title: {{beach.title}}
                    </p>
                    <p>Type: {{beach.type}}</p>
                    <p>SRC: {{beach.src}}</p>
                    <p>Link: {{beach.link}}</p>
                    <p>Anchor: {{beach.anchor}}</p>
                    <p>Index: {{index}}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-item-section>
          </q-item>
          <!-- <q-item dense>
            <q-expansion-item expand-separator label="Windguru" to="#windguru" dense dense-toggle class="text-h6" icon=img:/icons/analytics.svg  active-class="bg-orange-3 text-grey-9">
              <q-card>
                <q-card-section>
                  <p>
                    Link: http://www.windguru.cz/pt/index.php?sc=48963
                  </p>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-item> -->
          <!-- <q-item dense>
            <q-expansion-item expand-separator label="Marés" to="#tide" dense dense-toggle class="text-h6" icon=img:/icons/analytics.svg  active-class="bg-orange-3 text-grey-9">
              <q-card>
                <q-card-section>
                  <p>
                    Link: https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day
                  </p>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-item> -->
          <!-- <q-item dense>
            <q-expansion-item expand-separator label="Surf-forcast" to="#surfforecast" dense dense-toggle class="text-h6" icon=img:/icons/analytics.svg  active-class="bg-orange-3 text-grey-9">
              <q-card>
                <q-card-section>
                  <p>
                    Link: https://www.surf-forecast.com/breaks/Costada-Caparica/forecasts/latest
                  </p>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-item>
          <q-item dense>
            <q-expansion-item expand-separator label="MagicseaWeed" to="#magicseaweed" dense dense-toggle class="text-h6" icon=img:/icons/analytics.svg  active-class="bg-orange-3 text-grey-9">
              <q-card>
                <q-card-section>
                  <p>
                    Link: https://pt.magicseaweed.com/Costa-da-Caparica-Surf-Report/874/
                  </p>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-item> -->
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

          <video-player v-if="beach.type === 'application/x-mpegURL'" :options="videoOptions" :src="beach.src" :type="beach.type" :anchor="beach.anchor" ref="video"/>

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

      <q-page-sticky position="bottom-right" :offset="[22, 5]">
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
// import SocialSharing from 'src/components/SocialSharing.vue'
import socialSharing from 'components/SocialSharing.vue'
import axios from 'axios'

export default {
  name: 'Cam4',
  components: {
    VideoPlayer,
    VideoYoutube,
    socialSharing
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
  watch: {
    $route (to, from) {
    }
  },
  data () {
    return {
      showDialog: false,
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
    .section
.q-page-sticky
  .q-btn
    background: #ffa000
.sidebar
  .align
    position: fixed
    bottom: 30px
  p
    font-size: 15px
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
    padding-left: 56px
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
  </style>
