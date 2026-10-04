import assert from 'node:assert/strict'
import test from 'node:test'

test('widget loader deduplicates, registers, and retries failed scripts', async () => {
  let registered = false
  const scripts = []
  globalThis.window = { customElements: { get: () => registered } }
  globalThis.document = {
    querySelector: () => scripts[0],
    createElement: () => {
      const script = new EventTarget()
      script.remove = () => scripts.splice(scripts.indexOf(script), 1)
      return script
    },
    head: { appendChild: script => scripts.push(script) }
  }
  try {
    const { loadWeatherWidget, WEATHER_WIDGET_SRC } = await import('../src/utils/weather-widget.mjs')
    const first = loadWeatherWidget()
    assert.equal(loadWeatherWidget(), first)
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].src, WEATHER_WIDGET_SRC)
    scripts[0].dispatchEvent(new Event('error'))
    await assert.rejects(first, /could not load/)
    assert.equal(scripts.length, 0)

    const invalid = loadWeatherWidget()
    scripts[0].dispatchEvent(new Event('load'))
    await assert.rejects(invalid, /did not register/)
    assert.equal(scripts.length, 0)

    const retry = loadWeatherWidget()
    registered = true
    scripts[0].dispatchEvent(new Event('load'))
    await retry
    await loadWeatherWidget()
    assert.equal(scripts.length, 1)
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})
