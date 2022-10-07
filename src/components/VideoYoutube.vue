<template>
  <div>
    <LazyYoutube
        ref="lazyVideo"
        :src="src"
        max-width="100%"
    />
    <q-btn @click="handleClick('playVideo')">Play</q-btn>
    <!-- <button @click="handleClick('stopVideo')">Stop</button> -->
    <q-btn @click="handleClick('pauseVideo')">Pause</q-btn>
    <q-btn @click="restart">Restart</q-btn>
  </div>
</template>

<script>
import { LazyYoutube } from 'vue-lazytube'

export default {
  name: 'VideoPlayer',
  components: {
    LazyYoutube
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
    }
  },
  data () {
    return {
      player: null
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
.main-video
  iframe
    width: 100%
    height: calc(100vw/1.77)
    border-radius:25px

  div
    border-radius:25px

</style>
