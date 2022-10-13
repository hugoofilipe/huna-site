<template>
  <div class="main-video-youtube">
    <LazyYoutube
        ref="lazyVideo"
        :src="src"
        max-width="100%"
    />

    <div class="q-pa-md q-gutter-sm row item.centers ">
      <q-btn @click="handleClick('playVideo')">Play</q-btn>
      <!-- <button @click="handleClick('stopVideo')">Stop</button> -->
      <q-btn @click="handleClick('pauseVideo')">Pause</q-btn>
      <q-btn @click="restart">Restart</q-btn>
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
  </div>
</template>

<script>
import { LazyYoutube } from 'vue-lazytube'
import socialSharing from 'components/SocialSharing.vue'

export default {
  name: 'VideoPlayer',
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
    anchor: [Number, String]
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

  .q-btn
    background: #ffa5001c
.q-toolbar__title.ellipsis
  white-space: break-spaces

</style>
