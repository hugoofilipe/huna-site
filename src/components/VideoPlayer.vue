<template>
  <div>
    <div class="main-video">
      <video ref="videoPlayer" class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered" >
        <source
          :src="src"
          :type="type"
        >
      </video>

      <q-btn @click="play" >play</q-btn>
      <q-btn @click="pause" >pause</q-btn>
      <q-btn @click="restart(src)" >restart</q-btn>
      <q-btn  align="around" class="btn-fixed-width" label="Copiar link" icon="link"  @click="toolbar = true; copyURL(anchor)">
        <q-tooltip class="bg-accent">Copiar link</q-tooltip>
      </q-btn>
      <q-btn  align="around" class="btn-fixed-width" label="Partilhar" icon="share" disable :to="'cam#' + anchor" />
    </div>
    <q-dialog v-model="toolbar" >
      <q-card class="bg-black text-white" >
        <q-toolbar>
          <q-avatar                  square
                  size=80px>
            <img src="images/huna.svg" alt="Huna logo">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">LINK</span> Copiado</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          Link copiado com sucesso ({{copiedUrl}})
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    src: [Number, String],
    type: [Number, String],
    anchor: [Number, String]
  },
  methods: {
    play () {
      this.player.play()
    },
    pause () {
      this.player.pause()
      // this.player.hasStarted(false)
      // this.player.currentTime(0)
      // // this.player.posterImage.show()
      this.player.bigPlayButton.show()
    },
    restart (link) {
      this.player.pause()
      this.player.src({ src: link })
      this.player.load()
      this.player.play()
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
      toolbar: false,
      copiedUrl: ''
    }
  },
  mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.log('onPlayerReady', this)
    })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style lang="sass">
.main-video
  iframe
    width: 100%
    height: calc(100vw/1.77)
    border-radius:25px

  div
    border-radius:25px

</style>
