<template>
  <q-drawer
    v-model="localValue"
    side="right"
    :width="320"
    :breakpoint="600"
    class="sidebar webcam-sidebar"
    :overlay="mobile"
  >
    <q-toolbar class="q-pa-sm">
      <q-toolbar-title class="text-h6">Câmaras</q-toolbar-title>
      <q-btn dense flat icon="close" @click="localValue = false" aria-label="Fechar menu" />
    </q-toolbar>
    <div class="sidebar-content q-pa-xs">
      <q-list padding>
        <template v-if="mobile">
          <q-item
            v-for="(beach, index) in webcams"
            :key="beach.anchor"
            clickable
            v-ripple
            @click="$emit('go-to-camera', beach.anchor, index)"
            :class="'text-h6 menu-item-mobile ' + beach.anchor"
          >
            <q-item-section avatar><q-icon :name="iconSelect(beach.type)" /></q-item-section>
            <q-item-section><q-item-label>{{ beach.title }}</q-item-label></q-item-section>
            <q-item-section side><q-icon name="chevron_right" /></q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-expansion-item
            v-for="(beach, index) in webcams"
            :key="beach.anchor"
            :label="beach.title"
            dense
            dense-toggle
            expand-icon-toggle
            expand-separator
            group="beach"
            :class="'text-h6 ' + beach.anchor"
            :icon="iconSelect(beach.type)"
            :value="expandedItem === index"
            @input="handleExpansion($event, index)"
          >
            <template v-slot:header>
              <q-item-section avatar><q-icon :name="iconSelect(beach.type)" /></q-item-section>
              <q-item-section @click.stop="$emit('go-to-camera', beach.anchor, index)" style="cursor: pointer;">
                <q-item-label>{{ beach.title }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <p class="text-subtitle2">Type: <strong>{{ beach.type }}</strong></p>
                <p class="text-caption">SRC: {{ beach.src }}</p>
                <p class="text-caption">Anchor: {{ beach.anchor }}</p>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </template>
      </q-list>
    </div>
  </q-drawer>
</template>

<script>
export default {
  name: 'WebcamSidebar',
  props: {
    value: { type: Boolean, default: false },
    webcams: { type: Array, default: () => [] },
    mobile: { type: Boolean, default: false },
    expandedItem: { type: Number, default: null }
  },
  computed: {
    localValue: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    }
  },
  methods: {
    iconSelect (type) {
      return type === 'previsoes' ? 'img:/icons/analytics.svg' : 'img:/icons/beach.svg'
    },
    handleExpansion (value, index) {
      if (value) this.$emit('update:expanded-item', index)
      else if (this.expandedItem === index) this.$emit('update:expanded-item', null)
    }
  }
}
</script>

<style lang="sass" scoped>
.sidebar-content
  padding: 8px
.menu-item-mobile
  padding: 5px
  transition: background-color .2s
  &:active
    background-color: rgba(0, 0, 0, .1)
  .q-item__label
    font-size: 20px
    font-weight: 500
.text-h6
  font-size: 18px
  line-height: .7rem
.btn_active
  background: #ffa000
  border-radius: 50px
  font-weight: 600
  .q-item__label
    line-height: 1.4rem !important
.q-card__section
  padding-right: 20px
  word-break: break-all
  overflow-wrap: break-word
  p
    margin-bottom: 0
@media (min-width: 1080px) and (max-width: 1366px)
  .text-h6
    font-size: 15px
</style>
