import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import compiler from 'vue-template-compiler'
import { loadComponent } from './helpers/load-component.mjs'

function fixture ({ playing = false, captureEnabled = false } = {}) {
  const listeners = new Map()
  const timers = new Map()
  const copied = []
  const emitted = []
  const domListeners = new Map()
  const elementListeners = new Map()
  let timerId = 0
  const player = {
    source: null,
    pausedState: !playing,
    sourceCalls: [],
    playCalls: 0,
    loadCalls: 0,
    disposed: false,
    on (name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set())
      listeners.get(name).add(fn)
    },
    off (name, fn) { listeners.get(name)?.delete(fn) },
    emit (name) { for (const fn of [...(listeners.get(name) || [])]) fn() },
    src (source) { this.source = source; this.sourceCalls.push(source) },
    currentSource () { return this.source },
    load () { this.loadCalls++ },
    paused () { return this.pausedState },
    pause () { this.pausedState = true; this.emit('pause') },
    play () {
      this.playCalls++
      this.pausedState = false
      this.emit('play')
      return Promise.resolve()
    },
    el () {
      return {
        addEventListener: (name, fn) => elementListeners.set(name, fn),
        removeEventListener: name => elementListeners.delete(name)
      }
    },
    dispose () { this.disposed = true; listeners.clear() }
  }
  const document = {
    fullscreenElement: null,
    addEventListener: (name, fn) => domListeners.set(name, fn),
    removeEventListener: name => domListeners.delete(name),
    exitFullscreen: async () => { document.fullscreenElement = null }
  }
  const wrapper = {
    classList: { toggle () {} },
    requestFullscreen: async () => { document.fullscreenElement = wrapper }
  }
  const options = loadComponent('src/components/VideoPlayer.vue', {
    videojs: () => player,
    copyText: async value => copied.push(value),
    window: { location: { protocol: 'https:', origin: 'https://huna.pt' } },
    document,
    navigator: { userAgent: 'desktop' },
    screen: {},
    setTimeout: fn => { const id = ++timerId; timers.set(id, fn); return id },
    clearTimeout: id => timers.delete(id)
  })
  const component = {
    ...options.data(),
    src: 'https://original.example/live.m3u8',
    type: 'application/x-mpegURL',
    anchor: 'original',
    displayedCamera: null,
    captureEnabled,
    options: {},
    $refs: { videoPlayer: {} },
    $el: { querySelector: () => wrapper },
    $route: { path: '/cams' },
    $emit: (...args) => emitted.push(args)
  }
  for (const [name, fn] of Object.entries(options.methods)) component[name] = fn.bind(component)
  for (const [name, fn] of Object.entries(options.computed)) {
    Object.defineProperty(component, name, { get: () => fn.call(component) })
  }
  options.mounted.call(component)
  if (playing) component.play()
  return {
    component,
    player,
    options,
    timers,
    listeners,
    copied,
    emitted,
    domListeners,
    elementListeners,
    document,
    expire () { for (const [id, fn] of [...timers]) { timers.delete(id); fn() } },
    destroy () { options.beforeDestroy.call(component) }
  }
}

test('exact supported Surfline host/path only; no fallback or lost query', () => {
  const { component: c } = fixture()
  const supported = 'https://cams.cdn-surfline.com/ireland/pt-covadovapor/playlist.m3u8?token=abc#live'
  assert.equal(c.toProxy(supported), 'https://proxy.huna.pt/proxy/surfline/ireland/pt-covadovapor/playlist.m3u8?token=abc#live')
  assert.equal(c.toProxy('http://cams.cdn-surfline.com/region/camera/123.ts?token=abc'), 'https://proxy.huna.pt/proxy/surfline/region/camera/123.ts?token=abc')
  assert.equal(c.toProxy('https://hls.cdn-surfline.com/ireland/pt-covadovapor/playlist.m3u8?version=2'), 'https://proxy.huna.pt/proxy/surfline/ireland/pt-covadovapor/playlist.m3u8?version=2')
  for (const url of [
    'https://cams.cdn-surfline.com/cdn-int/camera/chunklist.m3u8?token=abc',
    'https://cams.cdn-surfline.com/region/camera/extra/playlist.m3u8',
    'https://cams.cdn-surfline.com/region/camera/extra/123.ts',
    'https://cams.cdn-surfline.com.evil.test/region/camera/playlist.m3u8',
    'https://www.surfline.com/region/camera/playlist.m3u8',
    'https://cams.cdn-surfline.com:8443/region/camera/playlist.m3u8',
    'https://user:password@cams.cdn-surfline.com/region/camera/playlist.m3u8',
    'https://proxy.huna.pt/proxy/surfline/region/camera/playlist.m3u8?token=abc',
    'https://other.example/surfline/region/camera/playlist.m3u8',
    'not a URL', '', null
  ]) assert.equal(c.toProxy(url), url)
})

test('paused and playing switches preserve intent and commit only on readiness', async () => {
  for (const playing of [false, true]) {
    const f = fixture({ playing })
    const c = f.component
    const operation = c.changeCameraSource('https://new.example/live', 'video/new')
    assert.equal(c.getPlaybackIntent(), playing)
    assert.equal(c.sourceChanging, true)
    assert.equal(c.proxiedSrc, c.src)
    f.player.emit('canplay')
    await operation
    assert.equal(c.sourceChanging, false)
    assert.equal(c.proxiedSrc, 'https://new.example/live')
    assert.equal(f.player.paused(), !playing)
    assert.equal(f.timers.size, 0)
    assert.equal(f.listeners.get('error').size, 0)
  }
})

test('load errors and timeouts rollback source/type and prior playback state', async () => {
  for (const playing of [false, true]) {
    for (const event of ['error', 'timeout']) {
      const f = fixture({ playing })
      const c = f.component
      const operation = c.changeCameraSource('https://broken.example/live', 'video/new', { play: !playing })
      const rejected = assert.rejects(operation, { code: event === 'error' ? 'SOURCE_LOAD_ERROR' : 'SOURCE_CHANGE_TIMEOUT' })
      if (event === 'error') f.player.emit('error')
      else f.expire()
      await rejected
      assert.equal(f.player.source.src, c.src)
      assert.equal(f.player.source.type, c.type)
      assert.equal(f.player.paused(), !playing)
      assert.equal(c.sourceChanging, false)
      assert.equal(f.timers.size, 0)
    }
  }
})

test('rapid changes cancel prior promises; stale events never restore obsolete sources', async () => {
  const f = fixture({ playing: true })
  const c = f.component
  const first = c.changeCameraSource('https://first.example/live', 'video/first')
  const oldReady = [...f.listeners.get('canplay')][0]
  const oldError = [...f.listeners.get('error')][0]
  const oldTimeout = [...f.timers.values()][0]
  const rejected = assert.rejects(first, { code: 'SOURCE_CHANGE_CANCELLED' })
  const second = c.changeCameraSource('https://second.example/live', 'video/second')
  await rejected
  oldError()
  oldReady()
  oldTimeout()
  assert.equal(f.player.source.src, 'https://second.example/live')
  assert.equal(c.sourceChanging, true)
  assert.equal(c.getPlaybackIntent(), true)
  f.player.emit('canplay')
  await second
  assert.equal(c.proxiedSrc, 'https://second.example/live')
  assert.equal(f.player.sourceCalls.length, 3)
})

test('synchronous load failure and rejected play clean up and restore prior source', async () => {
  for (const failure of ['load', 'play']) {
    const f = fixture({ playing: true })
    const c = f.component
    const original = f.player[failure].bind(f.player)
    let failed = false
    f.player[failure] = () => {
      if (failed) return original()
      failed = true
      if (failure === 'load') throw new Error('load failed')
      return Promise.reject(new Error('play failed'))
    }
    await assert.rejects(c.changeCameraSource('broken', 'video/new'), /failed/)
    assert.equal(f.player.source.src, c.src)
    assert.equal(f.player.paused(), false)
    assert.equal(c.sourceChanging, false)
    assert.equal(f.timers.size, 0)
    assert.equal(f.listeners.get('error').size, 0)
  }
})

test('rapid failed changes roll back to last successful source, not transient source', async () => {
  const f = fixture({ playing: true })
  const c = f.component
  const first = c.changeCameraSource('first', 'video/new')
  const firstRejected = assert.rejects(first, { code: 'SOURCE_CHANGE_CANCELLED' })
  const second = c.changeCameraSource('second', 'video/new')
  const secondRejected = assert.rejects(second, { code: 'SOURCE_LOAD_ERROR' })
  f.player.emit('error')
  await Promise.all([firstRejected, secondRejected])
  assert.equal(f.player.source.src, c.src)
  assert.equal(f.player.paused(), false)
})

test('manual pause/play changes pending intent and survives cancellation and restore', async () => {
  const f = fixture({ playing: true })
  const c = f.component
  const pending = c.changeCameraSource('next', c.type)
  c.pause()
  assert.equal(c.getPlaybackIntent(), false)
  await c.play()
  assert.equal(c.getPlaybackIntent(), true)
  c.pause()
  const snapshot = c.getPlaybackIntent()
  const rejected = assert.rejects(pending, { code: 'SOURCE_CHANGE_CANCELLED' })
  c.cancelSourceChange()
  await rejected
  const calls = f.player.sourceCalls.length
  await c.restoreSource(c.src, c.type, { play: snapshot })
  assert.equal(f.player.sourceCalls.length, calls, 'unchanged source must not reload')
  assert.equal(f.player.paused(), true)
  const change = c.changeCameraSource('another', c.type)
  c.play()
  f.player.emit('canplay')
  await change
  assert.equal(c.getPlaybackIntent(), true)
})

test('restore supersedes pending load without an obsolete rollback', async () => {
  const f = fixture()
  const c = f.component
  const pending = c.changeCameraSource('pending', c.type)
  const staleError = [...f.listeners.get('error')][0]
  const rejected = assert.rejects(pending, { code: 'SOURCE_CHANGE_CANCELLED' })
  const restore = c.restoreSource('restored', 'video/restore', { play: false })
  staleError()
  assert.equal(f.player.source.src, 'restored')
  f.player.emit('canplay')
  await Promise.all([rejected, restore])
  assert.equal(c.proxiedSrc, 'restored')
  assert.equal(f.player.paused(), true)
})

test('destroy cancels pending changes and cleans all timers and listeners without rollback', async () => {
  const f = fixture({ playing: true })
  const c = f.component
  const pending = c.changeCameraSource('pending', c.type)
  const rejected = assert.rejects(pending, { code: 'SOURCE_CHANGE_CANCELLED' })
  f.options.watch.src.call(c, 'debounced')
  const calls = f.player.sourceCalls.length
  f.destroy()
  await rejected
  assert.equal(f.player.sourceCalls.length, calls)
  assert.equal(f.player.disposed, true)
  assert.equal(f.timers.size, 0)
  assert.equal(f.listeners.size, 0)
  assert.equal(f.domListeners.size, 0)
  assert.equal(f.elementListeners.size, 0)
})

test('a late native play rejection after destruction is handled without touching the disposed player', async () => {
  const f = fixture()
  let reject
  f.player.play = () => new Promise((resolve, fail) => { reject = fail })
  const play = f.component.play()
  f.destroy()
  f.player.paused = () => { throw new Error('disposed player accessed') }
  reject(new Error('play interrupted by destruction'))
  await play
})

test('rapid exit/re-entry restoration establishes the original identity before another cancellation or failed step', async () => {
  const f = fixture({ playing: true })
  const c = f.component
  const switched = c.changeCameraSource('switched', c.type)
  f.player.emit('canplay')
  await switched
  const restoring = c.restoreSource(c.src, c.type, { play: true })
  const cancelled = assert.rejects(restoring, { code: 'SOURCE_CHANGE_CANCELLED' })
  c.cancelSourceChange()
  await cancelled
  assert.equal(f.player.source.src, c.src)
  await c.restoreSource(c.src, c.type, { play: true })
  const failed = c.changeCameraSource('next-session-broken', c.type)
  const rejected = assert.rejects(failed, { code: 'SOURCE_LOAD_ERROR' })
  f.player.emit('error')
  await rejected
  assert.equal(f.player.source.src, c.src)
  assert.equal(c.proxiedSrc, c.src)
  assert.equal(f.player.paused(), false)
})

test('fullscreen entry and exit do not reset source or force playback', async () => {
  for (const playing of [false, true]) {
    const f = fixture({ playing })
    const calls = f.player.sourceCalls.length
    const plays = f.player.playCalls
    await f.component.toggleFullscreen()
    await f.component.toggleFullscreen()
    assert.equal(f.player.sourceCalls.length, calls)
    assert.equal(f.player.playCalls, plays)
    assert.equal(f.player.paused(), !playing)
  }
})

test('native fullscreen exit events (including Escape) emit the same restoration event as the button', async () => {
  for (const external of [false, true]) {
    const f = fixture({ playing: true })
    await f.component.toggleFullscreen()
    f.component._onFs()
    assert.equal(f.component.isFullscreen, true)
    if (external) await f.document.exitFullscreen()
    else await f.component.toggleFullscreen()
    f.component._onFs()
    assert.equal(f.component.isFullscreen, false)
    assert.deepEqual(f.emitted.map(event => event[1].isFullscreen), [true, false])
    assert.equal(f.player.paused(), false)
  }
})

test('displayed identity drives copy/share; capability and loading gate capture', async () => {
  const f = fixture()
  const c = f.component
  assert.equal(f.options.props.captureEnabled.default, false)
  assert.equal(c.displayedAnchor, 'original')
  c.displayedCamera = { anchor: 'displayed', title: 'Displayed camera' }
  assert.equal(c.displayedAnchor, 'displayed')
  assert.equal(c.displayedTitle, 'Displayed camera')
  await c.copyURL('obsolete')
  assert.deepEqual(f.copied, ['https://huna.pt/cams#displayed'])
  c.requestCapture()
  assert.equal(await c.captureFrame(), null)
  assert.equal(f.emitted.length, 0)
  c.captureEnabled = true
  c.requestCapture()
  assert.deepEqual(f.emitted, [['capture-request']])
  const pending = c.changeCameraSource('next', c.type)
  await c.copyURL()
  c.requestCapture()
  assert.equal(await c.captureFrame(), null)
  assert.equal(f.copied.length, 1)
  assert.equal(f.emitted.length, 1)
  f.player.emit('canplay')
  await pending

  const sfc = compiler.parseComponent(readFileSync(new URL('../src/components/VideoPlayer.vue', import.meta.url), 'utf8'))
  const parsed = compiler.compile(sfc.template.content)
  assert.equal(parsed.errors.length, 0)
  function nodes (node) { return [node, ...(node.children || []).flatMap(nodes)] }
  const all = nodes(parsed.ast)
  const sharing = all.find(node => node.tag === 'socialSharing')
  assert.equal(sharing.if, '!sourceChanging')
  assert.equal(sharing.attrsMap[':anchor'], 'displayedAnchor')
  assert.equal(sharing.attrsMap[':title'], 'displayedTitle')
  const capture = all.find(node => node.attrsMap?.icon === 'camera_alt')
  assert.equal(capture.if, 'captureEnabled && (isFullscreen || $q.platform.is.mobile)')
  assert.equal(capture.attrsMap[':disable'], 'sourceChanging')
  const copy = all.find(node => node.attrsMap?.label === 'Copiar link')
  assert.equal(copy.attrsMap[':disable'], 'sourceChanging')
})
