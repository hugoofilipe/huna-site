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
    </div>
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
    }
  },
  data () {
    return {
      player: null
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
