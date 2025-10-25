const BLACKLIST = [
  'aax.amazon-adsystem.com',
  'fastlane.rubiconproject.com',
  'direct.adsrvr.org',
  'adsrvr.org',
  'doubleclick.net',
  'ads.adthrive.com',
  'securepubads.g.doubleclick.net',
  'pagead2.googlesyndication.com',
  'googleads.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'adservice.google.com',
  'adservice.google.pt',
  'adservice.google.co.uk',
  'pixel.rubiconproject.com',
  'c.amazon-adsystem.com',
  'config.aps.amazon-adsystem.com',
  'b.delivery.consentmanager.net',
  'cdn.consentmanager.net',
  'hbopenbid.pubmatic.com',
  'googlesyndication.com',
  'googletagservices.com',
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
  'facebook.net',
  'facebook.com/tr',
  'connect.facebook.net',
  'adnxs.com',
  'casalemedia.com',
  'contextweb.com',
  'criteo.com',
  'criteo.net',
  'outbrain.com',
  'taboola.com'
]

self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.log('[SW] Activating...')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  try {
    const reqUrl = new URL(event.request.url)
    const host = reqUrl.hostname.toLowerCase()
    const fullUrl = event.request.url

    // block if host matches any blacklist item (exact or contains)
    const blocked = BLACKLIST.some(b => {
      const pattern = b.toLowerCase()
      return host === pattern || host.endsWith('.' + pattern) || host.includes(pattern) || fullUrl.includes(pattern)
    })

    if (blocked) {
      console.log('[SW] BLOCKED:', fullUrl)
      // Return empty response to block the request
      event.respondWith(new Response('', { status: 204, statusText: 'Blocked by SW' }))
      return
    }

    // If not blocked, pass through normally (don't intercept)
    // This is key: we don't call respondWith for non-blocked requests
  } catch (e) {
    console.error('[SW] Error processing fetch:', e)
    // On error, allow the request to proceed normally
  }
})
