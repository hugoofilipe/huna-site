<template>
  <div>
    <div class="main-video-player">
       <video ref="videoPlayer" class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered" ></video>
      <div class="q-pa-md q-gutter-sm row item.centers ">
        <q-btn @click="play" >play</q-btn>
        <q-btn @click="pause" >pause</q-btn>
        <q-btn @click="restart(src)" >restart</q-btn>
        <q-btn  align="around" class="btn-fixed-width" label="Copiar link" icon="link"  @click="showDialog = true; copyURL(anchor)">
          <q-tooltip class="bg-accent">Copiar link</q-tooltip>
        </q-btn>
        <socialSharing  :anchor="anchor" :title="anchor" position="bottom"/>
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
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import socialSharing from 'components/SocialSharing.vue'

export default {
  name: 'VideoPlayer',
  components: {
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
    userAgent: [String],
    referer: [String]
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
      showDialog: false,
      copiedUrl: ''
    }
  },
  async mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.log('onPlayerReady', this)
    })

    // Para streams da Surfline, use o proxy
    let videoSrc = this.src
    if (this.src && this.src.includes && this.src.includes('surfline')) {
      try {
        const url = new URL(this.src)
        const pathParts = url.pathname.split('/').filter(part => part.length > 0)
        // If the incoming URL is a playlist -> request the playlist filename on the proxy
        if (pathParts.length >= 3 && pathParts[2] === 'playlist.m3u8') {
          const country = pathParts[0]
          const location = pathParts[1]
          videoSrc = `http://proxy.huna.pt/proxy/surfline/${country}/${location}/playlist.m3u8`
          console.log(`Converted Surfline playlist URL: ${this.src} -> ${videoSrc}`)
        } else if (this.src.endsWith('.ts') && pathParts.length >= 3) {
          // If src is a direct segment, route the segment through the proxy surfline segment endpoint
          const country = pathParts[0]
          const location = pathParts[1]
          const filename = pathParts[pathParts.length - 1]
          videoSrc = `http://proxy.huna.pt/proxy/surfline/${country}/${location}/${filename}`
          console.log(`Converted Surfline segment URL: ${this.src} -> ${videoSrc}`)
        } else {
          console.warn('Unexpected Surfline URL format:', this.src)
          videoSrc = 'http://proxy.huna.pt/proxy/surfline/ireland/pt-covadovapor/playlist.m3u8'
        }
      } catch (error) {
        console.error('Error parsing Surfline URL:', error)
        videoSrc = 'http://proxy.huna.pt/proxy/surfline/ireland/pt-covadovapor/playlist.m3u8'
      }
    }

    console.log('Loading video source:', videoSrc)
    this.player.src({ src: videoSrc, type: this.type })
  },

  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style lang="sass">
.main-video-player
  iframe
    width: 100%
    height: calc(100vw/1.77)
    border-radius:25px

  div
    border-radius:25px

  .q-btn
    background: #ffa5001c

</style>
