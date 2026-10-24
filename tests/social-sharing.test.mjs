import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import compiler from 'vue-template-compiler'
import { loadComponent } from './helpers/load-component.mjs'

function fixture ({ captureFrame = async () => new Blob(['frame'], { type: 'image/png' }), navigator = {} } = {}) {
  const shared = []
  const revoked = []
  const created = []
  const options = loadComponent('src/components/SocialSharing.vue', {
    File,
    navigator: {
      canShare: () => true,
      share: async payload => shared.push(payload),
      ...navigator
    },
    URL: class extends URL {
      static createObjectURL (blob) { created.push(blob); return 'blob:preview' }
      static revokeObjectURL (url) { revoked.push(url) }
    }
  })
  const component = {
    ...options.data(),
    anchor: 'praia-sul', title: 'Praia Sul', path: '/caparica', captureFrame,
    captureUnavailableMessage: options.props.captureUnavailableMessage.default
  }
  for (const [name, fn] of Object.entries(options.methods)) component[name] = fn.bind(component)
  for (const [name, fn] of Object.entries(options.computed)) Object.defineProperty(component, name, { get: fn.bind(component) })
  return { component, options, shared, revoked, created }
}

test('preview prepares title, anchored HTTPS link and PNG without opening a share sheet', async () => {
  const { component: c, shared } = fixture()
  await c.prepareShare()
  assert.equal(c.showDialog, true)
  assert.equal(c.preparing, false)
  assert.equal(c.shareText, 'Praia Sul\nhttps://www.huna.pt/caparica#praia-sul')
  assert.equal(new URL(c.whatsappUrl).searchParams.get('text'), c.shareText)
  assert.equal(c.file.type, 'image/png')
  assert.equal(c.previewUrl, 'blob:preview')
  assert.equal(shared.length, 0, 'native sharing waits for a fresh user tap')
  await c.shareImage()
  assert.equal(shared.length, 1)
  assert.equal(shared[0].text, c.shareText)
  assert.equal(shared[0].files[0], c.file)
  assert.equal(c.showDialog, false)
})

test('share payload retains the identity captured before asynchronous preparation', async () => {
  let resolve
  const { component: c } = fixture({ captureFrame: () => new Promise(done => { resolve = done }) })
  const pending = c.prepareShare()
  c.anchor = 'different-camera'
  c.title = 'Different beach'
  resolve(new Blob(['frame']))
  await pending
  assert.equal(c.shareText, 'Praia Sul\nhttps://www.huna.pt/caparica#praia-sul')
})

test('unavailable capture explains the limitation and retains text/link sharing', async () => {
  const { component: c, shared } = fixture({ captureFrame: null })
  c.captureUnavailableMessage = 'Não é possível capturar este vídeo do YouTube.'
  await c.prepareShare()
  assert.match(c.notice, /YouTube/)
  assert.equal(c.file, null)
  assert.equal(shared.length, 0)
  assert.ok(c.whatsappUrl.includes('wa.me/'))
})

test('missing file sharing support, capture failure and CORS errors offer an explicit text fallback', async () => {
  for (const config of [
    { navigator: { canShare: () => false } },
    { navigator: { canShare: undefined } },
    { navigator: { share: undefined } },
    { navigator: { canShare: () => { throw new Error('unsupported') } } },
    { captureFrame: async () => null },
    { captureFrame: async () => { throw new Error('tainted canvas') } }
  ]) {
    const { component: c, shared, created } = fixture(config)
    await c.prepareShare()
    assert.match(c.notice, /só o texto e o link/)
    assert.equal(c.file, null)
    assert.equal(c.preparing, false)
    assert.equal(created.length, 0)
    assert.equal(shared.length, 0, 'never launch a fallback without another user action')
  }
})

test('cancelling native sharing preserves the preview without triggering a fallback', async () => {
  const { component: c } = fixture({ navigator: { share: async () => { throw Object.assign(new Error('cancelled'), { name: 'AbortError' }) } } })
  await c.prepareShare()
  await c.shareImage()
  assert.equal(c.showDialog, true)
  assert.ok(c.file)
  assert.equal(c.notice, '')
  assert.equal(c.sharing, false)
})

test('native share failure offers text/link fallback and releases the preview', async () => {
  const { component: c, revoked } = fixture({ navigator: { share: async () => { throw new Error('denied') } } })
  await c.prepareShare()
  await c.shareImage()
  assert.equal(c.file, null)
  assert.match(c.notice, /só o texto e o link/)
  assert.deepEqual(revoked, ['blob:preview'])
})

test('repeated taps cannot start parallel capture or share requests', async () => {
  let captures = 0
  let finishCapture
  let shares = 0
  let finishShare
  const { component: c } = fixture({
    captureFrame: () => { captures++; return new Promise(resolve => { finishCapture = resolve }) },
    navigator: { share: () => { shares++; return new Promise(resolve => { finishShare = resolve }) } }
  })
  const preparing = c.prepareShare()
  await c.prepareShare()
  assert.equal(captures, 1)
  finishCapture(new Blob(['frame']))
  await preparing
  const sharing = c.shareImage()
  await c.shareImage()
  assert.equal(shares, 1)
  finishShare()
  await sharing
})

test('dialog close or component destruction cancels pending capture and releases preview URLs', async () => {
  for (const destroy of [false, true]) {
    let resolve
    const { component: c, options, created } = fixture({ captureFrame: () => new Promise(done => { resolve = done }) })
    const pending = c.prepareShare()
    if (destroy) options.beforeDestroy.call(c)
    else c.clearShare()
    resolve(new Blob(['frame']))
    await pending
    assert.equal(c.file, null)
    assert.equal(c.preparing, false)
    assert.equal(created.length, 0)
  }
  const { component: c, options, revoked } = fixture()
  await c.prepareShare()
  options.beforeDestroy.call(c)
  assert.deepEqual(revoked, ['blob:preview'])
})

test('share dialog compiles, removes the old warning and uses the displayed HLS capture', () => {
  const social = compiler.parseComponent(readFileSync(new URL('../src/components/SocialSharing.vue', import.meta.url), 'utf8'))
  assert.deepEqual(compiler.compile(social.template.content).errors, [])
  assert.ok(!social.template.content.includes('Atenção'))
  const player = readFileSync(new URL('../src/components/VideoPlayer.vue', import.meta.url), 'utf8')
  assert.match(player, /:capture-frame="captureEnabled \? captureFrame : null"/)
  assert.match(player, /:anchor="displayedAnchor" :title="displayedTitle"/)
  assert.match(player, /crossorigin="anonymous"/)
  const config = readFileSync(new URL('../quasar.conf.js', import.meta.url), 'utf8')
  assert.match(config, /plugins: \['Meta', 'AppFullscreen'\]/, 'Quasar must place the share dialog inside the fullscreen element')
})

test('frame capture requires a decoded frame and handles tainted canvases without a blank screenshot', async () => {
  const frame = new Blob(['frame'], { type: 'image/png' })
  const drawn = []
  const video = { readyState: 1, videoWidth: 1280, videoHeight: 720 }
  const canvas = {
    getContext: () => ({ drawImage: (...args) => drawn.push(args) }),
    toBlob: resolve => resolve(frame)
  }
  const options = loadComponent('src/components/VideoPlayer.vue', {
    document: { createElement: () => canvas },
    console: { warn () {} }
  })
  const c = { captureEnabled: true, sourceChanging: false, player: null, $refs: { videoPlayer: video } }
  const capture = () => options.methods.captureFrame.call(c)
  assert.equal(await capture(), null)
  assert.equal(drawn.length, 0)
  video.readyState = 2
  assert.equal(await capture(), frame)
  assert.equal(canvas.width, 1280)
  assert.equal(canvas.height, 720)
  assert.equal(drawn[0][0], video)
  canvas.toBlob = () => { throw new Error('SecurityError') }
  assert.equal(await capture(), null)
  c.sourceChanging = true
  assert.equal(await capture(), null)
})
