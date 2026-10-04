<template>
  <div>
    <div class="main-video-player">
      <video ref="videoPlayer" class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered"></video>
      <div class="custom-controls q-pa-md q-gutter-sm row flex justify-center align-center">
        <q-btn v-if="isFullscreen && computedHasPrevious" @click="$emit('previous-camera')" icon="skip_previous" label="Anterior" aria-label="Anterior" unelevated class="icon-only-mobile fullscreen-nav-btn" />
        <q-btn @click="togglePlay" :label="isPlaying ? 'pause' : 'play'" :aria-label="isPlaying ? 'Pausar' : 'Reproduzir'" :icon="isPlaying ? 'pause' : 'play_arrow'" unelevated class="icon-only-mobile" />
        <q-btn @click="restart()" icon="replay" label="restart" aria-label="Reiniciar" unelevated class="icon-only-mobile" />
        <q-btn v-if="showFullscreenButton" @click="toggleFullscreen" :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" :aria-label="isFullscreen ? 'Sair de ecrã inteiro' : 'Ecrã inteiro'" flat dense />
        <q-btn :disable="sourceChanging" align="around" class="btn-fixed-width icon-only-mobile" label="Copiar link" icon="link" @click="copyURL()">
          <q-tooltip class="bg-accent">Copiar link</q-tooltip>
        </q-btn>
        <socialSharing v-if="!sourceChanging" :anchor="displayedAnchor" :title="displayedTitle" position="bottom" class="icon-only-mobile" />
        <q-btn v-if="captureEnabled && (isFullscreen || $q.platform.is.mobile)" :disable="sourceChanging" icon="camera_alt" size="md" @click.stop.prevent="requestCapture" title="Capturar imagem" aria-label="Capturar imagem" />
        <q-btn v-if="isFullscreen && hasNext" @click="$emit('next-camera')" icon="skip_next" label="Próximo" aria-label="Próximo" unelevated class="icon-only-mobile fullscreen-nav-btn" />
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
import { copyText } from 'src/utils/clipboard.mjs'

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
    displayedCamera: { type: Object, default: null },
    captureEnabled: { type: Boolean, default: false },
    showFullscreenButton: { type: Boolean, default: true },
    userAgent: [String],
    referer: [String],
    hasPrevious: { type: Boolean, default: false },
    hasNext: { type: Boolean, default: false },
    index: { type: Number }
  },
  computed: {
    displayedAnchor () {
      return this.displayedCamera ? this.displayedCamera.anchor : this.anchor
    },
    displayedTitle () {
      return this.displayedCamera ? this.displayedCamera.title : this.anchor
    },
    computedHasPrevious () {
      return this.hasPrevious
    }
  },
  methods: {
    getPlaybackIntent () {
      return this.sourceChanging ? this._sourcePlayIntent : !!(this.player && !this.player.paused())
    },
    async play () {
      const player = this.player
      if (!player || this._destroying) return
      if (this.sourceChanging) {
        this._sourcePlayIntent = true
        this._rollbackPlayIntent = true
      }
      try {
        await player.play()
      } catch (e) {
        if (!this._destroying && this.player === player) {
          this.isPlaying = !player.paused()
          console.warn('Playback failed', e)
        }
      }
    },
    pause () {
      if (!this.player) return
      if (this.sourceChanging) {
        this._sourcePlayIntent = false
        this._rollbackPlayIntent = false
      }
      this.player.pause()
      this.isPlaying = false
    },
    togglePlay () {
      if (this.getPlaybackIntent()) this.pause()
      else this.play()
    },
    toProxy (orig) {
      if (!orig || typeof orig !== 'string') return orig
      const proto = window.location.protocol === 'https:' ? 'https' : 'http'
      try {
        const url = new URL(orig)
        if (!['cams.cdn-surfline.com', 'hls.cdn-surfline.com'].includes(url.hostname) || url.port || url.username || url.password || !/^https?:$/.test(url.protocol)) return orig
        if (!/^\/[^/]+\/[^/]+\/(playlist\.m3u8|[^/]+\.ts)$/.test(url.pathname)) return orig
        return proto + '://proxy.huna.pt/proxy/surfline' + url.pathname + url.search + url.hash
      } catch (e) {}
      return orig
    },
    setPlayerSrc (src, { play = false, type = this.type } = {}) {
      if (!this.player) return
      try {
        this.player.src({ src, type })
        this.player.load()
        this.proxiedSrc = src
        this._committedSource = { src, type, play }
        if (play) this.play()
        else this.pause()
      } catch (e) {
        console.warn('Error setting player source', e)
      }
    },
    cancelSourceChange ({ rollback = true } = {}) {
      clearTimeout(this._srcDebounce)
      if (this._cancelSourceChange) this._cancelSourceChange(rollback)
    },
    restoreSource (src, type, options = {}) {
      const play = options.play === undefined ? this.getPlaybackIntent() : options.play
      if (this._cancelSourceChange) this._cancelSourceChange(false)
      clearTimeout(this._srcDebounce)
      const current = this.player && this.player.currentSource()
      if (current && current.src === this.toProxy(src) && current.type === (type || this.type)) {
        this.proxiedSrc = current.src
        this._committedSource = { src: current.src, type: current.type, play }
        if (play) this.play()
        else this.pause()
        return Promise.resolve()
      }
      // Restoration is an authoritative card/prop identity change, not a
      // speculative fullscreen step. Cancellation or a later failed step must
      // never roll it back to the feed that belonged to the previous session.
      this._committedSource = { src: this.toProxy(src), type: type || this.type, play }
      return this.changeCameraSource(src, type, { play })
    },
    changeCameraSource (newSrc, newType, options = {}) {
      if (!this.player) return Promise.reject(new Error('no player'))
      const intendedPlay = options.play === undefined
        ? (this.sourceChanging ? this._sourcePlayIntent : !this.player.paused())
        : options.play
      const previous = Object.assign({}, this._committedSource || { src: this.proxiedSrc, type: this.type })
      if (!this.sourceChanging) previous.play = !this.player.paused()
      else previous.play = this._rollbackPlayIntent
      if (this._cancelSourceChange) this._cancelSourceChange(false)
      clearTimeout(this._srcDebounce)
      const generation = (this._sourceGeneration || 0) + 1
      this._sourceGeneration = generation
      const source = { src: this.toProxy(newSrc), type: newType || this.type }
      this.sourceChanging = true
      this._sourcePlayIntent = intendedPlay
      this._rollbackPlayIntent = previous.play
      return new Promise((resolve, reject) => {
        const player = this.player
        let settled = false
        let timeout
        const cleanup = () => {
          player.off('canplay', onReady)
          player.off('playing', onReady)
          player.off('error', onError)
          clearTimeout(timeout)
          if (this._sourceGeneration === generation) this._cancelSourceChange = null
        }
        const finish = (error, rollback = true) => {
          if (settled) return
          settled = true
          cleanup()
          if (this._sourceGeneration === generation) {
            this.sourceChanging = false
            if (error && rollback && !this._destroying) {
              this.setPlayerSrc(previous.src, { type: previous.type, play: this._rollbackPlayIntent })
            } else if (!error) {
              this.proxiedSrc = source.src
              this._committedSource = Object.assign({}, source, { play: this._sourcePlayIntent })
              if (!this._sourcePlayIntent) this.pause()
            }
          }
          if (error) reject(error)
          else resolve()
        }
        const onReady = () => finish()
        const sourceError = (message, code) => Object.assign(new Error(message), { code })
        const onError = () => finish(sourceError('player error', 'SOURCE_LOAD_ERROR'))
        this._cancelSourceChange = (rollback) => finish(sourceError('camera source change cancelled', 'SOURCE_CHANGE_CANCELLED'), rollback)
        try {
          player.pause()
          player.on('canplay', onReady)
          player.on('playing', onReady)
          player.on('error', onError)
          timeout = setTimeout(() => finish(sourceError('camera source change timed out', 'SOURCE_CHANGE_TIMEOUT')), 6000)
          player.src(source)
          player.load()
          if (intendedPlay) {
            const playback = player.play()
            if (playback && playback.catch) playback.catch(error => finish(error))
          }
        } catch (e) {
          finish(e)
        }
      })
    },
    restart (link) {
      if (!this.player) return
      this.cancelSourceChange()
      this.pause()
      this.setPlayerSrc(this.toProxy(link || this.proxiedSrc || this.src), { play: true })
    },
    async copyURL () {
      if (this.sourceChanging) return
      try {
        this.copiedUrl = window.location.origin + this.$route.path + '#' + this.displayedAnchor
        await copyText(this.copiedUrl)
        this.showDialog = true
      } catch ($e) {
        alert('Cannot copy')
      }
    },
    requestCapture () {
      if (this.captureEnabled && !this.sourceChanging) this.$emit('capture-request')
    },
    async captureFrame () {
      if (!this.captureEnabled || this.sourceChanging) return null
      try {
        const tech = this.player && this.player.tech()
        const htmlVideo = (tech && tech.el()) || this.$refs.videoPlayer
        if (!htmlVideo) return null
        const canvas = document.createElement('canvas')
        canvas.width = htmlVideo.videoWidth || htmlVideo.clientWidth || 640
        canvas.height = htmlVideo.videoHeight || htmlVideo.clientHeight || 360
        canvas.getContext('2d').drawImage(htmlVideo, 0, 0, canvas.width, canvas.height)
        return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      } catch (e) {
        console.warn('captureFrame failed', e)
        return null
      }
    },
    fullscreenElement () {
      return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
    },
    async toggleFullscreen () {
      const wrapper = this.$el.querySelector('.main-video-player')
      if (!wrapper) return
      try {
        if (this.fullscreenElement() === wrapper) {
          const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
          if (exit) await exit.call(document)
        } else {
          const request = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen || wrapper.mozRequestFullScreen || wrapper.msRequestFullscreen
          if (request) await request.call(wrapper)
        }
      } catch (e) {
        console.warn('toggleFullscreen failed', e)
      }
    },
    lockOrientationIfMobile () {
      if (!/mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent || '')) return
      try {
        const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation
        if (orientation && orientation.lock) {
          const lock = orientation.lock('landscape')
          if (lock && lock.catch) lock.catch(() => {})
        } else if (screen.lockOrientation) screen.lockOrientation('landscape')
      } catch (e) {}
    },
    unlockOrientationIfLocked () {
      try {
        const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation
        if (orientation && orientation.unlock) orientation.unlock()
        else if (screen.unlockOrientation) screen.unlockOrientation()
      } catch (e) {}
    }
  },
  data () {
    return {
      player: null,
      showDialog: false,
      copiedUrl: '',
      proxiedSrc: '',
      isFullscreen: false,
      sourceChanging: false,
      isPlaying: false
    }
  },
  mounted () {
    const playerOpts = Object.assign({}, this.options, {
      controls: false,
      bigPlayButton: false,
      controlBar: false,
      fluid: true
    })
    this.player = videojs(this.$refs.videoPlayer, playerOpts)
    this.player.on('play', () => { this.isPlaying = true })
    this.player.on('pause', () => { this.isPlaying = false })
    this.player.on('ended', () => { this.isPlaying = false })
    this._onDoubleClick = (event) => {
      event.stopImmediatePropagation()
      event.preventDefault()
    }
    this.player.el().addEventListener('dblclick', this._onDoubleClick, true)
    this._onFs = () => {
      const wrapper = this.$el.querySelector('.main-video-player')
      const wasFullscreen = this.isFullscreen
      this.isFullscreen = !!wrapper && this.fullscreenElement() === wrapper
      if (wrapper) wrapper.classList.toggle('is-fullscreen', this.isFullscreen)
      if (wasFullscreen === this.isFullscreen) return
      this.$emit('fullscreen-change', { index: this.index, isFullscreen: this.isFullscreen })
      if (this.isFullscreen) this.lockOrientationIfMobile()
      else this.unlockOrientationIfLocked()
    }
    for (const event of ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']) {
      document.addEventListener(event, this._onFs)
    }
    this.proxiedSrc = this.toProxy(this.src)
    this.setPlayerSrc(this.proxiedSrc)
  },
  watch: {
    src (newVal) {
      clearTimeout(this._srcDebounce)
      this._srcDebounce = setTimeout(() => {
        this.restoreSource(newVal, this.type).catch(() => {})
      }, 120)
    }
  },
  beforeDestroy () {
    this._destroying = true
    clearTimeout(this._srcDebounce)
    if (this._cancelSourceChange) this._cancelSourceChange(false)
    if (this.isFullscreen) {
      this.$emit('fullscreen-change', { index: this.index, isFullscreen: false })
      this.unlockOrientationIfLocked()
    }
    for (const event of ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']) {
      document.removeEventListener(event, this._onFs)
    }
    if (this.player) {
      this.player.el().removeEventListener('dblclick', this._onDoubleClick, true)
      this.player.dispose()
    }
  }
}
</script>

<style lang="sass">
.main-video-player
  position: relative
  iframe
    width: 100%
    height: calc(100vw/1.77)
    border-radius:25px

  .q-btn
    background: #ffa000

.custom-controls
  position: absolute
  left: 0
  right: 0
  width: 100%
  bottom: -20px
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  padding: 0 12px
  background: rgba(0,0,0,0)
  z-index: 60
  box-sizing: border-box
  white-space: nowrap
  flex-wrap: nowrap
  overflow-x: auto
  button, .q-btn
    white-space: nowrap
    flex: 0 0 auto

@media (max-width: 640px)
  .custom-controls::-webkit-scrollbar
    display: none
  .custom-controls
    gap: 2px
    -ms-overflow-style: none
    scrollbar-width: none
    position: relative
    bottom: -5px
  .custom-controls button, .custom-controls .q-btn .q-btn__wrapper
    padding: 3px 6px
    font-size: 10px
  .custom-controls .icon-only-mobile .q-icon,
  .custom-controls .social-btn .q-icon
    font-size: 18px !important

@media (max-width: 950px)
  .is-fullscreen .video-js .vjs-tech
    height: 100vh
  .custom-controls .icon-only-mobile .q-btn__content > span:not(.q-icon),
  .custom-controls .icon-only-mobile .q-btn__content > .q-btn__label,
  .custom-controls .icon-only-mobile .btn__label,
  .custom-controls .social-btn .q-btn__label,
  .custom-controls .social-btn .q-btn__content .q-btn__label,
  .custom-controls .social-btn .q-btn__content > span:not(.q-icon)
    display: none !important
  .custom-controls .icon-only-mobile .on-left
    margin-right: 0px

.main-video-player.is-fullscreen .custom-controls
  position: absolute
  bottom: 18px
  padding: 8px 12px

.main-video-player.is-fullscreen
  background: black
  .video-js
    height: 100%
    padding-top: 0
  .vjs-tech
    object-fit: contain

.fullscreen-nav-btn
  background: #ffa000 !important
  font-weight: 600

.video-js .vjs-control-bar,
.video-js .vjs-big-play-button,
.video-js .vjs-control
  display: none !important

</style>
