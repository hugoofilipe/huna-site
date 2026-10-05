export const WEATHER_WIDGET_SRC = 'https://widget.bestweather.org/v0.3.0/bestweather-forecast.js'

let pending

export function loadWeatherWidget () {
  if (window.customElements.get('bestweather-forecast')) return Promise.resolve()
  if (pending) return pending

  pending = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="' + WEATHER_WIDGET_SRC + '"]')
    const script = existing || document.createElement('script')
    const timeout = setTimeout(() => finish(new Error('Weather widget loading timed out')), 20000)
    const finish = error => {
      clearTimeout(timeout)
      script.removeEventListener('load', loaded)
      script.removeEventListener('error', failed)
      if (error) {
        script.remove()
        pending = undefined
        reject(error)
      } else {
        resolve()
      }
    }
    const loaded = () => {
      finish(window.customElements.get('bestweather-forecast') ? null : new Error('Weather widget did not register'))
    }
    const failed = () => finish(new Error('Weather widget script could not load'))
    script.addEventListener('load', loaded)
    script.addEventListener('error', failed)
    if (!existing) {
      script.src = WEATHER_WIDGET_SRC
      script.async = true
      document.head.appendChild(script)
    }
  })
  return pending
}
