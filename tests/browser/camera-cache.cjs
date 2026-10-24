// Real HTTP-cache/PWA regression. Build locally first; no request interception (it disables HTTP cache).
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const http = require('node:http')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const root = path.resolve(__dirname, '../../dist/pwa')
const apiURL = 'https://api.huna.pt/urllinks.json'
const modified = new Date(Date.now() - 8 * 86400000).toUTCString()
let identity = 'A'
let workerVersion = 1
let apiUnavailable = false
const requests = []
const servers = []
const listen = handler => new Promise(resolve => {
  const server = http.createServer(handler)
  servers.push(server)
  server.listen(0, '127.0.0.1', () => resolve('http://127.0.0.1:' + server.address().port))
})
const mime = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }

;(async () => {
  assert.ok(fs.existsSync(path.join(root, 'service-worker.js')), 'Build the PWA with the Quasar binary first')
  const fixture = await listen((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.url !== '/urllinks.json' && req.url !== '/heuristic.json') { res.writeHead(404); return res.end() }
    requests.push({ method: req.method, url: req.url, identity, conditional: !!req.headers['if-modified-since'] })
    if (apiUnavailable) { res.destroy(); return }
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Last-Modified', modified)
    // /heuristic.json mirrors observed production headers; the regression endpoint is deterministically cacheable.
    if (req.url === '/urllinks.json') res.setHeader('Cache-Control', 'public, max-age=3600')
    res.end(JSON.stringify([{ anchor: 'cache-camera', title: 'Fixture ' + identity, type: 'application/x-mpegURL', src: fixture + '/' + identity + '.m3u8' }]))
  })
  const app = await listen((req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname
    if (pathname === '/__camera-links.mjs') {
      res.setHeader('Content-Type', 'text/javascript')
      return res.end(fs.readFileSync(path.resolve(__dirname, '../../src/utils/camera-links.mjs')))
    }
    if (pathname === '/diagnose') {
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('Cache-Control', 'no-store')
      return res.end(`<body><output></output><script>window.read = async cache => (await (await fetch('${fixture}/heuristic.json', cache ? {cache} : {})).json())[0].title; window.loaded = read().then(value => document.querySelector('output').textContent = value)</script>`)
    }
    let filename = path.resolve(root, '.' + pathname)
    if (!filename.startsWith(root + path.sep)) filename = path.join(root, 'index.html')
    if (!fs.existsSync(filename) || fs.statSync(filename).isDirectory()) filename = path.join(root, 'index.html')
    const ext = path.extname(filename)
    let body = fs.readFileSync(filename)
    if (ext === '.js') {
      // Test-server-only endpoint substitution: the production source/URL stays unchanged.
      body = Buffer.from(body.toString().split(apiURL).join(fixture + '/urllinks.json'))
      if (pathname === '/service-worker.js') body = Buffer.concat([body, Buffer.from('\n// local update fixture ' + workerVersion)])
    }
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream')
    res.setHeader('Cache-Control', pathname === '/service-worker.js' || ext === '.html' || ext === '.json' ? 'no-cache' : 'public, max-age=31536000, immutable')
    res.end(body)
  })
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ serviceWorkers: 'allow' })
    const page = await context.newPage()
    const evidence = []
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    cdp.on('Network.responseReceived', ({ response }) => {
      if (response.url.startsWith(fixture) && response.url.endsWith('.json')) {
        evidence.push({
          url: response.url,
          status: response.status,
          diskCache: !!response.fromDiskCache,
          serviceWorker: !!response.fromServiceWorker,
          cacheControl: response.headers['Cache-Control'] || null,
          lastModified: response.headers['Last-Modified'] || null
        })
      }
    })
    // Isolate heuristic HTTP caching before loading the application.
    await page.goto(app + '/diagnose')
    assert.equal(await page.evaluate(() => window.loaded.then(() => document.querySelector('output').textContent)), 'Fixture A')
    identity = 'B'
    const cached = await page.evaluate(() => window.read())
    assert.equal(cached, 'Fixture A', 'controlled browser reproduces heuristic HTTP-cache staleness')
    await page.reload()
    const reload = await page.evaluate(() => window.loaded.then(() => document.querySelector('output').textContent))
    const bypass = await page.evaluate(() => window.read('no-store'))
    assert.equal(bypass, 'Fixture B')
    const fresh = await browser.newContext()
    const freshPage = await fresh.newPage()
    await freshPage.goto(app + '/diagnose')
    assert.equal(await freshPage.evaluate(() => window.read()), 'Fixture B')
    await fresh.close()
    console.log('PASS heuristic isolation', { cached, normalReload: reload, bypass, freshContext: 'Fixture B' })
    if (process.env.CHECK_LIVE_API === '1') {
      const live = await page.evaluate(async ({ url, loader }) => {
        const { loadCameraLinks } = await import(loader)
        const data = await loadCameraLinks(url)
        return { list: Array.isArray(data), count: data.length }
      }, { url: apiURL, loader: app + '/__camera-links.mjs' })
      assert.equal(live.list, true)
      console.log('PASS read-only live API browser/CORS check (no payload logged)', live)
    }

    await context.addCookies([{ name: 'pwd', value: JSON.stringify({ code: 'caparica', token: 'v1' }), url: app }])
    identity = 'A'
    await page.goto(app + '/cam#cache-camera')
    await page.getByRole('heading', { name: 'Fixture A', exact: true }).waitFor()
    await page.evaluate(() => navigator.serviceWorker.ready)
    await page.reload()
    await page.waitForFunction(() => !!navigator.serviceWorker.controller)
    await page.getByRole('heading', { name: 'Fixture A', exact: true }).waitFor()
    // Populate the ordinary browser HTTP cache too, as an older client could have done.
    await page.evaluate(url => fetch(url).then(response => response.json()), fixture + '/urllinks.json')
    const before = requests.length
    identity = 'B'
    await page.waitForTimeout(300)
    assert.equal(requests.length, before, 'mounted page makes no background list request')
    await page.getByRole('heading', { name: 'Fixture A', exact: true }).waitFor()
    const stillCached = await page.evaluate(url => fetch(url).then(response => response.json()).then(data => data[0].title), fixture + '/urllinks.json')
    assert.equal(stillCached, 'Fixture A', 'ordinary fetch still sees the seeded HTTP-cache entry')
    await page.reload()
    await page.getByRole('heading', { name: 'Fixture B', exact: true }).waitFor()
    assert.ok(requests.slice(before).some(request => request.identity === 'B' && request.url === '/urllinks.json'))
    await page.waitForFunction(src => document.querySelector('#cache-camera .video-js')?.player?.currentSrc() === src, fixture + '/B.m3u8')
    assert.equal(await page.evaluate(() => document.querySelector('.camera-page').__vue__.$parent.activeCameraIndex), 0, 'deep link preserved')
    assert.equal(requests.some(request => request.method === 'OPTIONS'), false, 'no CORS preflight')
    const caches = await page.evaluate(async () => {
      const result = []
      for (const name of await window.caches.keys()) for (const request of await (await window.caches.open(name)).keys()) result.push(request.url)
      return result
    })
    assert.ok(caches.some(url => /\/js\//.test(url)), 'static asset caching remains active')
    assert.ok(!caches.some(url => url.startsWith(fixture)), 'JSON absent from Workbox caches')
    console.log('PASS A → B normal reload: rendered title, player link, deep link, CORS, enabled worker and static caches')

    // Real installed-worker update: waiting/installing worker must become active, without reloading the playing page.
    await page.evaluate(() => { window.cacheReviewSentinel = 'keep-page' })
    workerVersion = 2
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration()
      navigator.serviceWorker.addEventListener('controllerchange', () => { window.cacheReviewControllerChanged = true }, { once: true })
      await registration.update()
    })
    await page.waitForFunction(() => window.cacheReviewControllerChanged === true)
    assert.equal(await page.evaluate(() => window.cacheReviewSentinel), 'keep-page')
    console.log('PASS installed worker update without forced page reload')

    // Offline API with the app shell reachable: no cached list masquerading as live.
    apiUnavailable = true
    await page.reload()
    await page.getByRole('alert').filter({ hasText: 'Não foi possível carregar as câmaras.' }).waitFor()
    assert.equal(await page.locator('#cache-camera').count(), 0)
    apiUnavailable = false
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click()
    await page.getByRole('heading', { name: 'Fixture B', exact: true }).waitFor()
    console.log('PASS unavailable API shows error and retry restores fresh B')

    // Inspect navigation independently: known pre-existing fallback/precache mismatch is tracked, not silently rewritten.
    await context.setOffline(true)
    await page.evaluate(async () => {
      const router = document.querySelector('#q-app').__vue__.$router
      await router.push('/')
      await router.push('/cam')
    })
    await page.getByRole('alert').filter({ hasText: 'Não foi possível carregar as câmaras.' }).waitFor()
    assert.equal(await page.locator('#cache-camera').count(), 0)
    console.log('PASS browser-offline camera remount shows honest error, not cached JSON')
    let offlineNavigation
    try {
      await page.goto(app + '/cam')
      offlineNavigation = await page.locator('#q-app').count() ? 'shell available' : 'shell unavailable'
    } catch { offlineNavigation = 'navigation failed' }
    console.log('PWA offline navigation observation:', offlineNavigation)
    console.log('HTTP evidence (fixture URLs only):', JSON.stringify(evidence))
    console.log('Installed worker/cache evidence:', JSON.stringify({ workerVersion, precachedAssetCount: caches.length, jsonInCache: false }))
    await context.close()
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => {
  for (const server of servers) { server.closeAllConnections(); server.close() }
})
