<template>
  <q-dialog :value="value" persistent @input="$emit('input', $event)">
    <q-card class="ad-popup-card" role="dialog" aria-modal="true" aria-label="Anúncio imobiliário">
      <div class="ad-popup-poster">
        <q-btn
          v-close-popup
          class="ad-popup-close"
          icon="close"
          aria-label="Fechar anúncio"
          round
          flat
          color="white"
        />
        <img
          class="ad-popup-image"
          :src="poster"
          alt="Vendo a tua casa. Conheces alguém que queira vender a sua casa? Vamos falar! Hugo Filipe, consultor imobiliário, Casas do Tejo, 913314803."
          @error="$emit('input', false)"
        />
      </div>
      <q-card-actions class="ad-popup-actions">
        <q-btn
          v-close-popup
          label="Não tenho tempo"
          padding="12px 24px"
          color="orange"
          text-color="black"
          unelevated
          size="lg"
          class="text-weight-bold"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AdDialog',
  props: {
    value: Boolean,
    mobile: Boolean,
    posterDesktop: { type: String, default: '/images/poster_bg.png' },
    posterMobile: { type: String, default: '/images/poster_bg_mobile.png' }
  },
  computed: {
    poster () {
      return this.mobile ? this.posterMobile : this.posterDesktop
    }
  }
}
</script>

<style scoped lang="sass">
// The poster is sized from the viewport so it always shows whole (contact
// details included). 180px covers the dialog padding, the phone toolbars and
// the button row; the button sits below the poster so it never covers anything.
.ad-popup-card
  max-width: calc(100vw - 48px)
  background: transparent
  box-shadow: none
.ad-popup-poster
  position: relative
  width: fit-content
  margin: 0 auto
.ad-popup-image
  display: block
  width: auto
  height: auto
  max-width: 100%
  max-height: calc(100vh - 184px)
.ad-popup-close
  position: absolute
  top: 12px
  right: 12px
  background: rgba(0, 0, 0, 0.5)
.ad-popup-actions
  justify-content: center
  padding: 16px 0 0
</style>
