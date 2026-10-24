# Camera-list freshness — issue #10

## Sources and update contract

`Cam4.vue` loads `https://api.huna.pt/urllinks.json`, not `links3.json` and not the repository-root backup. API data and frontend releases are separate operations. Before changing data, the API operator must identify the deployed file behind this URL; a repository edit is not proof of publication. Compare an operator-provided changed title/identity with the endpoint and rendered card without recording entire payloads or stream URLs.

`src/utils/camera-links.mjs` uses a scoped, unchanged-URL GET with `cache: 'no-store'`, no custom request headers, and a 15-second timeout including body parsing. It validates a nonempty list of uniquely anchored cards with titles, supported types, and string sources (only forecast sources may be empty). Invalid/failed responses do not replace state. Initial failure offers retry; superseded/disposed requests cannot commit state. It does not alter Axios defaults, persist JSON, or add Workbox runtime routes.

Freshness is **on camera-page mount/reload, plus explicit retry after failure**. A mounted page retains its list; hash changes, tab focus and fullscreen do not refresh it. Do not introduce polling without designing camera-identity reconciliation and agreeing playback semantics.

## External policies — approval and operator work outstanding

The API nginx and app-host/CDN configurations are outside this repository. No origin changes, purge, deployment, push, or external communication were performed for this implementation. Obtain separate approval before each production action; use endpoint-scoped changes, never a blanket purge.

- **API host operator:** configure `Cache-Control: no-store` on the exact `/urllinks.json` response, including applicable conditional/error responses. In nginx, integrate an `add_header Cache-Control "no-store" always;` directive into the existing exact endpoint configuration without replacing its file-serving or CORS directives. Preserve `Access-Control-Allow-Origin` for the app. Verify actual GET and conditional GET responses after rollout; do not edit unrelated frontend/SSR settings to solve API headers.
- **App hosting/CDN operator:** serve the stable `/service-worker.js` entry with `Cache-Control: no-cache`, and bypass Cloudflare edge caching for this path. Browser `updateViaCache: 'none'` cannot bypass a stale copy already held by the CDN. Purge only that entry if approved and needed after fixing the rule.
- **App hosting/CDN operator:** use explicit revalidation (`Cache-Control: no-cache`) for HTML and `manifest.json`; verify root and history-navigation responses. Keep long-lived immutable caching for content-hashed JS/CSS and hashed Workbox dependencies. Do not apply worker-entry bypass rules indiscriminately to those assets.
- **Frontend maintainer:** publish the approved PWA build through `deploy_dev`/cPanel. The registration now checks its own worker once when registered, with `updateViaCache: 'none'`; offline update-check failures are harmless. The existing GenerateSW `skipWaiting`/`clientsClaim` behavior remains. There is no forced page reload, cache deletion, or registration removal. Already-open pages continue running their loaded JavaScript until normal reload.

### Read-only production observations, 24 October 2026

- API GET: nginx, 200, `Last-Modified: Fri, 16 Oct 2026 10:25:36 GMT`; no `Cache-Control`, `Expires`, `Age`, or Cloudflare cache-status header. Conditional GET with that timestamp: 304, still without `Cache-Control`. Both retained `Access-Control-Allow-Origin: *`.
- Worker entry: Cloudflare HIT, `Age: 1817`, `Cache-Control: max-age=2073600` (24 days). This is a separate app-update delivery risk.
- Root HTML and manifest: Cloudflare DYNAMIC, no explicit `Cache-Control` observed. DYNAMIC is not a browser freshness policy.
- The new loader succeeded in Chromium against the actual API cross-origin with `no-store`; minimum structure validation passed. Only the count (27), not data or stream URLs, was recorded.

These observations are **not** post-release verification. The historical affected browser is unavailable, installed historical worker versions cannot be established, and the exact file operators edited has not been confirmed. The historical incident cannot be attributed conclusively to one cause.

## Reproduction and safe local validation

Never run `npm run build` for local validation: it also publishes to `deploy_dev`. With installed dependencies:

```sh
npm test
npm run lint
./node_modules/.bin/eslint src/utils/camera-links.mjs
NODE_OPTIONS=--openssl-legacy-provider ./node_modules/.bin/quasar build -m pwa
npm run test:browser:cache
```

The last command needs Playwright/Chromium. `PLAYWRIGHT_MODULE` may point to an existing installation; no new dependency is required in production. It starts and closes its own local servers, serves `dist/pwa`, substitutes only the API URL in test-server JS responses, and uses a different-origin real HTTP fixture server. It never uses Playwright routing/interception, which would disable browser HTTP caching. Optional `CHECK_LIVE_API=1` adds a read-only browser/CORS check using the real loader; only list validity/count are printed.

The regression first mirrors production's eight-day-old `Last-Modified` with no freshness directive: Chromium retained A for a second default fetch **and normal reload** after the server changed to B; `no-store` and a fresh context saw B. CDP evidence identifies cached/network/service-worker delivery, response headers, requested fixture URLs and fixture identity without exposing production streams.

Then a real cacheable endpoint (`public, max-age=3600`) verifies the patched PWA in the **same browser context**: mount A, enable the installed worker, seed ordinary HTTP cache, change to B, and normal reload. Rendered title/player link and deep-link selection must become B, with no storage clearing and no CORS preflight. The open page retains A without polling before reload. Workbox caches static assets but not API JSON. A changed worker is installed/activated without reloading the page. An unavailable API shows error/retry, not cached camera data; a fully offline client-side remount also shows an honest error.

The existing `npm run test:browser` suite separately covers desktop/mobile camera navigation, fullscreen, capture, deep links and weather. Serve the build with a history-capable HTTP server and set `BASE_URL` (default `http://localhost:8093`). That suite requires `ffmpeg` and access to the weather widget; unlike the cache suite, it uses request interception for media/data fixtures.

### Existing PWA navigation issue, tracked separately

Local GenerateSW output confirms `createHandlerBoundToURL('/index.html')` while `quasar.conf.js` excludes HTML from precache. A full offline history navigation fails; this predates the freshness change. Static JS/CSS caching is preserved, and mounted-app offline API errors are covered independently. This is not evidence that Workbox caches camera JSON.

Smallest proposed follow-up: remove the HTML exclusion so `/index.html` participates in the precache used by the configured navigation fallback, then test online HTML update delivery and offline deep links together. That changes the app-shell caching contract and is deliberately **not applied in #10**, as allowed by the agreed plan; do not broaden this fix into a PWA rewrite.

## Approved release verification checklist — not yet performed

1. Obtain approval for the frontend release and the external endpoint policies/purge (if needed). No production mutation is authorized by local validation.
2. API operator publishes a controlled A→B change, or supplies a known safe changed field. Confirm it on the actual runtime URL, not the backup or `links3.json`.
3. Verify GET/conditional API headers (`no-store`, working CORS), worker entry (`no-cache`, no stale edge HIT/Age), HTML/manifest revalidation, and preserved immutable hashed-asset policies. Read headers using GET, not only HEAD.
4. In an existing browser profile, record the active worker script, update/install state and relevant Cache Storage entries. JSON must not be in Workbox caches. Do not indiscriminately unregister workers or delete caches. Historical workers with unexpected runtime routes require separate investigation.
5. Normally reload/remount the camera page without clearing storage: verify the known B field in both rendered title and player source, and confirm the request came from the network, not stale HTTP/worker cache. Verify deep links, fullscreen, play/pause intent and weather.
6. Simulate API failure/offline after the shell loads: verify an actionable error and retry after reconnection, not stale data labelled current. Verify worker updates separately without forcing playback-page reload.
7. Record release identifier, observed headers, browser/version and pass/fail results. Until then, external policies and production acceptance remain outstanding.
