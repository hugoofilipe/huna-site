<template>
  <div class="section q-pa-md" :id="beach.anchor">
    <div class="title row items-start items-center">
      <h4 class="text-weight-medium">
        {{ beach.title }}
      </h4>
      <q-btn icon="link" @click="$emit('copy-url', beach.anchor)" name="copy-link" aria-label="Copiar link" flat round size="small" style="color: #ffa000;" />
    </div>
    <q-btn v-if="!mobile" round icon="camera_alt" style="font-size: 14px;margin-top: 8px;top: 60px;float: right;z-index: 20;right: 60px; cursor: pointer; background: #ffa000;" size="md" @click="$emit('capture-image', index)" title="Capturar imagem" />

    <video-player
      v-if="beach.type === 'application/x-mpegURL'"
      :options="videoOptions"
      :src="beach.src"
      :type="beach.type"
      :anchor="beach.anchor"
      :userAgent="beach.userAgent"
      :referer="beach.referer"
      :has-previous="hasPrevious"
      :has-next="hasNext"
      ref="video"
      @capture-request="$emit('capture-image', index)"
      @previous-camera="$emit('previous-camera', index)"
      @next-camera="$emit('next-camera', index)"
    />
    <video-youtube v-else-if="beach.type === 'video/youtube'" :src="beach.src" ref="video" :anchor="beach.anchor" :type="beach.type" />

    <div v-else-if="beach.type === 'previsoes' && beach.anchor === 'windguru'" class="section q-pa-md">
      <iframe scrolling="no" seamless="seamless" style="border: none; width: 100%; overflow: hidden; height: 823px;" src="https://www.windguru.cz/widget-fcst-iframe.php?s=48963&amp;m=3&amp;mw=84&amp;uid=wg_fwdg_48963_3_1616953874460&amp;wj=kmh&amp;tj=c&amp;waj=m&amp;odh=0&amp;doh=24&amp;fhours=240&amp;hrsm=1&amp;vt=forecasts&amp;lng=pt&amp;ts=2&amp;p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,SWELL1,SWPER1,SWDIR1,SWELL2,SWPER2,SWDIR2,WVHGT,WVPER,WVDIR,TMP,TMPE,WCHILL,FLHGT,CDC,TCDC,APCP1s,SLP,RH,RATING&amp;hostname=huna.pt&amp;url=https%3A%2F%2Fhuna.pt%2Fcam%2F" id="iFrameResizer0"></iframe>
    </div>

    <div v-else-if="beach.type === 'previsoes' && beach.anchor === 'tide'" class="tideschart window-height items-center section q-pa-md" style="padding-top:100px">
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
    <div v-else>Something goes wrong code 5000</div>
  </div>
</template>

<script>
import VideoPlayer from 'components/VideoPlayer.vue'
import VideoYoutube from 'components/VideoYoutube.vue'

export default {
  name: 'WebcamItem',
  components: {
    VideoPlayer,
    VideoYoutube
  },
  props: {
    beach: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    mobile: {
      type: Boolean,
      default: false
    },
    videoOptions: {
      type: Object,
      default: () => ({ controls: true, muted: 'muted' })
    },
    hasPrevious: {
      type: Boolean,
      default: false
    },
    hasNext: {
      type: Boolean,
      default: false
    }
  },
  emits: ['copy-url', 'capture-image', 'previous-camera', 'next-camera']
}

</script>

<style lang="sass" scoped>
.tideschart
  iframe
    height: 600px
    width: 100%
@media (max-width: 768px)
  div
    padding: 1px 0px
@media (min-width: 1080px) and (max-width: 1366px)
  .title
    .q-btn
      display: block
      position: relative
      z-index: 1
      margin-left: 50px
    .q-btn__wrapper
      position: absolute
      background: green
      top: 50px
      transform: scale(0.9)
</style>
