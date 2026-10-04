import assert from 'node:assert/strict'
import test from 'node:test'
import { copyText } from '../src/utils/clipboard.mjs'

test('copy link works with clipboard permissions or a LAN fallback', async () => {
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  let copied
  let removed = false
  let successful = true
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { clipboard: { writeText: async text => { copied = text } } }
  })
  globalThis.document = {
    createElement: () => ({
      style: {},
      setAttribute () {},
      select () { copied = this.value },
      remove () { removed = true }
    }),
    body: { appendChild () {} },
    execCommand: command => command === 'copy' && successful
  }
  try {
    await copyText('https://example.com/caparica#camera')
    assert.equal(copied, 'https://example.com/caparica#camera')
    navigator.clipboard.writeText = async () => { throw new Error('Denied') }
    await copyText('http://192.168.1.136:8093/caparica#camera')
    assert.equal(copied, 'http://192.168.1.136:8093/caparica#camera')
    assert.equal(removed, true)
    delete navigator.clipboard
    removed = false
    successful = false
    await assert.rejects(copyText('test'), /Clipboard unavailable/)
    assert.equal(removed, true)
  } finally {
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor)
    else delete globalThis.navigator
    delete globalThis.document
  }
})
