import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import compiler from 'vue-template-compiler'
import { loadComponent } from './helpers/load-component.mjs'

function fixture ({ playing = false, captureEnabled = false, fullscreenControlsAutoHide = false, wrapperFullscreen = true, nativeFullscreen = false, mobileAgent = false, screenOrientation = null } = {}) {
  const listeners = new Map()
  const timers = new Map()
  const copied = []
  const emitted = []
  const domListeners = new Map()
  const elementListeners = new Map()
  const wrapperListeners = new Map()
  const windowListeners = new Map()
  const delays = new Map()
  let timerId = 0
  const player = {
    source: null,
    pausedState: !playing,
    sourceCalls: [],
    playCalls: 0,
    loadCalls: 0,
    pauseCalls: 0,
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
    pause () { this.pauseCalls++; this.pausedState = true; this.emit('pause') },
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
    focus () {
      document.activeElement = wrapper
      wrapperListeners.get('focusin')?.()
    },
    addEventListener: (name, fn) => wrapperListeners.set(name, fn),
    removeEventListener: name => wrapperListeners.delete(name),
    contains: target => [wrapper, video, controls, button, dialog].includes(target),
    closest: () => null,
    classList: { toggle () {} },
    requestFullscreen: async () => { document.fullscreenElement = wrapper }
  }
  if (!wrapperFullscreen) delete wrapper.requestFullscreen
  const nativeListeners = new Map()
  const video = {
    closest: () => null,
    controls: false,
    webkitSupportsFullscreen: nativeFullscreen,
    webkitEnterFullscreen () { this.entered = true },
    addEventListener: (name, fn) => nativeListeners.set(name, fn),
    removeEventListener: name => nativeListeners.delete(name)
  }
  const button = { closest: () => controls }
  const dialog = { closest: () => dialog }
  const controls = { contains: target => target === button, closest: () => controls }
  const options = loadComponent('src/components/VideoPlayer.vue', {
    videojs: () => player,
    copyText: async value => copied.push(value),
    window: {
      location: { protocol: 'https:', origin: 'https://huna.pt' },
      addEventListener: (name, fn) => windowListeners.set(name, fn),
      removeEventListener: name => windowListeners.delete(name)
    },
    document,
    navigator: { userAgent: mobileAgent ? 'iPhone' : 'desktop' },
    screen: screenOrientation ? { orientation: screenOrientation } : {},
    setTimeout: (fn, delay) => { const id = ++timerId; timers.set(id, fn); delays.set(id, delay); return id },
    clearTimeout: id => timers.delete(id)
  })
  const component = {
    ...options.data(),
    src: 'https://original.example/live.m3u8',
    type: 'application/x-mpegURL',
    anchor: 'original',
    displayedCamera: null,
    captureEnabled,
    fullscreenControlsAutoHide,
    options: {},
    $refs: { videoPlayer: video, controls },
    $el: { querySelector: () => wrapper },
    $route: { path: '/cams' },
    $emit: (...args) => emitted.push(args),
    $nextTick: fn => Promise.resolve().then(fn)
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
    nativeListeners,
    wrapperListeners,
    windowListeners,
    wrapper,
    controls,
    button,
    dialog,
    delays,
    video,
    document,
    expire () { for (const [id, fn] of [...timers]) { timers.delete(id); fn() } },
    destroy () { options.beforeDestroy.call(component) }
  }
}

async function enterControls (f) {
  await f.component.toggleFullscreen()
  f.component._onFs()
}

function touch (f, name, { target = f.video, x = 50, y = 50, touches, cancelable = true } = {}) {
  const point = { identifier: 1, clientX: x, clientY: y }
  const event = { target, touches: touches || (name === 'touchend' || name === 'touchcancel' ? [] : [point]), changedTouches: [point], cancelable, preventDefault () { this.prevented = true } }
  f.wrapperListeners.get(name)(event)
  return event
}

test('opt-in wrapper entry schedules exactly 2000ms; visibility never changes media state', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true, playing: true })
  const c = f.component
  assert.equal(c.fullscreenControlsActive, false)
  assert.equal(f.timers.size, 0)
  const media = () => [f.player.sourceCalls.length, f.player.loadCalls, f.player.playCalls, f.player.pauseCalls]
  const before = media()
  await enterControls(f)
  assert.equal(c.fullscreenControlsVisible, true)
  assert.equal(f.delays.get(c._controlsHideTimer), 2000)
  f.expire()
  assert.equal(c.fullscreenControlsVisible, false)
  f.wrapperListeners.get('mousemove')({})
  assert.equal(c.fullscreenControlsVisible, true)
  const timer = c._controlsHideTimer
  f.wrapperListeners.get('mousemove')({})
  assert.notEqual(c._controlsHideTimer, timer)
  assert.equal(f.timers.has(timer), false)
  f.expire()
  assert.equal(c.fullscreenControlsVisible, false)
  assert.deepEqual(media(), before)
  f.destroy()
})

test('surface touch toggles once, refreshes delay, and ignores compatibility mouse events', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true })
  await enterControls(f)
  f.document.activeElement = f.button
  touch(f, 'touchstart')
  assert.equal(f.timers.size, 0)
  const end = touch(f, 'touchend')
  assert.equal(end.prevented, true)
  assert.equal(f.document.activeElement, f.wrapper, 'explicit surface gesture moves focus out of toolbar')
  assert.equal(f.component.fullscreenControlsVisible, false)
  for (const name of ['mousemove', 'mousedown']) f.wrapperListeners.get(name)({})
  assert.equal(f.component.fullscreenControlsVisible, false)
  assert.equal(f.wrapperListeners.has('click'), false, 'no click handler can toggle twice')
  touch(f, 'touchstart')
  touch(f, 'touchend')
  assert.equal(f.component.fullscreenControlsVisible, true)
  assert.equal(f.delays.get(f.component._controlsHideTimer), 2000)
  f.expire()
  assert.equal(f.component.fullscreenControlsVisible, false)
  f.wrapperListeners.get('mousemove')({ sourceCapabilities: { firesTouchEvents: true } })
  assert.equal(f.component.fullscreenControlsVisible, false)
  f.destroy()
})

test('drags, cancelled/multitouch gestures, toolbar and dialog taps never toggle', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true })
  await enterControls(f)
  touch(f, 'touchstart')
  touch(f, 'touchmove', { x: 80 })
  touch(f, 'touchend')
  assert.equal(f.component.fullscreenControlsVisible, true)
  touch(f, 'touchstart')
  touch(f, 'touchend', { x: 80 })
  assert.equal(f.component.fullscreenControlsVisible, true, 'reject displaced end without move event')
  touch(f, 'touchstart')
  touch(f, 'touchcancel')
  assert.equal(f.component.fullscreenControlsVisible, true)
  touch(f, 'touchstart', { touches: [{ identifier: 1 }, { identifier: 2 }] })
  touch(f, 'touchend')
  assert.equal(f.component.fullscreenControlsVisible, true)
  for (const target of [f.button, f.controls, f.dialog]) {
    touch(f, 'touchstart', { target })
    touch(f, 'touchend', { target })
    assert.equal(f.component.fullscreenControlsVisible, true)
  }
  f.destroy()
})

test('focus, held interactions and dialogs suspend hiding and resume with a fresh delay', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true })
  const c = f.component
  await enterControls(f)
  f.document.activeElement = f.button
  f.expire()
  assert.equal(c.fullscreenControlsVisible, true, 'timeout never blurs focused controls')
  f.wrapperListeners.get('focusin')()
  assert.equal(f.timers.size, 0)
  f.document.activeElement = f.wrapper
  f.wrapperListeners.get('focusout')()
  await Promise.resolve()
  assert.equal(f.delays.get(c._controlsHideTimer), 2000)
  f.wrapperListeners.get('mousedown')({})
  assert.equal(f.timers.size, 0)
  f.domListeners.get('mouseup')({})
  assert.equal(f.timers.size, 1)
  c.onSharingDialogActivity(true)
  assert.equal(f.timers.size, 0)
  c.onSharingDialogActivity(false)
  assert.equal(f.timers.size, 1)
  c.showDialog = true
  f.options.watch.showDialog.call(c)
  assert.equal(f.timers.size, 0)
  c.showDialog = false
  f.options.watch.showDialog.call(c)
  assert.equal(f.timers.size, 1)
  f.expire()
  assert.equal(c.fullscreenControlsVisible, false)
  f.wrapperListeners.get('keydown')({ key: 'Tab' })
  assert.equal(c.fullscreenControlsVisible, true)
  f.destroy()
})

test('async copying and its dialog protect controls until close', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true })
  await enterControls(f)
  const pending = f.component.copyURL()
  assert.equal(f.component.copyingLink, true)
  assert.equal(f.timers.size, 0)
  await pending
  assert.equal(f.component.showDialog, true)
  assert.equal(f.timers.size, 0)
  f.component.showDialog = false
  f.options.watch.showDialog.call(f.component)
  assert.equal(f.timers.size, 1)
  f.destroy()
})

test('toolbar touch retains restart and play/pause actions without a surface toggle', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true })
  await enterControls(f)
  const sources = f.player.sourceCalls.length
  const loads = f.player.loadCalls
  touch(f, 'touchstart', { target: f.button })
  touch(f, 'touchend', { target: f.button })
  f.component.restart()
  assert.equal(f.component.fullscreenControlsVisible, true)
  assert.equal(f.player.sourceCalls.length, sources + 1)
  assert.equal(f.player.loadCalls, loads + 1)
  assert.equal(f.player.currentSource().src, f.component.src)
  assert.equal(f.player.paused(), false)
  f.component.togglePlay()
  assert.equal(f.player.paused(), true)
  f.component.togglePlay()
  assert.equal(f.player.paused(), false)
  assert.equal(f.player.sourceCalls.length, sources + 1, 'play/pause do not reload')
  assert.equal(f.component.fullscreenControlsVisible, true)
  f.destroy()
})

test('exit, opt-out and destroy remove listeners/timers; re-entry and instances are independent', async () => {
  const first = fixture({ fullscreenControlsAutoHide: true })
  const second = fixture({ fullscreenControlsAutoHide: true })
  await enterControls(first)
  await enterControls(second)
  first.expire()
  assert.equal(first.component.fullscreenControlsVisible, false)
  assert.equal(second.component.fullscreenControlsVisible, true)
  await first.component.toggleFullscreen()
  first.component._onFs()
  assert.equal(first.component.fullscreenControlsVisible, true)
  assert.equal(first.wrapperListeners.size, 0)
  assert.equal(first.windowListeners.size, 0)
  assert.equal(first.domListeners.has('mouseup'), false)
  await enterControls(first)
  assert.equal(first.timers.size, 1)
  first.component.fullscreenControlsAutoHide = false
  first.options.watch.fullscreenControlsAutoHide.call(first.component)
  assert.equal(first.timers.size, 0)
  assert.equal(first.wrapperListeners.size, 0)
  assert.equal(first.component.fullscreenControlsVisible, true)
  first.component.fullscreenControlsAutoHide = true
  first.options.watch.fullscreenControlsAutoHide.call(first.component)
  first.wrapperListeners.get('focusout')()
  first.destroy()
  await Promise.resolve()
  second.destroy()
  for (const f of [first, second]) {
    assert.equal(f.timers.size, 0)
    assert.equal(f.wrapperListeners.size, 0)
    assert.equal(f.windowListeners.size, 0)
    assert.equal(f.domListeners.size, 0)
  }
})

test('default-off fullscreen and opted-in native fullscreen leave visibility and input unchanged', async () => {
  const ordinary = fixture()
  assert.equal(ordinary.options.props.fullscreenControlsAutoHide.default, false)
  await enterControls(ordinary)
  assert.equal(ordinary.wrapperListeners.size, 0)
  assert.equal(ordinary.timers.size, 0)
  const native = fixture({ fullscreenControlsAutoHide: true, wrapperFullscreen: false, nativeFullscreen: true })
  await native.component.toggleFullscreen()
  assert.equal(native.video.controls, true)
  assert.equal(native.component.fullscreenControlsActive, false)
  assert.equal(native.wrapperListeners.size, 0)
  assert.equal(native.timers.size, 0)
  ordinary.destroy()
  native.destroy()
})

test('compiled toolbar hides without unmounting and fullscreen surface offers keyboard recovery', () => {
  const source = readFileSync(new URL('../src/components/VideoPlayer.vue', import.meta.url), 'utf8')
  const parsed = compiler.compile(compiler.parseComponent(source).template.content)
  assert.deepEqual(parsed.errors, [])
  const walk = node => [node, ...(node.children || []).flatMap(walk)]
  const nodes = walk(parsed.ast)
  const toolbar = nodes.find(node => node.attrsMap?.ref === 'controls')
  assert.equal(toolbar.if, undefined)
  assert.equal(toolbar.attrsMap['v-show'], undefined)
  assert.match(toolbar.attrsMap[':aria-hidden'], /fullscreenControlsActive && !fullscreenControlsVisible/)
  assert.equal(nodes.find(node => node.attrsMap?.class === 'main-video-player').attrsMap[':tabindex'], 'fullscreenControlsActive ? 0 : null')
  assert.equal(nodes.find(node => node.tag === 'q-dialog').parent.attrsMap.class, 'main-video-player', 'copy dialog belongs to fullscreen portal target')
  assert.match(source, /\.main-video-player \.custom-controls\.fullscreen-controls-hidden\s+visibility: hidden\s+pointer-events: none/)
})

test('Caparica uses Quasar wrapper ownership for dialogs and clears it after external exit', async () => {
  const f = fixture({ fullscreenControlsAutoHide: true })
  let requests = 0
  const fullscreen = {
    activeEl: null,
    async request (element) {
      requests++
      await element.requestFullscreen()
      this.activeEl = element
    }
  }
  f.component.$q = { fullscreen }
  await enterControls(f)
  assert.equal(requests, 1)
  assert.equal(fullscreen.activeEl, f.wrapper)
  await f.document.exitFullscreen()
  f.component._onFs()
  assert.equal(fullscreen.activeEl, null)
  f.component.fullscreenControlsAutoHide = false
  await enterControls(f)
  assert.equal(requests, 1, 'default-off wrapper request remains unchanged')
  fullscreen.activeEl = f.wrapper
  f.destroy()
  assert.equal(fullscreen.activeEl, null, 'destruction releases owned portal target')
})

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

test('fullscreen capability uses native iPhone video controls or stays inline when unavailable', async () => {
  const native = fixture({ wrapperFullscreen: false, nativeFullscreen: true, playing: true })
  assert.equal(native.component.fullscreenMode, 'native')
  await native.component.toggleFullscreen()
  assert.equal(native.video.entered, true)
  assert.equal(native.video.controls, true)
  assert.deepEqual(native.emitted, [], 'native fullscreen does not expose HTML camera navigation')
  native.nativeListeners.get('webkitendfullscreen')()
  assert.equal(native.video.controls, false)
  assert.equal(native.player.paused(), false)
  native.destroy()
  assert.equal(native.nativeListeners.size, 0)

  const inline = fixture({ wrapperFullscreen: false })
  assert.equal(inline.component.fullscreenMode, 'none')
  await inline.component.toggleFullscreen()
  assert.equal(inline.video.entered, undefined)
  inline.destroy()
})

test('native fullscreen rejection restores inline controls; denied user playback has honest feedback', async () => {
  const f = fixture({ wrapperFullscreen: false, nativeFullscreen: true })
  f.video.webkitEnterFullscreen = () => { throw new Error('denied') }
  const originalWarn = console.warn
  console.warn = () => {}
  try {
    await f.component.toggleFullscreen()
    assert.equal(f.video.controls, false)
    assert.match(f.component.fullscreenError, /Não foi possível abrir/)
    f.player.play = () => Promise.reject(new Error('gesture denied'))
    await f.component.play(true)
    assert.match(f.component.playbackError, /Não foi possível reproduzir/)
    f.player.play = () => Promise.resolve()
    await f.component.play(true)
    assert.equal(f.component.playbackError, '')
  } finally {
    console.warn = originalWarn
    f.destroy()
  }
})

test('rejected orientation lock does not interrupt fullscreen exit and cleanup', async () => {
  let unlocked = 0
  const f = fixture({ mobileAgent: true, screenOrientation: { lock: () => Promise.reject(new Error('denied')), unlock: () => { unlocked++ } } })
  await f.component.toggleFullscreen()
  f.component._onFs()
  await Promise.resolve()
  await f.component.toggleFullscreen()
  f.component._onFs()
  assert.equal(unlocked, 1)
  assert.deepEqual(f.emitted.map(event => event[1].isFullscreen), [true, false])
  f.destroy()
  assert.equal(f.domListeners.size, 0)
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
  assert.equal(capture.if, 'captureEnabled')
  assert.equal(capture.attrsMap[':disable'], 'sourceChanging')
  assert.equal(capture.attrsMap['aria-label'], 'Capturar imagem')
  const copy = all.find(node => node.attrsMap?.label === 'Copiar link')
  assert.equal(copy.attrsMap[':disable'], 'sourceChanging')
})
