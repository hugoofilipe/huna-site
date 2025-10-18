<template>
  <div>
   <div class="main-video-player">
     <video ref="videoPlayer" class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered" ></video>
     <div class="custom-controls q-pa-md q-gutter-sm row flex justify-center align-center">
      <q-btn @click="togglePlay" :label="isPlaying ? 'pause' : 'play'" :icon="isPlaying ? 'pause' : 'play_arrow'" unelevated class="icon-only-mobile"/>
      <q-btn @click="restart()" icon="replay" :label="'restart'" unelevated class="icon-only-mobile"/>
      <q-btn v-if="showFullscreenButton" @click="toggleFullscreen" :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" flat dense />
      <q-btn  align="around" class="btn-fixed-width icon-only-mobile" label="Copiar link" icon="link"  @click="showDialog = true; copyURL(anchor)">
        <q-tooltip class="bg-accent">Copiar link</q-tooltip>
      </q-btn>
      <socialSharing  :anchor="anchor" :title="anchor" position="bottom" class="icon-only-mobile"/>
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
    showFullscreenButton: { type: Boolean, default: true },
    userAgent: [String],
    referer: [String]
  },
  methods: {
    play () {
      if (this.player) this.player.play()
      this.isPlaying = true
    },
    pause () {
      if (this.player) this.player.pause()
      // this.player.hasStarted(false)
      // this.player.currentTime(0)
      // // this.player.posterImage.show()
      this.player.bigPlayButton.show()
      this.isPlaying = false
    },
    togglePlay () {
      try {
        if (this.isPlaying) this.pause()
        else this.play()
      } catch (e) {
        console.warn('togglePlay failed', e)
      }
    },
    // Convert Surfline origin URLs (playlist or segment) to our proxy endpoint
    toProxy (orig) {
      if (!orig || typeof orig !== 'string') return orig
      // If it's already our proxy, don't change it
      if (orig.includes('proxy.huna.pt')) return orig
      if (!(orig.includes && orig.includes('surfline'))) return orig
      try {
        const url = new URL(orig)
        const pathParts = url.pathname.split('/').filter(p => p.length > 0)
        if (pathParts.length >= 3 && pathParts[2] === 'playlist.m3u8') {
          // preserve current page protocol (http/https)
          const proto = window.location.protocol === 'https:' ? 'https' : 'http'
          return `${proto}://proxy.huna.pt/proxy/surfline/${pathParts[0]}/${pathParts[1]}/playlist.m3u8`
        } else if (orig.endsWith('.ts') && pathParts.length >= 3) {
          const filename = pathParts[pathParts.length - 1]
          const proto = window.location.protocol === 'https:' ? 'https' : 'http'
          return `${proto}://proxy.huna.pt/proxy/surfline/${pathParts[0]}/${pathParts[1]}/${filename}`
        }
      } catch (e) {
        console.error('Error parsing Surfline URL in toProxy:', e)
      }
      const proto = window.location.protocol === 'https:' ? 'https' : 'http'
      return `${proto}://proxy.huna.pt/proxy/surfline/ireland/pt-covadovapor/playlist.m3u8`
    },

    // Helper to set the player's source and optionally play
    setPlayerSrc (src, { play = false } = {}) {
      if (!this.player) return
      try {
        this.player.src({ src, type: this.type })
        this.player.load()
        if (play) this.player.play()
      } catch (e) {
        console.error('Error setting player src:', e)
      }
    },

    // Restart using optional link, otherwise use stored proxiedSrc
    restart (link) {
      const raw = link || this.proxiedSrc || this.src
      const srcToUse = this.toProxy(raw)
      this.player.pause()
      this.setPlayerSrc(srcToUse, { play: true })
    },
    async copyURL (anchor) {
      try {
        this.copiedUrl = 'www.huna.pt/cam#' + anchor
        await navigator.clipboard.writeText(this.copiedUrl)
        // this.toolbar = true
      } catch ($e) {
        alert('Cannot copy')
      }
    },

    // Toggle fullscreen programmatically. We disable double-click fullscreen
    // and rely on this method to enter/exit fullscreen and show a bottom toolbar.
    toggleFullscreen () {
      try {
        const wrapper = this.$el.querySelector('.main-video-player')
        if (!wrapper) return
        // record whether the player is currently playing so we can restore that state
        try {
          this.restart()
        } catch (e) {
          this.prevWasPlaying = null
        }

        const docIsFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
        if (docIsFs) {
          // exit fullscreen
          if (document.exitFullscreen) document.exitFullscreen()
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
        } else {
          if (wrapper.requestFullscreen) wrapper.requestFullscreen()
          else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen()
          else if (wrapper.mozRequestFullScreen) wrapper.mozRequestFullScreen()
          else if (wrapper.msRequestFullscreen) wrapper.msRequestFullscreen()
        }
      } catch (e) {
        console.warn('toggleFullscreen failed', e)
      }
    },

    // Attempt to lock orientation to landscape on mobile when entering fullscreen
    lockOrientationIfMobile () {
      try {
        const ua = (navigator.userAgent || '').toLowerCase()
        const isMobile = /mobile|android|iphone|ipad|ipod/.test(ua)
        if (!isMobile) return
        const orientation = (screen.orientation || screen.mozOrientation || screen.msOrientation)
        if (orientation && orientation.lock) {
          orientation.lock('landscape').catch(() => {})
        } else if (screen.lockOrientation) {
          try { screen.lockOrientation('landscape') } catch (e) {}
        }
      } catch (e) {}
    },
    unlockOrientationIfLocked () {
      try {
        const orientation = (screen.orientation || screen.mozOrientation || screen.msOrientation)
        if (orientation && orientation.unlock) {
          orientation.unlock()
        } else if (screen.unlockOrientation) {
          try { screen.unlockOrientation() } catch (e) {}
        }
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
      isPlaying: false
    }
  },
  async mounted () {
    // Merge incoming options with defaults that disable Video.js UI controls
    const defaultOpts = {
      controls: false,
      bigPlayButton: false,
      controlBar: false,
      // keep fluid behavior if desired
      fluid: true
    }
    const playerOpts = Object.assign({}, defaultOpts, this.options)
    this.player = videojs(this.$refs.videoPlayer, playerOpts, () => {
      this.player.log('onPlayerReady', this)
      // Hide control bar elements as an extra safeguard in case some skin shows them
      try {
        const el = this.$el.querySelector('.vjs-control-bar')
        if (el) el.style.display = 'none'
      } catch (e) {}
    })

    // Keep isPlaying in sync with player events
    try {
      const onPlay = () => { this.isPlaying = true }
      const onPause = () => { this.isPlaying = false }
      this._onPlayerPlay = onPlay
      this._onPlayerPause = onPause
      if (this.player && this.player.on) {
        this.player.on('play', onPlay)
        this.player.on('pause', onPause)
      }
    } catch (e) {}

    // Prevent double-click default behavior (which toggles fullscreen)
    try {
      const playerEl = this.player && this.player.el && this.player.el()
      if (playerEl) {
        // use capture to intercept before video.js handler
        playerEl.addEventListener('dblclick', function dblstop (ev) {
          ev.stopImmediatePropagation()
          ev.preventDefault()
        }, true)
      }
    } catch (e) {}

    // Keep internal fullscreen state in sync
    try {
      // listen to document fullscreen change so we detect wrapper fullscreen
      const onFs = () => {
        const docIsFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
        this.isFullscreen = !!docIsFs
        // JS fallback: toggle a class on the wrapper so CSS can target it reliably across browsers
        try {
          const wrapper = this.$el && this.$el.querySelector && this.$el.querySelector('.main-video-player')
          if (wrapper) {
            if (docIsFs) wrapper.classList.add('is-fullscreen')
            else wrapper.classList.remove('is-fullscreen')
          }
          // Attempt to lock orientation to landscape on mobile when entering fullscreen
          try {
            if (docIsFs) this.lockOrientationIfMobile()
            else this.unlockOrientationIfLocked()
          } catch (e) {}
        } catch (e) {}
      }
      document.addEventListener('fullscreenchange', onFs)
      document.addEventListener('webkitfullscreenchange', onFs)
      document.addEventListener('mozfullscreenchange', onFs)
      document.addEventListener('MSFullscreenChange', onFs)
      this._onFs = onFs
    } catch (e) {}
    // compute proxied src and set player
    this.proxiedSrc = this.toProxy(this.src)
    console.log('Converted or fallback video source:', this.src, '->', this.proxiedSrc)
    this.setPlayerSrc(this.proxiedSrc)
  },

  watch: {
    // Recompute proxied src whenever the src prop changes (debounced)
    src: {
      handler (newVal) {
        clearTimeout(this._srcDebounce)
        this._srcDebounce = setTimeout(() => {
          this.proxiedSrc = this.toProxy(newVal)
          this.setPlayerSrc(this.proxiedSrc)
        }, 120)
      },
      immediate: false
    }
  },

  beforeDestroy () {
    if (this.player) {
      try {
        if (this.player && this.player.off) {
          if (this._onPlayerPlay) this.player.off('play', this._onPlayerPlay)
          if (this._onPlayerPause) this.player.off('pause', this._onPlayerPause)
        }
      } catch (e) {}
      this.player.dispose()
    }
    if (this._srcDebounce) {
      clearTimeout(this._srcDebounce)
    }
    if (this._onFs) {
      try {
        document.removeEventListener('fullscreenchange', this._onFs)
        document.removeEventListener('webkitfullscreenchange', this._onFs)
        document.removeEventListener('mozfullscreenchange', this._onFs)
        document.removeEventListener('MSFullscreenChange', this._onFs)
      } catch (e) {}
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

/* custom overlay controls placed inside the video area */
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
  /* keep controls on one line and centered */
  white-space: nowrap
  button, .q-btn
    white-space: nowrap
    flex: 0 0 auto

/* Mobile: ensure all buttons stay on a single line by allowing horizontal scrolling
   and hiding the scrollbar. Tighten spacing to fit more buttons. */
@media (max-width: 640px)
  /* hide scrollbars but keep scrollability */
  .custom-controls::-webkit-scrollbar
    display: none
  .custom-controls
    gap: 2px
    -ms-overflow-style: none
    scrollbar-width: none
    position: relative
    bottom: -5px
  /* ensure buttons are tighter on mobile */
  .custom-controls button, .custom-controls .q-btn .q-btn__wrapper
    padding: 3px 6px
    font-size: 10px
    /* ensure the icon remains visible and sized appropriately */
  .custom-controls .icon-only-mobile .q-icon,
  .custom-controls .social-btn .q-icon
    font-size: 18px !important
@media (max-width: 950px)
  .is-fullscreen .video-js .vjs-tech
    height: 100vh
  /* hide textual labels for copy and social buttons on mobile; keep icons visible */
  /* aggressively target possible label structures inside Quasar q-btn */
  .custom-controls .icon-only-mobile .q-btn__content > span:not(.q-icon),
  .custom-controls .icon-only-mobile .q-btn__content > .q-btn__label,
  .custom-controls .icon-only-mobile .btn__label,
  .custom-controls .social-btn .q-btn__label,
  .custom-controls .social-btn .q-btn__content .q-btn__label,
  .custom-controls .social-btn .q-btn__content > span:not(.q-icon)
    display: none !important
  .custom-controls .icon-only-mobile .on-left
    margin-right: 0px
/* Fallback class when fullscreenchange isn't reflected via pseudo-classes */
.main-video-player.is-fullscreen .custom-controls
  bottom: 18px
  padding: 8px 12px

/* Hide Video.js default controls to show only our custom buttons */
.video-js .vjs-control-bar,
.video-js .vjs-big-play-button,
.video-js .vjs-control
  display: none !important
</style>
