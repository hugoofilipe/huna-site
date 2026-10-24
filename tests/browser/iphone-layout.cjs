// Portable layout checks in Chromium and desktop WebKit with iPhone-like touch
// viewports. This is NOT a substitute for Safari on a physical iPhone.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { chromium, webkit, devices } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')

const base = process.env.BASE_URL || 'http://localhost:8093'
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode/iphone-layout-'))
const fixture = process.env.CAMERA_FIXTURE_DIR || artifacts
if (!fs.existsSync(path.join(fixture, 'playlist.m3u8'))) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc=size=160x90:rate=10', '-t', '30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-g', '20', '-f', 'hls', '-hls_time', '2', '-hls_list_size', '0', '-hls_segment_filename', path.join(fixture, 'segment%d.ts'), path.join(fixture, 'playlist.m3u8')])
}

async function contextFor (browser, viewport) {
  const context = await browser.newContext({ viewport, isMobile: true, hasTouch: true, acceptDownloads: true, userAgent: devices['iPhone 13'].userAgent })
  await context.addCookies([{ name: 'pwd', value: JSON.stringify({ code: 'caparica', token: 'v1' }), url: base }])
  await context.route('https://api.huna.pt/urllinks.json', route => route.fulfill({ json: [0, 1].map(index => ({ anchor: 'review-camera-' + index, title: 'Review camera ' + index + ' with a long wrapping name', type: 'application/x-mpegURL', src: base + '/__review_fixture/' + index + '/playlist.m3u8' })) }))
  await context.route('**/__review_fixture/**', route => {
    const name = path.basename(new URL(route.request().url()).pathname)
    if (!/^(playlist\.m3u8|segment\d+\.ts)$/.test(name)) return route.abort()
    return route.fulfill({ body: fs.readFileSync(path.join(fixture, name)), contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
  })
  // Avoid third-party outages and layout timing in the portable regression run.
  await context.route('https://widget.bestweather.org/**', route => route.fulfill({ contentType: 'application/javascript', body: "customElements.define('bestweather-forecast', class extends HTMLElement { connectedCallback () { this.style.display = 'block'; this.style.height = '80px' } })" }))
  return context
}

async function audit (browser, engine, viewport, orientation) {
  const context = await contextFor(browser, viewport)
  const page = await context.newPage()
  const errors = []
  const failed = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('requestfailed', request => { if (!request.url().includes('google') && !request.url().includes('youtube')) failed.push(request.url()) })
  const label = engine + '-' + orientation + '-' + viewport.width
  try {
    for (const route of ['/cam', '/caparica']) {
      await page.goto(base + route + '#review-camera-1')
      await page.waitForSelector('#review-camera-1 video')
      await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.activeCameraIndex === 1)
      const state = await page.evaluate(() => {
        const player = document.querySelector('#review-camera-1 .main-video-player')
        const video = player.querySelector('video')
        const controls = [...player.querySelectorAll('.custom-controls button')]
        const header = document.querySelector('.q-header')
        const menu = document.querySelector('.menu_mobile')
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          menuVisible: getComputedStyle(menu).display !== 'none' && header.getBoundingClientRect().height > 0,
          controls: controls.map(button => ({ name: button.getAttribute('aria-label'), height: button.getBoundingClientRect().height, right: button.getBoundingClientRect().right })),
          inline: video.playsInline,
          fullscreenButton: !!controls.find(button => button.getAttribute('aria-label') === 'Ecrã inteiro'),
          wrapperFullscreen: typeof player.requestFullscreen === 'function',
          nativeFullscreen: !!video.webkitSupportsFullscreen,
          viewport: document.querySelector('meta[name="viewport"]')?.content
        }
      })
      await page.screenshot({ path: path.join(artifacts, 'before-or-after-' + label + '-' + route.slice(1) + '.png') })
      assert.ok(state.overflow <= 1, route + ' overflow: ' + JSON.stringify(state))
      assert.ok(state.menuVisible, route + ' navigation hidden: ' + JSON.stringify(state))
      assert.ok(state.inline, route + ' must play inline: ' + JSON.stringify(state))
      assert.ok(state.controls.every(control => control.height >= 44 && control.right <= viewport.width + 1), route + ' controls too small or clipped: ' + JSON.stringify(state))
      assert.equal(state.fullscreenButton, state.wrapperFullscreen || state.nativeFullscreen, route + ' fullscreen button has no available capability')
      assert.ok(!/user-scalable=no|maximum-scale=1(?:,|$)/.test(state.viewport), 'pinch zoom must remain available')
      if (engine === 'webkit' && route === '/cam') {
        const codec = await page.locator('#review-camera-1 video').evaluate(video => video.canPlayType('application/vnd.apple.mpegurl'))
        if (codec) {
          const playButton = page.locator('#review-camera-1').getByRole('button', { name: 'Reproduzir', exact: true })
          if (await playButton.count()) await playButton.click()
          await page.waitForFunction(() => document.querySelector('#review-camera-1 video').currentTime > .1)
          console.log('PASS WebKit HLS playback with native codec:', codec)
        } else console.log('SKIP WebKit playback: this WebKit build has no native HLS codec')
      }
      await page.getByRole('button', { name: 'Abrir menu de câmaras' }).click()
      await page.locator('.webcam-sidebar .menu-item-mobile').first().click()
      await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.activeCameraIndex === 0)
      await page.waitForFunction(() => !document.querySelector('.camera-page').__vue__.$parent.drawer)
      await page.getByRole('button', { name: 'Abrir menu de câmaras' }).click()
      await page.getByRole('button', { name: 'Fechar menu', exact: true }).click()
      await page.waitForFunction(() => !document.querySelector('.camera-page').__vue__.$parent.drawer)
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied') } } })
        document.execCommand = () => false
      })
      const alert = page.waitForEvent('dialog').then(async dialog => { const message = dialog.message(); await dialog.dismiss(); return message })
      await page.locator('#review-camera-0 .title').getByRole('button', { name: 'Copiar link' }).click()
      assert.ok((await alert).includes('copiar'), 'clipboard refusal has error feedback')
      assert.equal(await page.getByText('Link copiado com sucesso').count(), 0, 'clipboard refusal must not show success')
    }
    if (orientation !== 'landscape') {
      await page.setViewportSize({ width: 667, height: 375 })
      await page.evaluate(() => scrollTo(0, 0))
      await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.cameraLayout.height > 0)
      assert.equal(await page.locator('.menu_mobile').isVisible(), true, 'rotation retains navigation')
      await page.setViewportSize(viewport)
      await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.cameraLayout.height > 0)
    }
    assert.deepEqual(errors, [], label + ' page errors')
    assert.deepEqual(failed, [], label + ' failed requests')
    console.log('PASS portable iPhone-like layout', label)
  } finally { await context.close() }
}

async function loginAudit (browser, engine) {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent })
  const page = await context.newPage()
  try {
    await page.goto(base + '/caparica#review-camera-1')
    const size = await page.locator('#username').evaluate(input => parseFloat(getComputedStyle(input).fontSize))
    assert.ok(size >= 16, engine + ' login input text would trigger iPhone focus zoom: ' + size + 'px')
    await page.locator('#username').focus()
    assert.equal(await page.locator('#username').evaluate(input => getComputedStyle(input).outlineStyle), 'solid', 'focused login input is visible')
    await page.locator('#username').fill('review user')
    await page.locator('#password').fill('caparica') // local test-only gate; never a real account
    await page.locator('.q-toggle').click()
    await page.getByRole('button', { name: 'Entrar' }).click()
    assert.ok(page.url().endsWith('#review-camera-1'), 'login preserves deep link')
  } finally { await context.close() }
}

async function smokeOtherRoutes (browser, engine) {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true })
  await context.addCookies([{ name: 'pwd', value: JSON.stringify({ code: 'caparica', token: 'v1' }), url: base }])
  const page = await context.newPage()
  try {
    for (const [route, selector] of [['/', '.q-page'], ['/portfolio', '.my-card'], ['/peniche', '.q-page-container']]) {
      await page.goto(base + route)
      await page.waitForSelector(selector)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 1), engine + ' ' + route + ' has horizontal overflow')
      await page.screenshot({ path: path.join(artifacts, 'smoke-' + engine + '-' + (route.slice(1) || 'home') + '.png') })
    }
  } finally { await context.close() }
}

;(async () => {
  for (const [engine, browserType] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await browserType.launch()
    try {
      await audit(browser, engine, { width: 320, height: 568 }, 'small-portrait')
      await audit(browser, engine, { width: 375, height: 667 }, 'portrait')
      await audit(browser, engine, { width: 430, height: 932 }, 'large-portrait')
      await audit(browser, engine, { width: 667, height: 375 }, 'landscape')
      await loginAudit(browser, engine)
      await smokeOtherRoutes(browser, engine)
    } finally { await browser.close() }
  }
  console.log('Artifacts:', artifacts)
})().catch(error => { console.error(error); process.exitCode = 1 })
