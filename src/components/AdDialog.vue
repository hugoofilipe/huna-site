<template>
  <q-dialog v-model="localModel" persistent backdrop-blur="1px">
    <q-card class="ad-popup-card" role="dialog" aria-label="Advertisement" style="border-radius: 8px; overflow: hidden; position: relative; max-width: 1200px; margin: auto; background: transparent;">
      <div class="ad-image-wrapper" style="position: relative;">
        <q-btn
          icon="close"
          round
          flat
          color="white"
          class="ad-close-btn"
          @click="close"
        />
        <img v-if="!mobile" class="ad-image" :src="posterDesktop" alt="Advertisement"/>
        <img v-else class="ad-image" :src="posterMobile" alt="Advertisement Mobile"/>

        <q-card-actions align="center" class="ad-popup-actions">
          <q-btn
            label="Não tenho tempo"
            padding="12px 24px"
            color="orange"
            text-color="black"
            unelevated
            size="lg"
            class="text-weight-bold"
            @click="close"
          />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AdDialog',
  // Vue 2 compatibility: v-model on custom component uses `value`/`input` by default.
  // The `model` option is ignored in Vue 3 but helps Vue 2 consumers.
  model: { prop: 'value', event: 'input' },
  props: {
    // support both Vue 2 (value/input) and Vue 3 (modelValue/update:modelValue)
    modelValue: { type: Boolean, default: false },
    value: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    posterDesktop: { type: String, default: 'images/poster_bg.png' },
    posterMobile: { type: String, default: 'images/poster_bg_mobile.png' }
  },
  computed: {
    localModel: {
      get () {
        // prefer explicit modelValue (Vue 3), fall back to value (Vue 2)
        if (this.modelValue !== undefined) return this.modelValue
        return this.value
      },
      set (v) {
        this.$emit('update:modelValue', v)
        this.$emit('input', v)
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:modelValue', false)
      this.$emit('input', false)
    }
  },
  mounted () {
    // debug logging to verify component is mounted and receiving model changes
    try {
      console.log('AdDialog mounted, initial model:', this.localModel)
    } catch (e) {}
  },
  watch: {
    localModel (v) {
      try { console.log('AdDialog localModel changed ->', v) } catch (e) {}
    }
  }
}
</script>

<style scoped lang="sass">
.ad-popup-card
  background: transparent
  max-height: 90vh
  display: flex
  justify-content: center
  align-items: center
  box-shadow: 3px 2px 10px 2px #0000007d
.ad-image-wrapper
  width: 100%
  max-height: 90vh
  position: relative
.ad-image
  width: 100%
  height: 100%
  object-fit: cover
  display: block
.ad-close-btn
  position: absolute
  top: 12px
  right: 12px
  z-index: 2
  background: rgba(0,0,0,0.5)
.ad-popup-actions
  position: absolute
  left: 50%
  transform: translateX(-50%)
  bottom: 20px
  .q-btn
    white-space: nowrap
    flex: 0 0 auto

@media (max-width: 680px)
  .ad-image-wrapper
    max-height: 80vh
</style>
