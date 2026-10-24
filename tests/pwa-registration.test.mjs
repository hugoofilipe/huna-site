import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'

test('registration bypasses worker HTTP cache and checks only its own registration without reloading', async () => {
  let callbacks
  const source = readFileSync(new URL('../src-pwa/register-service-worker.js', import.meta.url), 'utf8')
    .replace(/^import .*$/m, '')
  vm.runInNewContext(source, {
    process: { env: { SERVICE_WORKER_FILE: '/service-worker.js' } },
    register: (url, options) => { assert.equal(url, '/service-worker.js'); callbacks = options }
  })
  assert.equal(callbacks.registrationOptions.updateViaCache, 'none')
  assert.equal(callbacks.forceSWupdate, undefined)
  let calls = 0
  callbacks.registered({ update: () => { calls++; return Promise.reject(new Error('Offline')) } })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(calls, 1)
  callbacks.updated({}) // No reload/global cache removal APIs are available in this sandbox.
})
