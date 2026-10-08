import assert from 'node:assert/strict'
import test from 'node:test'
import { findCamera } from '../src/utils/camera-navigation.mjs'
import { isCaparicaPath, cameraAnchorFromHash } from '../src/utils/camera-route.mjs'
import { loadComponent } from './helpers/load-component.mjs'

function fixture ({ queued = false, types = [] } = {}) {
  const cameras = [0, 1, 2, 3, 4].slice(0, Math.max(3, types.length)).map(index => ({
    anchor: 'camera-' + index, title: 'Camera ' + index, src: 'feed-' + index, type: types[index] || 'application/x-mpegURL'
  }))
  const timers = new Map()
  const timerDelays = new Map()
  const frames = new Map()
  const ticks = []
  const watchers = new Set()
  const observers = []
  const requests = []
  const scrolls = []
  const downloads = []
  const rects = cameras.map(() => ({ top: 100, bottom: 350 }))
  const document = {
    documentElement: { scrollHeight: 1200 },
    getElementById: anchor => ({ getBoundingClientRect: () => rects[cameras.findIndex(camera => camera.anchor === anchor)] }),
    getElementsByClassName: () => [{ classList: { toggle () {} } }],
    createElement: () => ({ click () { downloads.push(this.download) } })
  }
  const window = {
    innerHeight: 500, pageYOffset: 20, scrollTo: value => scrolls.push(value), removeEventListener () {},
    requestAnimationFrame: fn => { const id = {}; frames.set(id, fn); return id },
    cancelAnimationFrame: id => frames.delete(id)
  }
  class ResizeObserver {
    constructor (callback) { this.callback = callback; this.observed = []; this.disconnected = false; observers.push(this) }
    observe (element) { this.observed.push(element) }
    disconnect () { this.disconnected = true }
  }
  const options = loadComponent('src/pages/Cam4.vue', {
    WebcamItem: {}, WebcamSidebar: {}, axios: { get: () => new Promise((resolve, reject) => requests.push({ resolve, reject })) },
    findCamera, loadWeatherWidget: async () => {}, copyText: async () => {}, isCaparicaPath, cameraAnchorFromHash,
    document, window, ResizeObserver, navigator: {}, URL: { createObjectURL: () => 'blob:frame', revokeObjectURL () {} },
    setTimeout: (fn, delay) => { const id = {}; timers.set(id, fn); timerDelays.set(id, delay); return id }, clearTimeout: id => timers.delete(id)
  })
  const videos = cameras.map(camera => ({
    source: camera.src, intent: false, playCalls: 0, pauseCalls: 0, cancelCalls: 0, restores: [],
    play () { this.intent = true; this.playCalls++ },
    pause () { this.intent = false; this.pauseCalls++ },
    getPlaybackIntent () { return this.intent },
    cancelSourceChange () { this.cancelCalls++ },
    restoreSource (src, type, options) { this.source = src; this.intent = options.play; this.restores.push({ src, type, play: options.play }); return Promise.resolve() },
    changeCameraSource (src) { this.source = src; return Promise.resolve() }
  }))
  const weather = {}
  const page = {
    ...options.data(), webcams: cameras, cameraLayout: { clearance: 72, height: 72 },
    $route: { path: '/caparica', hash: '' }, $el: { querySelector: selector => selector === '.weather-widget' ? weather : null },
    $refs: { webcamItems: videos.map((video, index) => ({ $refs: cameras[index].type === 'previsoes' ? {} : { video } })) },
    $nextTick: fn => queued ? ticks.push(fn) : fn(),
    $watch (getter, callback) { const watcher = { getter, callback }; watchers.add(watcher); return () => watchers.delete(watcher) }
  }
  for (const [name, method] of Object.entries(options.methods)) page[name] = method.bind(page)
  const flushTicks = () => { while (ticks.length) ticks.shift()() }
  const flushFrames = () => { const pending = [...frames.entries()]; frames.clear(); for (const [, fn] of pending) fn() }
  const setHeaderHeight = height => { page.cameraLayout.height = height; for (const watcher of [...watchers]) watcher.callback() }
  const navigate = (path, hash) => {
    const from = page.$route
    page.$route = { path, hash }
    options.watch.$route.call(page, page.$route, from)
  }
  const loading = hash => {
    page.webcams = []
    page.$route = { path: '/caparica', hash }
    options.created.call(page)
    return page.getLinks()
  }
  const settle = () => new Promise(resolve => setImmediate(resolve))
  return {
    page, videos, cameras, timers, timerDelays, rects, scrolls, downloads, options, window, frames, ticks, watchers, observers, requests,
    flushTicks, flushFrames, setHeaderHeight, navigate, loading, settle
  }
}

function realVideo (page) {
  const listeners = new Map()
  const player = {
    source: {}, sourceCalls: 0, pausedState: true,
    src (source) { this.source = source; this.sourceCalls++ }, currentSource () { return this.source }, load () {},
    paused () { return this.pausedState }, pause () { this.pausedState = true }, play () { this.pausedState = false; return Promise.resolve() },
    on (name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn) },
    off (name, fn) { listeners.get(name)?.delete(fn) },
    emit (name) { for (const fn of [...(listeners.get(name) || [])]) fn() }
  }
  const options = loadComponent('src/components/VideoPlayer.vue', { window: { location: { protocol: 'https:' } } })
  const video = { ...options.data(), player, type: page.webcams[0].type, src: page.webcams[0].src, anchor: page.webcams[0].anchor }
  for (const [name, method] of Object.entries(options.methods)) video[name] = method.bind(video)
  for (const [name, method] of Object.entries(options.computed)) Object.defineProperty(video, name, { get: () => method.call(video) })
  Object.defineProperty(video, 'displayedCamera', { get: () => page.displayedCamera(0) })
  video.setPlayerSrc(video.src)
  page.$refs.webcamItems[0].$refs.video = video
  return { video, player }
}

test('sidebar selects adjacent or paused target and suppresses intermediate smooth-scroll selection', () => {
  const { page, videos, scrolls } = fixture()
  page.selectCamera(0)
  page.goToCamera('camera-1')
  assert.equal(page.activeCameraIndex, 1)
  assert.equal(videos[0].intent, false)
  assert.equal(videos[1].intent, true)
  assert.equal(videos[2].intent, false)
  assert.equal(scrolls[0].top, 48)
  page.scrollHandler()
  assert.equal(page.activeCameraIndex, 1)
  videos[1].pause()
  page.goToCamera('camera-1')
  assert.equal(videos[1].intent, true)
  page.cancelNavigation()
  videos[1].pause()
  const plays = videos[1].playCalls
  page.scrollHandler()
  assert.equal(videos[1].playCalls, plays)
  assert.equal(videos[1].intent, false, 'passive scroll respects manual pause')
})

test('selection guard ends on user scrolling, settling, or destruction', () => {
  const { page, videos, options, timers } = fixture()
  page.goToCamera('camera-1')
  page.onNavigationInput({ type: 'keydown', key: 'Escape' })
  assert.equal(page.navigationTarget, 1)
  page.onNavigationInput({ type: 'wheel' })
  assert.equal(page.navigationTarget, -1)
  page.goToCamera('camera-2')
  page.scrollHandler()
  for (const fn of timers.values()) fn()
  assert.equal(page.navigationTarget, -1)
  page.goToCamera('camera-1')
  options.beforeDestroy.call(page)
  const plays = videos[0].playCalls
  page.goToCamera('camera-0')
  assert.equal(videos[0].playCalls, plays)
  assert.equal(timers.size, 0)
})

test('unrelated scrollend does not release explicit navigation before reaching its destination', () => {
  const { page, window, rects } = fixture()
  page.goToCamera('camera-1')
  page.onNavigationEnd()
  assert.equal(page.navigationTarget, 1)
  window.pageYOffset = 48
  rects[1].top = 72
  page.onNavigationEnd()
  assert.equal(page.navigationTarget, -1)
})

test('fullscreen enter/exit keeps play or pause intent and restores switched identity', async () => {
  for (const playing of [true, false]) {
    for (const switched of [true, false]) {
      const { page, videos } = fixture()
      videos[0].intent = playing
      page.onFullscreenChange({ index: 0, isFullscreen: true })
      assert.equal(videos[0].intent, playing)
      if (switched) {
        page.fsQueue.push(1)
        await page.processFullscreenQueue()
        assert.equal(page.displayedCamera(0).anchor, 'camera-1')
      }
      page.onFullscreenChange({ index: 0, isFullscreen: false })
      assert.equal(videos[0].source, 'feed-0')
      assert.equal(videos[0].intent, playing)
      assert.equal(page.displayedCamera(0).anchor, 'camera-0')
      assert.ok(videos[0].cancelCalls >= 2)
    }
  }
})

test('rapid fullscreen steps are serialized and identity commits only after success', async () => {
  const { page, videos } = fixture()
  const pending = []
  videos[0].changeCameraSource = src => new Promise(resolve => pending.push(() => { videos[0].source = src; resolve() }))
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsQueue.push(1, 1, -1)
  const work = page.processFullscreenQueue()
  assert.equal(page.fsCameraIndex, 0)
  pending.shift()()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(page.fsCameraIndex, 1)
  pending.shift()()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(page.fsCameraIndex, 2)
  pending.shift()()
  await work
  assert.equal(page.fsCameraIndex, 1)
  assert.equal(page.displayedCamera(0).src, videos[0].source)
})

test('errors and timeouts keep committed identity and discard queued steps', async () => {
  for (const code of ['SOURCE_LOAD_ERROR', 'SOURCE_CHANGE_TIMEOUT', 'SOURCE_CHANGE_CANCELLED']) {
    const { page, videos } = fixture()
    videos[0].changeCameraSource = async () => { throw Object.assign(new Error(code), { code }) }
    page.onFullscreenChange({ index: 0, isFullscreen: true })
    page.fsQueue.push(1, 1)
    await page.processFullscreenQueue()
    assert.equal(page.fsCameraIndex, 0)
    assert.equal(page.displayedCamera(0).src, videos[0].source)
    assert.equal(page.fsQueue.length, 0)
    assert.equal(!!page.cameraSwitchError, code !== 'SOURCE_CHANGE_CANCELLED')
  }
})

test('exit/re-entry and destruction invalidate stale source completions without clearing a new session', async () => {
  const { page, videos, options } = fixture()
  const pending = []
  videos[0].changeCameraSource = () => new Promise(resolve => pending.push(resolve))
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsQueue.push(1)
  const old = page.processFullscreenQueue()
  page.onFullscreenChange({ index: 0, isFullscreen: false })
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsQueue.push(1)
  const newer = page.processFullscreenQueue()
  const session = page.fsSession
  pending.shift()()
  await old
  assert.equal(page.fsCameraIndex, 0)
  assert.equal(page.processingFullscreenSession, session)
  options.beforeDestroy.call(page)
  pending.shift()()
  await newer
  assert.equal(page.fsCameraIndex, -1)
  assert.equal(page.cameraSwitchError, '')
})

test('capture download keeps the frame identity even if navigation changes while encoding', async () => {
  const { page, videos, downloads } = fixture()
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsCameraIndex = 1
  let resolve
  videos[0].captureFrame = () => new Promise(done => { resolve = done })
  const capture = page.captureImage(0)
  page.fsCameraIndex = 2
  resolve({ type: 'image/png' })
  await capture
  assert.deepEqual(downloads, ['camera-1.png'])
})

test('actual page/player roundtrip keeps source, identity, and play/pause aligned after switch failure and exit', async () => {
  for (const playing of [true, false]) {
    const { page } = fixture()
    const { video, player } = realVideo(page)
    if (playing) await video.play()
    page.onFullscreenChange({ index: 0, isFullscreen: true })
    page.fsQueue.push(1)
    const successful = page.processFullscreenQueue()
    player.emit('canplay')
    await successful
    assert.equal(video.displayedAnchor, 'camera-1')
    page.fsQueue.push(1)
    const failed = page.processFullscreenQueue()
    player.emit('error')
    await failed
    assert.equal(player.currentSource().src, 'feed-1')
    assert.equal(video.displayedAnchor, 'camera-1')
    page.onFullscreenChange({ index: 0, isFullscreen: false })
    player.emit('canplay')
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(player.currentSource().src, 'feed-0')
    assert.equal(video.displayedAnchor, 'camera-0')
    assert.equal(player.paused(), !playing)
  }
})

test('actual player exit/re-entry cancellation cannot roll back into the old fullscreen session', async () => {
  const { page } = fixture()
  const { video, player } = realVideo(page)
  await video.play()
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsQueue.push(1)
  const switched = page.processFullscreenQueue()
  player.emit('canplay')
  await switched
  page.onFullscreenChange({ index: 0, isFullscreen: false })
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsQueue.push(1)
  const newer = page.processFullscreenQueue()
  player.emit('error')
  await newer
  assert.equal(page.fsCameraIndex, 0)
  assert.equal(player.currentSource().src, 'feed-0')
  assert.equal(video.displayedAnchor, 'camera-0')
  page.onFullscreenChange({ index: 0, isFullscreen: false })
})

test('page destruction cancels the actual pending player without reloading an obsolete source', async () => {
  const { page, options } = fixture()
  const { player } = realVideo(page)
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  page.fsQueue.push(1)
  const pending = page.processFullscreenQueue()
  const calls = player.sourceCalls
  options.beforeDestroy.call(page)
  await pending
  assert.equal(player.sourceCalls, calls)
  assert.equal(page.fsCameraIndex, -1)
  assert.equal(page.cameraSwitchError, '')
})

const HLS = 'application/x-mpegURL'
const plain = value => JSON.parse(JSON.stringify(value))

async function deepLink (hash, setup = {}) {
  const context = fixture({ queued: true, ...setup })
  const load = context.loading(hash)
  return { ...context, load }
}

test('deep link waits for delayed camera data, then scrolls with the header offset, selects and plays once', async () => {
  const { page, videos, cameras, scrolls, requests, load, flushTicks, settle } = await deepLink('#camera-1')
  flushTicks()
  assert.equal(scrolls.length, 0)
  assert.equal(page.webcams.length, 0)
  requests[0].resolve({ data: cameras })
  await load
  assert.equal(scrolls.length, 0, 'navigation waits for the render tick')
  flushTicks()
  await settle()
  flushTicks()
  assert.deepEqual(plain(scrolls), [{ top: 48, behavior: 'smooth' }])
  assert.equal(page.activeCameraIndex, 1)
  assert.equal(videos[1].playCalls, 1)
  assert.equal(videos[1].intent, true)
  assert.equal(videos[0].intent, false)
  assert.equal(videos[2].intent, false)
  assert.equal(page.pendingDeepLink, null)
})

test('already loaded cameras are navigated by a hash change without reloading', () => {
  const { page, scrolls, videos, navigate, flushTicks } = fixture({ queued: true })
  page.webcamsLoaded = true
  navigate('/caparica', '#camera-2')
  flushTicks()
  assert.deepEqual(plain(scrolls), [{ top: 48, behavior: 'smooth' }])
  assert.equal(page.activeCameraIndex, 2)
  assert.equal(videos[2].playCalls, 1)
})

test('YouTube targets play and forecast targets are selected without playback', () => {
  const { page, scrolls, videos, navigate, flushTicks } = fixture({ queued: true, types: [HLS, 'video/youtube', 'previsoes'] })
  page.webcamsLoaded = true
  videos[0].intent = true
  navigate('/caparica', '#camera-1')
  flushTicks()
  assert.equal(videos[1].playCalls, 1)
  assert.equal(videos[0].intent, false)
  navigate('/caparica', '#camera-2')
  flushTicks()
  assert.equal(page.activeCameraIndex, 2)
  assert.equal(scrolls.length, 2)
  assert.equal(videos[2].playCalls, 0)
  assert.equal(videos[1].intent, false, 'other cameras are paused')
})

test('encoded hashes decode once; malformed, empty and unknown hashes do nothing', async () => {
  const encoded = fixture({ queued: true })
  encoded.page.webcamsLoaded = true
  encoded.cameras[1].anchor = 'camera one'
  encoded.navigate('/caparica', '#camera%20one')
  encoded.flushTicks()
  assert.equal(encoded.page.activeCameraIndex, 1)
  for (const hash of ['#%E0%A4%A', '', '#', '#nope', '#camera%252D1']) {
    const { page, scrolls, videos, navigate, flushTicks, ticks, frames } = fixture({ queued: true })
    page.webcamsLoaded = true
    navigate('/caparica', hash)
    flushTicks()
    assert.equal(scrolls.length, 0, hash)
    assert.equal(page.activeCameraIndex, -1, hash)
    assert.ok(videos.every(video => video.playCalls === 0 && video.pauseCalls === 0), hash)
    assert.equal(ticks.length + frames.size, 0)
    assert.equal(page.pendingDeepLink, null)
  }
})

test('an empty or unknown hash invalidates an older pending request', async () => {
  for (const hash of ['', '#nope', '#%E0%A4%A']) {
    const { page, cameras, scrolls, requests, load, navigate, flushTicks, settle } = await deepLink('#camera-1')
    navigate('/caparica', hash)
    requests[0].resolve({ data: cameras })
    await load
    flushTicks()
    await settle()
    flushTicks()
    assert.equal(scrolls.length, 0, hash)
    assert.equal(page.activeCameraIndex, -1, hash)
  }
})

test('DOM readiness is awaited with guarded next-frame retries and no duplicate playback', async () => {
  const { page, videos, scrolls, cameras, requests, load, flushTicks, flushFrames, frames } = await deepLink('#camera-1')
  const refs = page.$refs.webcamItems
  page.$refs.webcamItems = undefined
  requests[0].resolve({ data: cameras })
  await load
  flushTicks()
  assert.equal(frames.size, 1)
  assert.equal(videos[1].playCalls, 0)
  flushFrames()
  assert.equal(frames.size, 1)
  page.$refs.webcamItems = refs
  flushFrames()
  flushTicks()
  assert.equal(frames.size, 0)
  assert.equal(videos[1].playCalls, 1)
  assert.equal(scrolls.length, 1)
})

test('readiness retries are bounded', async () => {
  const { page, scrolls, cameras, requests, load, flushTicks, flushFrames, frames } = await deepLink('#camera-1')
  page.$refs.webcamItems = undefined
  requests[0].resolve({ data: cameras })
  await load
  flushTicks()
  for (let attempt = 0; attempt < 20 && frames.size; attempt++) flushFrames()
  flushTicks()
  assert.equal(frames.size, 0)
  assert.equal(page.activeCameraIndex, 1)
  assert.equal(scrolls.length, 1)
})

test('latest request wins, including path changes with the same hash', async () => {
  const { page, videos, scrolls, navigate, flushTicks } = fixture({ queued: true })
  page.webcamsLoaded = true
  navigate('/cam', '#camera-1')
  navigate('/caparica', '#camera-1')
  flushTicks()
  assert.equal(scrolls.length, 1)
  assert.equal(videos[1].playCalls, 1)
  navigate('/caparica', '#camera-2')
  navigate('/caparica', '#camera-0')
  flushTicks()
  assert.equal(page.activeCameraIndex, 0)
  assert.equal(scrolls.length, 2)
  assert.equal(videos[2].playCalls, 0)
})

test('a superseded request for the same camera cannot scroll or play twice', () => {
  const { page, videos, scrolls, navigate, ticks, flushTicks } = fixture({ queued: true })
  page.webcamsLoaded = true
  navigate('/cam', '#camera-1')
  ticks.shift()()
  navigate('/caparica', '#camera-1')
  flushTicks()
  assert.equal(videos[1].playCalls, 2, 'each accepted request selects once')
  assert.equal(scrolls.length, 1, 'only the latest navigation scrolls')
})

test('query-only route changes do not restart deep-link handling', () => {
  const { page, scrolls, options, flushTicks } = fixture({ queued: true })
  page.webcamsLoaded = true
  page.$route = { path: '/caparica', hash: '#camera-1' }
  options.watch.$route.call(page, page.$route, { path: '/caparica', hash: '#camera-1' })
  flushTicks()
  assert.equal(scrolls.length, 0)
})

test('user input, manual playback and destruction cancel pending requests', async () => {
  for (const cancel of [
    page => page.onNavigationInput({ type: 'wheel' }),
    page => page.onNavigationInput({ type: 'keydown', key: 'PageDown' }),
    page => page.cancelDeepLink(),
    (page, options) => options.beforeDestroy.call(page)
  ]) {
    const { page, cameras, options, scrolls, videos, requests, load, flushTicks, settle } = await deepLink('#camera-1')
    cancel(page, options)
    requests[0].resolve({ data: cameras })
    await load
    flushTicks()
    await settle()
    flushTicks()
    assert.equal(scrolls.length, 0)
    assert.equal(videos[1].playCalls, 0)
  }
  const ignored = await deepLink('#camera-1')
  ignored.page.onNavigationInput({ type: 'keydown', key: 'Escape' })
  ignored.requests[0].resolve({ data: ignored.cameras })
  await ignored.load
  ignored.flushTicks()
  assert.equal(ignored.videos[1].playCalls, 1)
})

test('destruction before data arrives discards the response', async () => {
  const { page, cameras, options, requests, load } = await deepLink('#camera-1')
  options.beforeDestroy.call(page)
  requests[0].resolve({ data: cameras })
  await load
  assert.equal(page.webcams.length, 0)
  assert.equal(page.webcamsLoaded, false)
})

test('intentional camera navigation cancels a pending deep link', async () => {
  const { page, cameras, requests, load, flushTicks, scrolls, settle } = await deepLink('#camera-1')
  requests[0].resolve({ data: cameras })
  await load
  page.goToCamera('camera-2')
  flushTicks()
  await settle()
  flushTicks()
  assert.equal(scrolls.length, 1)
  assert.equal(page.activeCameraIndex, 2)
})

async function navigated (options) {
  const context = fixture({ queued: true, ...options })
  context.page.webcamsLoaded = true
  context.navigate('/caparica', '#camera-1')
  context.flushTicks()
  context.scrolls.length = 0
  return context
}

test('layout shifts reposition without selecting again or replaying a paused camera', async () => {
  const { page, videos, rects, scrolls, observers, flushFrames, flushTicks } = await navigated()
  assert.equal(observers.length, 1)
  assert.equal(observers[0].observed.length, 3)
  videos[1].pause()
  const calls = { play: videos[1].playCalls, pause: videos[1].pauseCalls, others: videos[0].pauseCalls }
  rects[1].top = 400
  observers[0].callback()
  observers[0].callback()
  flushFrames()
  flushTicks()
  assert.deepEqual(plain(scrolls), [{ top: 348, behavior: 'auto' }])
  assert.equal(videos[1].playCalls, calls.play)
  assert.equal(videos[1].pauseCalls, calls.pause)
  assert.equal(videos[0].pauseCalls, calls.others)
  assert.equal(page.navigationTarget, 1, 'explicit navigation guard stays active')
  rects[1].top = 401
  observers[0].callback()
  flushFrames()
  assert.equal(scrolls.length, 1, 'immaterial change is ignored')
})

test('corrections follow header height including a valid zero and clamp to document bottom', async () => {
  const { videos, rects, scrolls, setHeaderHeight, observers, flushFrames, window } = await navigated()
  setHeaderHeight(0)
  flushFrames()
  assert.deepEqual(plain(scrolls.at(-1)), { top: 120, behavior: 'auto' })
  rects[1].top = 3000
  observers[0].callback()
  flushFrames()
  assert.deepEqual(plain(scrolls.at(-1)), { top: 700, behavior: 'auto' })
  window.pageYOffset = 700
  rects[1].top = 3000
  setHeaderHeight(72)
  flushFrames()
  assert.equal(scrolls.length, 2, 'clamped destination did not change materially')
  assert.equal(videos[1].playCalls, 1)
})

test('correction is bounded to five seconds and releases every callback', async () => {
  const { page, timers, timerDelays, observers, watchers, frames, scrolls, rects, setHeaderHeight, flushFrames } = await navigated()
  observers[0].callback()
  assert.equal(frames.size, 1)
  const deadline = [...timers.keys()].find(id => timerDelays.get(id) === 5000)
  assert.ok(deadline)
  timers.get(deadline)()
  assert.equal(observers[0].disconnected, true)
  assert.equal(watchers.size, 0)
  assert.equal(frames.size, 0)
  assert.equal(page._correction, null)
  rects[1].top = 500
  setHeaderHeight(10)
  flushFrames()
  assert.equal(scrolls.length, 0)
})

test('superseding, cancelling and destroying clean up correction work', async () => {
  for (const finish of [
    (page, ctx) => ctx.navigate('/caparica', '#camera-2'),
    (page, ctx) => ctx.navigate('/caparica', ''),
    page => page.onNavigationInput({ type: 'wheel' }),
    page => page.onNavigationInput({ type: 'touchstart' }),
    page => page.cancelDeepLink(),
    (page, ctx) => ctx.options.beforeDestroy.call(page),
    page => page.onFullscreenChange({ index: 0, isFullscreen: true })
  ]) {
    const context = await navigated()
    context.observers[0].callback()
    finish(context.page, context)
    assert.equal(context.observers[0].disconnected, true)
    assert.equal(context.watchers.size, 0)
    assert.equal(context.frames.size, 0)
    context.flushFrames()
    context.rects[1].top = 600
    assert.equal(context.scrolls.length, 0)
    assert.equal(context.page._correction, null)
  }
})

test('hash changes during fullscreen stay pending and run after exit and source restoration', async () => {
  const { page, videos, scrolls, navigate, flushTicks, ticks, settle } = fixture({ queued: true })
  page.webcamsLoaded = true
  let restored
  videos[0].restoreSource = () => new Promise(resolve => { restored = resolve })
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  navigate('/caparica', '#camera-1')
  navigate('/caparica', '#camera-2')
  flushTicks()
  assert.equal(page.fsComponentIndex, 0, 'fullscreen is undisturbed')
  assert.equal(scrolls.length, 0)
  assert.equal(ticks.length, 0)
  page.onFullscreenChange({ index: 0, isFullscreen: false })
  assert.equal(page.pendingDeepLink.anchor, 'camera-2', 'fullscreen exit does not cancel the request')
  flushTicks()
  assert.equal(scrolls.length, 0, 'waits for source restoration')
  navigate('/caparica', '#camera-1')
  flushTicks()
  assert.equal(scrolls.length, 0, 'hash changes while restoring are deferred too')
  restored()
  await settle()
  flushTicks()
  assert.equal(scrolls.length, 1)
  assert.equal(page.activeCameraIndex, 1)
  assert.equal(videos[1].playCalls, 1)
  assert.equal(videos[2].playCalls, 0)
})

test('a restoration from a superseded fullscreen session cannot resume the request', async () => {
  const { page, videos, scrolls, navigate, flushTicks, settle } = fixture({ queued: true })
  page.webcamsLoaded = true
  const restores = []
  videos[0].restoreSource = () => new Promise(resolve => restores.push(resolve))
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  navigate('/caparica', '#camera-1')
  page.onFullscreenChange({ index: 0, isFullscreen: false })
  page.onFullscreenChange({ index: 0, isFullscreen: true })
  restores.shift()()
  await settle()
  flushTicks()
  assert.equal(scrolls.length, 0)
  assert.equal(page.fsComponentIndex, 0)
  page.onFullscreenChange({ index: 0, isFullscreen: false })
  restores.shift()()
  await settle()
  flushTicks()
  assert.equal(scrolls.length, 1)
})

test('user input or destruction after fullscreen exit cancels the deferred request', async () => {
  for (const cancel of [page => page.onNavigationInput({ type: 'wheel' }), (page, options) => options.beforeDestroy.call(page)]) {
    const { page, options, videos, scrolls, navigate, flushTicks, settle } = fixture({ queued: true })
    page.webcamsLoaded = true
    let restored
    videos[0].restoreSource = () => new Promise(resolve => { restored = resolve })
    page.onFullscreenChange({ index: 0, isFullscreen: true })
    navigate('/caparica', '#camera-1')
    page.onFullscreenChange({ index: 0, isFullscreen: false })
    cancel(page, options)
    restored()
    await settle()
    flushTicks()
    assert.equal(scrolls.length, 0)
  }
})

test('camera components expose narrowly scoped playback-intent wiring', async () => {
  const { readFileSync } = await import('node:fs')
  const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
  assert.match(read('src/pages/Cam4.vue'), /@playback-intent="cancelDeepLink"/)
  assert.match(read('src/pages/Cam4.vue'), /@go-to-camera="goToCamera\(\$event\)"/)
  assert.equal(read('src/components/WebcamItem.vue').match(/@playback-intent="\$emit\('playback-intent'\)"/g).length, 2)
  assert.match(read('src/components/VideoPlayer.vue'), /\$emit\('playback-intent'\); togglePlay\(\)/)
  assert.equal(read('src/components/VideoYoutube.vue').match(/\$emit\('playback-intent'\)/g).length, 3)
})
