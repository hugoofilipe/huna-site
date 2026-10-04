// Optional real-browser checks: npm run test:browser. Requires Playwright and ffmpeg.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.BASE_URL || 'http://localhost:8093'
const temp = path.join(os.tmpdir(), 'opencode')
fs.mkdirSync(temp, { recursive: true })
const artifacts = fs.mkdtempSync(path.join(temp, 'camera-review-'))
const fixture = process.env.CAMERA_FIXTURE_DIR || artifacts
if (!fs.existsSync(path.join(fixture, 'playlist.m3u8'))) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc=size=160x90:rate=10', '-t', '60', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-g', '20', '-f', 'hls', '-hls_time', '2', '-hls_list_size', '0', '-hls_segment_filename', path.join(fixture, 'segment%d.ts'), path.join(fixture, 'playlist.m3u8')])
}

async function run (browser, viewport, mobile) {
  const context = await browser.newContext({ viewport, acceptDownloads: true, ...(mobile ? { isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36' } : {}) })
  await context.addCookies([{ name: 'pwd', value: JSON.stringify({ code: 'caparica', token: 'v1' }), url: base }])
  await context.route('https://api.huna.pt/urllinks.json', route => route.fulfill({ json: [0, 1, 2, 3, 4, 5].map(index => ({ anchor: 'review-camera-' + index, title: 'Review camera ' + index, type: 'application/x-mpegURL', src: base + '/__review_fixture/' + index + '/playlist.m3u8' })) }))
  await context.route('**/__review_fixture/**', route => {
    const name = path.basename(new URL(route.request().url()).pathname)
    if (!/^(playlist\.m3u8|segment\d+\.ts)$/.test(name)) return route.abort()
    return route.fulfill({ body: fs.readFileSync(path.join(fixture, name)), contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const component = expression => page.evaluate(expression)
  const root = () => page.evaluate(() => {
    const camera = document.querySelector('.camera-page').__vue__.$parent
    return { active: camera.activeCameraIndex, fullscreen: camera.fsComponentIndex, displayed: camera.fsCameraIndex, identity: camera.displayedCamera(1)?.anchor, clearance: camera.cameraLayout.clearance, height: camera.cameraLayout.height }
  })
  const card = index => page.locator('#review-camera-' + index)
  const enter = async index => {
    await card(index).getByRole('button', { name: 'Ecrã inteiro', exact: true }).click()
    await page.waitForFunction(() => !!document.fullscreenElement)
  }
  const exit = async index => {
    await card(index).getByRole('button', { name: 'Sair de ecrã inteiro', exact: true }).click()
    await page.waitForFunction(() => !document.fullscreenElement)
  }
  try {
    await page.goto(base + '/cam')
    await page.waitForFunction(() => document.querySelector('.camera-page'))
    assert.equal(await page.locator('bestweather-forecast').count(), 0)
    await page.evaluate(() => { document.querySelector('#q-app').__vue__.$router.push('/caparica') })
    await page.waitForFunction(() => document.querySelector('bestweather-forecast')?.shadowRoot?.querySelector('.bw-root'))
    assert.equal(await page.locator('script[src*="bestweather-forecast.js"]').count(), 1)
    const bounds = await page.evaluate(() => ({ widget: document.querySelector('bestweather-forecast').getBoundingClientRect().top, header: document.querySelector('.q-header').getBoundingClientRect().bottom, right: innerWidth - document.querySelector('.q-page-sticky button').getBoundingClientRect().right, bottom: innerHeight - document.querySelector('.q-page-sticky button').getBoundingClientRect().bottom }))
    assert.ok(bounds.widget >= Math.max(0, bounds.header))
    assert.equal(bounds.right, 4)
    assert.equal(bounds.bottom, 12)
    await page.getByRole('button', { name: 'Abrir menu de câmaras', exact: true }).click()
    await page.locator('.sidebar .q-item__label').filter({ hasText: /^Review camera 1$/ }).click()
    if (!mobile) await page.getByRole('button', { name: 'Fechar menu de câmaras', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('#review-camera-1 video').currentTime > .1)
    assert.equal((await root()).active, 1)
    assert.equal(await component(() => document.querySelector('#review-camera-0 video').paused), true)
    await card(1).getByRole('button', { name: 'Pausar', exact: true }).click()
    await page.evaluate(() => { document.querySelector('.camera-page').__vue__.$parent.cancelNavigation(); scrollBy(0, 3) })
    await page.waitForFunction(() => document.querySelector('#review-camera-1 video').paused)
    await page.getByRole('button', { name: 'Abrir menu de câmaras', exact: true }).click()
    await page.locator('.sidebar .q-item__label').filter({ hasText: /^Review camera 1$/ }).click()
    if (!mobile) await page.getByRole('button', { name: 'Fechar menu de câmaras', exact: true }).click()
    await page.waitForFunction(() => !document.querySelector('#review-camera-1 video').paused)

    await enter(1)
    await card(1).getByRole('button', { name: 'Próximo', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.fsCameraIndex === 2)
    await page.waitForFunction(() => document.querySelector('#review-camera-1 video').currentTime > .1)
    const identity = await card(1).locator('.social-btn').evaluate(button => button.closest('a').__vue__.$props)
    assert.ok(identity.url.includes('review-camera-2'))
    assert.ok(identity.title.includes('Review camera 2'))
    await page.evaluate(() => { Object.defineProperty(window, 'ClipboardItem', { configurable: true, value: undefined }) })
    const downloadPromise = page.waitForEvent('download').catch(error => error)
    await card(1).locator('.custom-controls').getByRole('button', { name: 'Capturar imagem', exact: true }).click()
    const download = await downloadPromise
    if (download instanceof Error) throw download
    assert.equal(download.suggestedFilename(), 'review-camera-2.png')
    assert.equal(await download.failure(), null)
    await card(1).getByRole('button', { name: 'Pausar', exact: true }).click()
    await exit(1)
    await page.waitForFunction(() => document.querySelector('#review-camera-1 .video-js').player.currentSrc().includes('/1/') && document.querySelector('#review-camera-1 video').paused)
    assert.equal((await root()).identity, 'review-camera-1')
    await card(1).getByRole('button', { name: 'Reproduzir', exact: true }).click()
    await enter(1)
    await exit(1)
    await page.waitForFunction(() => !document.querySelector('#review-camera-1 video').paused)
    await enter(1)
    await card(1).getByRole('button', { name: 'Próximo', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.fsCameraIndex === 2)
    await page.keyboard.press('Escape')
    try {
      await page.waitForFunction(() => !document.fullscreenElement, null, { timeout: 2000 })
      console.log('PASS native Escape fullscreen exit')
    } catch (error) {
      console.log('Headless Escape shortcut unavailable; checking the native fullscreen-exit event instead')
      await page.evaluate(() => document.exitFullscreen())
    }
    await page.waitForFunction(() => !document.fullscreenElement && document.querySelector('#review-camera-1 .video-js').player.currentSrc().includes('/1/') && !document.querySelector('#review-camera-1 video').paused)

    await context.route('**/__review_fixture/2/playlist.m3u8', route => route.abort())
    await enter(1)
    await card(1).getByRole('button', { name: 'Próximo', exact: true }).click()
    await page.waitForFunction(() => !!document.querySelector('.camera-page').__vue__.$parent.cameraSwitchError)
    assert.equal((await root()).displayed, 1)
    assert.equal(await page.evaluate(() => document.querySelector('#review-camera-1 .video-js').player.currentSrc().includes('/1/')), true)
    await exit(1)
    await context.unroute('**/__review_fixture/2/playlist.m3u8')

    await page.evaluate(() => scrollTo(0, document.body.scrollHeight - innerHeight))
    await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.cameraLayout.clearance === 0)
    await page.getByRole('button', { name: 'Abrir menu de câmaras', exact: true }).click()
    await page.waitForFunction(() => Math.abs(document.querySelector('.sidebar .q-drawer').getBoundingClientRect().top) < 1)
    await page.getByRole('button', { name: 'Fechar menu de câmaras', exact: true }).click()

    await page.setViewportSize({ width: 844, height: 390 })
    await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.cameraLayout.height === 0)
    await page.getByRole('button', { name: 'Abrir menu de câmaras', exact: true }).click()
    await page.waitForFunction(() => Math.abs(document.querySelector('.sidebar .q-drawer').getBoundingClientRect().top) < 1)
    await page.getByRole('button', { name: 'Fechar menu de câmaras', exact: true }).click()
    await page.setViewportSize({ width: 390, height: 400 })
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForFunction(() => document.querySelector('.camera-page').__vue__.$parent.cameraLayout.clearance > 0)
    await page.getByRole('button', { name: 'Abrir menu de câmaras', exact: true }).click()
    await page.getByRole('button', { name: 'Fechar menu de câmaras', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.sidebar .q-drawer').getBoundingClientRect().left >= innerWidth)
    await card(1).locator('.title').getByRole('button', { name: 'Copiar link', exact: true }).click()
    await page.getByText('Link copiado com sucesso', { exact: true }).waitFor()
    const blocksToggle = await page.evaluate(() => {
      const rect = document.querySelector('.q-page-sticky button').getBoundingClientRect()
      return !!document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.closest('.q-dialog')
    })
    assert.equal(blocksToggle, true, 'dialogs stay above the edge toggle')
    await page.getByRole('button', { name: 'Eu entendi', exact: true }).click()
    await page.screenshot({ path: path.join(artifacts, 'layout-' + viewport.width + '.png') })
    assert.deepEqual(errors, [])
    console.log('PASS browser review', viewport, mobile ? 'mobile' : 'desktop')
  } finally {
    await context.close()
  }
}

;(async () => {
  const browser = await chromium.launch()
  try {
    await run(browser, { width: 1280, height: 720 }, false)
    await run(browser, { width: 390, height: 844 }, true)
    console.log('Artifacts:', artifacts)
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
