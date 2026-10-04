import assert from 'node:assert/strict'
import test from 'node:test'
import { findCamera } from '../src/utils/camera-navigation.mjs'
import { loadComponent } from './helpers/load-component.mjs'

function fixture () {
  const cameras = [0, 1, 2].map(index => ({ anchor: 'camera-' + index, title: 'Camera ' + index, src: 'feed-' + index, type: 'application/x-mpegURL' }))
  const timers = new Map()
  const scrolls = []
  const downloads = []
  const rects = cameras.map(() => ({ top: 100, bottom: 350 }))
  const document = {
    documentElement: { scrollHeight: 1200 },
    getElementById: anchor => ({ getBoundingClientRect: () => rects[cameras.findIndex(camera => camera.anchor === anchor)] }),
    getElementsByClassName: () => [{ classList: { toggle () {} } }],
    createElement: () => ({ click () { downloads.push(this.download) } })
  }
  const window = { innerHeight: 500, pageYOffset: 20, scrollTo: value => scrolls.push(value), removeEventListener () {} }
  const options = loadComponent('src/pages/Cam4.vue', {
    WebcamItem: {}, WebcamSidebar: {}, axios: {}, findCamera, loadWeatherWidget: async () => {}, copyText: async () => {},
    document, window, navigator: {}, URL: { createObjectURL: () => 'blob:frame', revokeObjectURL () {} },
    setTimeout: fn => { const id = {}; timers.set(id, fn); return id }, clearTimeout: id => timers.delete(id)
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
  const page = {
    ...options.data(), webcams: cameras, cameraLayout: { clearance: 72, height: 72 },
    $refs: { webcamItems: videos.map(video => ({ $refs: { video } })) },
    $nextTick: fn => fn()
  }
  for (const [name, method] of Object.entries(options.methods)) page[name] = method.bind(page)
  return { page, videos, cameras, timers, rects, scrolls, downloads, options, window }
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
