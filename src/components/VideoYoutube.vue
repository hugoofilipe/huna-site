<template>
  <div class="main-video-youtube">
    <LazyYoutube
        ref="lazyVideo"
        :src="src"
        max-width="100%"
    />

    <!-- Camera-page controls match the HLS bottom menu; legacy consumers keep their existing controls. -->
    <div v-if="cameraControls" class="custom-controls youtube-controls q-pa-md q-gutter-sm row flex justify-center align-center">
      <q-btn @click="$emit('playback-intent'); handleClick('playVideo')" icon="play_arrow" label="play" aria-label="Reproduzir" unelevated class="icon-only-mobile" />
      <q-btn @click="$emit('playback-intent'); handleClick('pauseVideo')" icon="pause" label="pause" aria-label="Pausar" unelevated class="icon-only-mobile" />
      <q-btn @click="$emit('playback-intent'); restart()" icon="replay" label="restart" aria-label="Reiniciar" unelevated class="icon-only-mobile" />
      <q-btn align="around" class="btn-fixed-width icon-only-mobile" label="Copiar link" aria-label="Copiar link" icon="link" @click="copyCameraURL">
        <q-tooltip class="bg-accent">Copiar link</q-tooltip>
      </q-btn>
      <socialSharing :anchor="anchor" :title="title || anchor" :path="$route.path" capture-unavailable-message="Não é possível capturar uma imagem deste vídeo do YouTube porque está incorporado de outro site." position="bottom" class="icon-only-mobile" />
      <q-btn icon="camera_alt" size="md" @click="showCaptureLimit = true" title="Capturar imagem" aria-label="Capturar imagem" />
    </div>
    <div v-else class="q-pa-md q-gutter-sm row item.centers ">
      <q-btn @click="$emit('playback-intent'); handleClick('playVideo')">Play</q-btn>
      <!-- <button @click="handleClick('stopVideo')">Stop</button> -->
      <q-btn @click="$emit('playback-intent'); handleClick('pauseVideo')">Pause</q-btn>
      <q-btn @click="$emit('playback-intent'); restart()">Restart</q-btn>
      <q-btn  align="around" class="btn-fixed-width" label="Copiar link" icon="link"  @click="showDialog = true; copyURL(anchor)">
        <q-tooltip class="bg-accent">Copiar link</q-tooltip>
      </q-btn>
      <socialSharing  :anchor="anchor" :title="anchor" position="bottom"/>
    </div>

    <q-dialog v-model="showDialog">
      <q-card class="bg-white text-black q-pa-md" style="width: 700px; max-width: 80vw;">
        <q-toolbar class="row items-center wrap ">
          <q-avatar size=70px style="height: auto;">
            <img src="icons/android-chrome-192x192.png" alt="Huna logo">
          </q-avatar>
          <q-toolbar-title><span class="text-weight-bold text-h5 ">Link copiado com sucesso</span></q-toolbar-title>
        </q-toolbar>
        <q-card-section class="text-h6">
          <span class="text-h6">Atenção:</span> Apenas deverás partilhar esta página com surfistas e pseudo-surfistas, que
          saibam partilhar ondas e momentos especiais. Não te esqueças, a amizade é o mais importante de tudo.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Eu entendi" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showCaptureLimit" aria-label="Capturar imagem">
      <q-card class="bg-white text-black q-pa-md" role="alertdialog" aria-labelledby="youtube-capture-title" aria-describedby="youtube-capture-message">
        <q-card-section>
          <div id="youtube-capture-title" class="text-h6">Capturar imagem</div>
          <p id="youtube-capture-message">Não é possível capturar uma imagem deste vídeo do YouTube porque está incorporado de outro site.</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Entendi" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { LazyYoutube } from 'vue-lazytube'
import socialSharing from 'components/SocialSharing.vue'
import { copyText } from 'src/utils/clipboard.mjs'

export default {
  name: 'VideoYoutube',
  components: {
    LazyYoutube,
    socialSharing
  },
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    src: [Number, String],
    type: [Number, String],
    anchor: [Number, String],
    title: [String],
    cameraControls: { type: Boolean, default: false }
  },
  methods: {
    play () {
      // this.player.play()
      // console.log('foo play')
      this.handleClick('playVideo')
    },
    pause () {
      // console.log('foo pause')
      this.handleClick('pauseVideo')
    },
    restart () {
      this.handleClick('resetView')
      this.handleClick('playVideo')
    },
    handleClick (event) {
      this.$refs.lazyVideo[event]()
    },
    async copyCameraURL () {
      try {
        await copyText(window.location.origin + this.$route.path + '#' + this.anchor)
        this.showDialog = true
      } catch (e) {
        alert('Cannot copy')
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
    }
  },
  data () {
    return {
      player: null,
      showDialog: false,
      showCaptureLimit: false,
      copiedUrl: ''
    }
  },
  mounted () {
    // this.player = videojs(this.$refs.videoPlayer, this.options, () => {
    //   this.player.log('onPlayerReady', this)
    // })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style lang="sass">
.main-video-youtube
  position: relative

  .youtube-controls
    position: absolute
    bottom: -20px

  .q-btn
    background: #ffa5001c
  .youtube-controls .q-btn
    background: #ffa000
@media (max-width: 640px)
  .main-video-youtube .youtube-controls
    position: relative
    bottom: -5px
.q-toolbar__title.ellipsis
  white-space: break-spaces

</style>
