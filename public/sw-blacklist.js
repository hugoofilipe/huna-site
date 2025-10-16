const BLACKLIST = [
  'aax.amazon-adsystem.com',
  'fastlane.rubiconproject.com',
  'direct.adsrvr.org',
  'adsrvr.org',
  'doubleclick.net',
  'https://ads.adthrive.com',
  'https://securepubads.g.doubleclick.net',
  'pagead2.googlesyndication.com',
  'googleads.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'adservice.google.com',
  'adservice.google.pt',
  'adservice.google.co.uk',
  'https://pixel.rubiconproject.com',
  'https://c.amazon-adsystem.com',
  'https://config.aps.amazon-adsystem.com',
  'https://b.delivery.consentmanager.net',
  'https://cdn.consentmanager.net',
  'https://hbopenbid.pubmatic.com',
  'https://ads.adthrive.com'
]

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  try {
    const reqUrl = new URL(event.request.url)
    const host = reqUrl.hostname.toLowerCase()

    // block if host matches any blacklist item (exact or suffix)
    const blocked = BLACKLIST.some(b => host === b || host.endsWith('.' + b))
    if (blocked) {
      // silent block: return empty 204
      event.respondWith(new Response('', { status: 204, statusText: 'Blocked by SW' }))
      return
    }
  } catch (e) {
    // ignore parse errors and allow request
  }

  // default: pass-through
  event.respondWith(fetch(event.request))
})
