<template>
  <span>
    <q-btn v-if="position === 'top'" push round color="white" size="xl" icon="fab fa-whatsapp" aria-label="Partilhar no WhatsApp" @click="prepareShare" />
    <q-btn v-else-if="position === 'bottom'" align="around" text-color="black" class="btn-fixed-width social-btn" label="whatsapp" aria-label="Partilhar no WhatsApp" icon="fab fa-whatsapp" @click="prepareShare" />
    <q-dialog v-model="showDialog" :persistent="sharing" @hide="clearShare">
      <q-card class="bg-white text-black q-pa-md" style="width: 480px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Partilhar no WhatsApp</div>
          <p style="white-space: pre-line; overflow-wrap: anywhere;">{{ shareText }}</p>
          <q-spinner v-if="preparing" aria-label="A capturar imagem" />
          <img v-if="previewUrl" :src="previewUrl" alt="Frame da câmara selecionada" style="display: block; width: 100%; height: auto;">
          <p v-if="notice" role="status">{{ notice }}</p>
          <p v-if="file">Escolhe o WhatsApp no menu de partilha.</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" :disable="sharing" v-close-popup />
          <q-btn v-if="file" color="black" label="Partilhar imagem" :loading="sharing" @click="shareImage" />
          <q-btn v-else color="black" label="Partilhar só texto e link" :disable="preparing" type="a" :href="whatsappUrl" target="_blank" rel="noopener noreferrer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
export default {
  name: 'socialSharing',
  props: {
    anchor: [String],
    title: [String],
    position: [String],
    path: { type: String, default: '/cam' },
    captureFrame: { type: Function, default: null },
    captureUnavailableMessage: { type: String, default: 'Não é possível capturar uma imagem desta câmara.' }
  },
  data () {
    return {
      showDialog: false,
      preparing: false,
      sharing: false,
      shareText: '',
      file: null,
      previewUrl: '',
      notice: ''
    }
  },
  computed: {
    whatsappUrl () {
      return 'https://wa.me/?text=' + encodeURIComponent(this.shareText)
    }
  },
  methods: {
    async prepareShare () {
      if (this.preparing || this.sharing) return
      this.clearShare()
      const preparation = this._preparation
      const url = new URL(this.path, 'https://www.huna.pt')
      url.hash = this.anchor
      this.shareText = this.title + '\n' + url.href
      this.showDialog = true
      if (!this.captureFrame) {
        this.notice = this.captureUnavailableMessage + ' Podes partilhar só o texto e o link.'
        return
      }
      this.preparing = true
      try {
        const blob = await this.captureFrame()
        if (preparation !== this._preparation) return
        if (!blob) throw new Error('No frame available')
        const file = new File([blob], 'camera-frame.png', { type: 'image/png' })
        if (!navigator.share || !navigator.canShare || !navigator.canShare({ files: [file], text: this.shareText })) {
          this.notice = 'Este navegador não permite partilhar imagens. Podes partilhar só o texto e o link.'
          return
        }
        this.previewUrl = URL.createObjectURL(blob)
        this.file = file
      } catch (error) {
        if (preparation === this._preparation) this.notice = 'Não foi possível preparar a imagem. Podes partilhar só o texto e o link.'
      } finally {
        if (preparation === this._preparation) this.preparing = false
      }
    },
    async shareImage () {
      if (!this.file || this.sharing) return
      this.sharing = true
      try {
        // Called from a fresh tap: asynchronous capture can consume user activation.
        await navigator.share({ files: [this.file], text: this.shareText })
        this.showDialog = false
      } catch (error) {
        if (error.name !== 'AbortError') {
          this.clearShare()
          this.notice = 'Não foi possível partilhar a imagem. Podes partilhar só o texto e o link.'
        }
      } finally {
        this.sharing = false
      }
    },
    clearShare () {
      this._preparation = (this._preparation || 0) + 1
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = ''
      this.file = null
      this.notice = ''
      this.preparing = false
    }
  },
  beforeDestroy () {
    this.clearShare()
  }
}
</script>
