import Vue from 'vue'

// Tell Vue to ignore the bestweather web component so it is not treated
// as a Vue component and rendered as-is.
Vue.config.ignoredElements = [
  ...(Vue.config.ignoredElements || []),
  'bestweather-forecast'
]
