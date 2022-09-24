<!--
Corrigir mobile
validação pela cookie nao me está a permitir fazer play em todos os videos no momento de carregamento da página (Fixe era fazer o play do primeiro video, depois fazer sempre play do focus juntamente com o anterior e o seguinte, e fazer play sempre que se carregasse no butão)
criar pagina apos login para mostrar "cam" e "campeonato Padel";
uqero fazer scrollactive (ou tentar usar calss CSS usando focus para ver o active)
evocar o formulario de contacto
Corrigir scroll vuejs add space before section when jump by anchor
user online para uma api
Rating das ondas para uma api - https://quasar.dev/vue-components/rating
Criar vários tipo de user (admin, cam, etc...)
botao para by coffee
banner de publicidade
limpar erros

-->
<template>
  <q-layout view="lhr lpR lFr" class="bg-white">
    <q-drawer v-model="drawer" show-if-above side='right'
      :width="400" :breakpoint="500" class="bg-grey-3 sidebar">
      <div class="align">
        <q-list>
          <q-item v-for="(beach, index) in webcams" v-bind:key="index" dense>
            <q-item-section>
              <q-expansion-item expand-separator :label="beach.title" :to="'#' + beach.anchor" dense dense-toggle
                class="text-h6" icon=img:/icons/beach.svg active-class="bg-orange-3 text-grey-9">
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
          <q-item dense>
            <q-expansion-item expand-separator label="Windguru" to="#windguru" dense dense-toggle class="text-h6" icon=img:/icons/analytics.svg  active-class="bg-orange-3 text-grey-9">
              <q-card>
                <q-card-section>
                  <p>
                    Link: http://www.windguru.cz/pt/index.php?sc=48963
                  </p>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-item>
          <q-item dense>
            <q-expansion-item expand-separator label="Marés" to="#tide" dense dense-toggle class="text-h6" icon=img:/icons/analytics.svg  active-class="bg-orange-3 text-grey-9">
              <q-card>
                <q-card-section>
                  <p>
                    Link: https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day
                  </p>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-item>
          <q-item dense>
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
          </q-item>
        </q-list>
      </div>
    </q-drawer>
    <q-page-container>
      <div>
        <div v-for="(beach, index) in webcams" v-bind:key="index" class="section q-pa-md">
          <h4 class="text-weight-medium">
            {{beach.title}}
          </h4>
          <video-player :options="videoOptions" :src="beach.src" :type="beach.type" :anchor="beach.anchor" />
        </div>
        <div id="windguru" style="padding-top:100px" class="section q-pa-md">
          <h4 class="text-weight-medium">
            Windguru
          </h4>
          <iframe scrolling="no" seamless="seamless" style="border: none; width: 100%; overflow: hidden; height: 823px;" src="https://www.windguru.cz/widget-fcst-iframe.php?s=48963&amp;m=3&amp;mw=84&amp;uid=wg_fwdg_48963_3_1616953874460&amp;wj=kmh&amp;tj=c&amp;waj=m&amp;odh=0&amp;doh=24&amp;fhours=240&amp;hrsm=1&amp;vt=forecasts&amp;lng=pt&amp;ts=2&amp;p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,SWELL1,SWPER1,SWDIR1,SWELL2,SWPER2,SWDIR2,WVHGT,WVPER,WVDIR,TMP,TMPE,WCHILL,FLHGT,CDC,TCDC,APCP1s,SLP,RH,RATING&amp;hostname=huna.pt&amp;url=https%3A%2F%2Fhuna.pt%2Fcam%2F" id="iFrameResizer0"></iframe>
        </div>
        <div id="tide" class="tideschart window-height items-center section q-pa-md" style="padding-top:100px" >
          <h4 class="text-weight-medium">
            Marés
          </h4>
            <iframe scrolling="no" src="https://pt.tideschart.com/Portugal/District-of-Setubal/Almada/Trafaria/#day" height="700px" width="500px"></iframe>
        </div>
        <div id="surfforecast" style="padding-top:100px" class="section q-pa-md">
          <h4 class="text-weight-medium">
            Surf Forecast
          </h4>
          <div class="wf-width-cont surf-fc-widget">
            <div class="widget-container">
              <div class="external-cont">
                <iframe class="surf-fc-i" allowtransparency="true" src="//pt.surf-forecast.com/breaks/Costada-Caparica/forecasts/widget/a" height="400px" width="100%" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">
                </iframe>
              </div>
            </div>
          </div>
        </div>
        <div id="magicseaweed" style="padding-top:200px" class="section q-pa-xl">
          <h4 class="text-weight-medium">
            MagicSeaWeed
          </h4>
          <iframe src="https://magicseaweed.com/Costa-da-Caparica-Surf-Report/874/Embed/" scrolling="no" width="100%" height="5000px" frameborder="0"></iframe>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import VideoPlayer from 'components/VideoPlayer.vue'

export default {
  name: 'Cam',
  components: {
    VideoPlayer
  },
  data () {
    return {
      drawer: false,
      videoOptions: {
        autoplay: true,
        controls: true
      },
      webcams: [
        {
          title: 'Cova do Vapor',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-covadovapor/chunklist.m3u8',
          link: 'https://www.surfline.com/surf-report/cova-do-vapor/584204204e65fad6a77096ad',
          anchor: 'covadovapor'
        },
        {
          title: 'Lorosai - São joão',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-saojoaocaparica/chunklist.m3u8',
          link: 'https://www.surfline.com/surf-report/s-o-joao-da-caparica/5dbb587ff387900001fee288',
          anchor: 'lorosai'
        },
        {
          title: 'Inatel - São joão',
          type: 'application/x-mpegURL',
          src: 'https://video-auth1.iol.pt/beachcam/costacaparicasaojoao/chunks.m3u8',
          link: 'https://beachcam.meo.pt/livecams/costa-da-caparica-sao-joao/',
          anchor: 'inatel'
        },
        {
          title: 'Marcelino',
          type: 'video/youtube',
          src: 'https://www.youtube.com/embed/bFiWx-_UAlk?autoplay=1&controls=0&mute=1',
          link: 'https://www.youtube.com/watch?v=bFiWx-_UAlk&ab_channel=Playocean',
          anchor: 'marcelino'
        },
        {
          title: 'Marcelino norte até CDS sul',
          type: 'application/x-mpegURL',
          src: 'https://video-auth1.iol.pt/beachcam/costacaparicacds/chunks.m3u8',
          link: 'https://beachcam.meo.pt/livecams/costa-da-caparica/',
          anchor: 'marcelinonorte'
        },
        {
          title: 'CDS até ao barbas',
          type: 'application/x-mpegURL',
          src: 'https://video-auth1.iol.pt/beachcam/costacaparicabernard/chunks.m3u8',
          link: 'https://beachcam.meo.pt/livecams/costa-da-caparica-cds/',
          anchor: 'cds'
        },
        {
          title: 'Barbas',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-cdscaparica/chunklist.m3u8',
          link: '',
          anchor: 'barbas1'
        },
        {
          title: 'Barbas',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-barbas/chunklist.m3u8',
          link: 'https://www.surfline.com/surf-report/praia-do-barbas/584204214e65fad6a7709d16?camId=58349f6e3421b20545c4b574',
          anchor: 'barbas2'
        },
        {
          title: 'Dragão  / Barbas',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-costacaparica/chunklist.m3u8',
          link: '',
          anchor: 'dragaoebarbas'
        },
        {
          title: 'Panoramica - CDS / Barbas / dragão / praia nova / Nova praia',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-costadacaparicaoverview/chunklist.m3u8',
          link: 'https://www.surfline.com/surf-report/costa-da-caparica/5842041f4e65fad6a7708e65?camId=60956af96fe5bbe4ad8557fc',
          anchor: 'panoramica'
        },
        {
          title: 'Dragão até à Praia nova',
          type: 'application/x-mpegURL',
          src: 'https://video-auth1.iol.pt/beachcam/bccaparicanovapraia/chunks.m3u8',
          link: 'https://beachcam.meo.pt/livecams/costa-da-caparica-praia-nova/',
          anchor: 'praianovadragao'
        },
        {
          title: 'Panorâmica fora dos pontões',
          type: 'video/youtube',
          src: 'https://www.youtube.com/embed/eoxd8mtF6pM?autoplay=1&controls=0&mute=1',
          link: 'https://www.youtube.com/watch?v=eoxd8mtF6pM&ab_channel=Playocean',
          anchor: 'foradospontoes'
        },
        {
          title: 'Praia do castelo',
          type: 'application/x-mpegURL',
          src: 'https://cams.cdn-surfline.com/cdn-int/pt-castelo/chunklist.m3u8',
          link: 'https://www.surfline.com/surf-report/marcelino/584204214e65fad6a7709d15',
          anchor: 'castelo'
        },
        {
          title: 'Praia da Sereia',
          type: 'video/youtube',
          src: 'https://www.youtube.com/embed/_sT-z5d4ZAU?autoplay=1&controls=0&mute=1',
          link: 'https://www.youtube.com/watch?v=_sT-z5d4ZAU&ab_channel=Playocean',
          anchor: 'sereia'
        },
        {
          title: 'Fonte da telha',
          type: 'video/youtube',
          src: 'https://www.youtube.com/embed/U4AwFAoEPLM?autoplay=1&controls=0&mute=1',
          link: 'https://www.youtube.com/watch?v=U4AwFAoEPLM&ab_channel=Playocean',
          anchor: 'fontedatelhanorte'
        },
        {
          title: 'Kailua - Fonte da telha - Sul',
          type: 'video/youtube',
          src: 'https://www.youtube.com/embed/LO68qQ6-OK8?autoplay=1&controls=0&mute=1',
          link: 'https://www.youtube.com/watch?v=LO68qQ6-OK8&ab_channel=Playocean',
          anchor: 'fontedatelhasul'
        }
      ]
    }
  }

}
</script>

<style lang="sass">

.q-page-container > div
  padding-top:100px
  h4
    margin: 10px
  .tideschart
    iframe
      height:600px
      width: 100%
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
    line-height: 1rem
  @media (min-width: 1080px) and (max-width: 1366px)
    .q-item--dense
      min-height: 13px
    .text-h6
      font-size: 15px
    .q-item__section--side > .q-icon
      font-size: 20px
  .q-card__section
    padding-left: 56px
  </style>
