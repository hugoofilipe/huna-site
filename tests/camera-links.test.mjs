import assert from 'node:assert/strict'
import test from 'node:test'
import { loadCameraLinks } from '../src/utils/camera-links.mjs'

const url = 'https://api.huna.pt/urllinks.json'
const fixtureB = [{ anchor: 'camera', title: 'Fixture B', src: 'https://fixture.invalid/b.m3u8', type: 'application/x-mpegURL' }]
const response = data => ({ ok: true, json: async () => data })

test('loads fixture B at the unchanged URL with scoped no-store and no custom CORS headers', async () => {
  const result = await loadCameraLinks(url, {
    fetchImpl: async (requested, options) => {
      assert.equal(requested, url)
      assert.equal(options.cache, 'no-store')
      assert.deepEqual(Object.keys(options).sort(), ['cache', 'signal'])
      assert.equal(options.signal.aborted, false)
      return response(fixtureB)
    }
  })
  assert.deepEqual(result, fixtureB)
})

test('HTTP, network and invalid JSON errors reject instead of returning fallback data', async () => {
  for (const fetchImpl of [
    async () => ({ ok: false, status: 503, json: () => assert.fail('HTTP error must not parse JSON') }),
    async () => { throw new Error('Network unavailable') },
    async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON') } })
  ]) await assert.rejects(loadCameraLinks(url, { fetchImpl }))
})

test('rejects malformed camera lists and duplicate identities before state replacement', async () => {
  for (const data of [null, {}, [], [null], [{}], [{ ...fixtureB[0], src: '' }], [{ ...fixtureB[0], title: 42 }],
    [{ ...fixtureB[0], type: 'unknown' }], [{ ...fixtureB[0], anchor: ' ' }], [...fixtureB, ...fixtureB]]) {
    await assert.rejects(loadCameraLinks(url, { fetchImpl: async () => response(data) }), /Invalid camera list/)
  }
  const forecast = [{ anchor: 'tide', title: 'Tide', type: 'previsoes', src: '' }]
  assert.deepEqual(await loadCameraLinks(url, { fetchImpl: async () => response(forecast) }), forecast)
})

test('bounds both the request and response body, even if the transport ignores abort', async () => {
  for (const pendingBody of [false, true]) {
    let signal
    await assert.rejects(loadCameraLinks(url, {
      timeoutMs: 5,
      fetchImpl: async (url, options) => {
        signal = options.signal
        if (pendingBody) return { ok: true, json: () => new Promise(() => {}) }
        return new Promise(() => {})
      }
    }), /timed out/)
    assert.equal(signal.aborted, true)
  }
})

test('caller cancellation settles promptly and aborts the underlying request', async () => {
  const controller = new AbortController()
  let signal
  const pending = loadCameraLinks(url, {
    signal: controller.signal,
    fetchImpl: (url, options) => {
      signal = options.signal
      return new Promise(() => {})
    }
  })
  controller.abort()
  await assert.rejects(pending, /cancelled/)
  assert.equal(signal.aborted, true)
  await assert.rejects(loadCameraLinks(url, { signal: controller.signal, fetchImpl: async () => response(fixtureB) }), /cancelled/)
})
