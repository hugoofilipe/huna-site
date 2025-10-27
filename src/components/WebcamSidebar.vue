<template>
  <q-drawer
    v-model="localValue"
    side="right"
    :width="320"
    :breakpoint="600"
    class="bg-grey-3 sidebar"
    :content-style="mobile ? {} : { top: '60px' }"
    :overlay="mobile"
    @update:model-value="$emit('input', $event)"
    @hide="$emit('input', false)"
  >
    <!-- Drawer header (useful on mobile) -->
    <q-toolbar class="q-pa-sm">
      <q-toolbar-title class="text-h6">Câmaras</q-toolbar-title>
      <q-btn dense flat icon="close" v-if="mobile" @click="$emit('input', false)" aria-label="Fechar menu" />
    </q-toolbar>

    <div class="sidebar-content q-pa-xs">
      <q-list padding>
        <template v-if="mobile">
          <q-item
            v-for="(beach, index) in webcams"
            :key="index"
            clickable
            v-ripple
            @click="$emit('go-to-camera', beach.anchor, index)"
            :class="'text-h6 menu-item-mobile ' + beach.anchor"
            active-class="text-black"
          >
            <q-item-section avatar>
              <q-icon :name="iconSelect(beach.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ beach.title }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </template>

        <!-- Desktop: Expansion items with details -->
        <template v-else>
          <q-expansion-item
            v-for="(beach, index) in webcams"
            :key="index"
            :label="beach.title"
            dense
            dense-toggle
            expand-icon-toggle
            expand-separator
            group="beach"
            :class="'text-h6 ' + beach.anchor"
            :icon="iconSelect(beach.type)"
            active-class="text-black"
            :name="index"
            :model-value="expandedItem === index"
            @update:model-value="handleExpansion($event, index)"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon :name="iconSelect(beach.type)" />
              </q-item-section>
              <q-item-section @click.stop="$emit('go-to-camera', beach.anchor, index)" style="cursor: pointer;">
                <q-item-label>{{ beach.title }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section style="white-space: normal">
                <p class="text-subtitle2">Type: <strong>{{beach.type}}</strong></p>
                <p class="text-caption">SRC: {{beach.src}}</p>
                <p class="text-caption">Anchor: {{beach.anchor}}</p>
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
    value: {
      type: Boolean,
      default: false
    },
    webcams: {
      type: Array,
      default: () => []
    },
    mobile: {
      type: Boolean,
      default: false
    },
    expandedItem: {
      type: Number,
      default: null
    }
  },
  emits: ['input', 'go-to-camera', 'update:expandedItem'],
  data () {
    return {
      localValue: false
    }
  },
  watch: {
    value: {
      handler (newVal) {
        this.localValue = newVal
      },
      immediate: true
    }
  },
  methods: {
    iconSelect (type) {
      if (type === 'previsoes') {
        return 'img:/icons/analytics.svg'
      } else {
        return 'img:/icons/beach.svg'
      }
    },
    handleExpansion (value, index) {
      if (value) {
        this.$emit('update:expandedItem', index)
      } else if (this.expandedItem === index) {
        this.$emit('update:expandedItem', null)
      }
    }
  }
}

</script>

<style lang="sass" scoped>
// Include the relevant styles from the original
.sidebar
  margin-top: 60px
  @media (max-width: 600px)
    margin-top: 0
  .sidebar-content
    max-height: calc(100vh - 60px)
    overflow-y: auto
    padding: 8px
    @media (max-width: 600px)
      max-height: calc(100vh - 60px)
  .menu-item-mobile
    padding: 5px 5px
    transition: background-color 0.2s
    &:active
      background-color: rgba(0, 0, 0, 0.1)
    .q-item__label
      font-size: 20px
      font-weight: 500
  .text-h6
    font-size: 18px
    line-height: 0.7rem
  .btn_active
    background: #ffa000
    border-radius: 50px
    font-weight: 600
    .q-item__label
      line-height: 1.4rem !important
    a
      padding: 8px 0px
    img
      padding-left: 10px
  @media (min-width: 1080px) and (max-width: 1366px)
    .q-item--dense
      min-height: 13px
    .text-h6
      font-size: 15px
    .q-item__section--side > .q-icon
      font-size: 20px
  .q-card__section
    padding-right: 20px
    word-break: break-all
    overflow-wrap: break-word
    @media (max-width: 768px)
      .q-item
        min-height: 25px
        padding: 0px 5px 0px 10px
        .text-h6
          font-size: 14px
          line-height: 0.7rem
        .q-icon
          font-size: 20px
        .btn_active
          font-size: 18px
</style>
