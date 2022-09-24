<template>
  <div>
    <div :id="anchor" v-if="type === 'application/x-mpegURL'" class="main-video">
      <video ref="videoPlayer" class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered">
        <source
          :src="src"
          :type="type"
        >
      </video>
    </div>
    <div :id="anchor" v-else-if="type === 'video/youtube'" class="main-video">
      <iframe
        id="ytplayer"
        type="text/html"
        :src="src"
        frameborder="0"
        allowfullscreen
      >
      </iframe>
    </div>
    <div v-else >somthing goes wrong</div>
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
