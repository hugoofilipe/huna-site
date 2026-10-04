import assert from 'node:assert/strict'
import test from 'node:test'
import { visibleHeaderClearance, observeHeaderClearance } from '../src/utils/header-clearance.mjs'

test('clearance follows actual header reveal, landscape hiding, and short viewports', () => {
  assert.equal(visibleHeaderClearance({ top: 0, bottom: 92, height: 92, width: 390 }, 844), 92)
  assert.equal(visibleHeaderClearance({ top: -92, bottom: 0, height: 92, width: 390 }, 844), 0)
  assert.equal(visibleHeaderClearance({ top: -40, bottom: 52, height: 92, width: 390 }, 844), 52)
  assert.equal(visibleHeaderClearance({ top: 0, bottom: 0, height: 0, width: 844 }, 390), 0)
  assert.equal(visibleHeaderClearance({ top: 0, bottom: 92, height: 92, width: 390 }, 60), 60)
})

test('header observer tracks transforms/resizing and cleans up listeners and frames', () => {
  const frames = new Map()
  const events = new Map()
  const headerEvents = new Map()
  let rect = { top: 0, bottom: 92, height: 92, width: 390 }
  let resized
  let disconnected = false
  globalThis.window = {
    innerHeight: 844,
    requestAnimationFrame: fn => { const id = {}; frames.set(id, fn); return id },
    cancelAnimationFrame: id => frames.delete(id),
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: name => events.delete(name)
  }
  globalThis.ResizeObserver = class {
    constructor (fn) { resized = fn }
    observe () {}
    disconnect () { disconnected = true }
  }
  const header = {
    getBoundingClientRect: () => rect,
    addEventListener: (name, fn) => headerEvents.set(name, fn),
    removeEventListener: name => headerEvents.delete(name)
  }
  const values = []
  const tick = () => { const [id, fn] = frames.entries().next().value; frames.delete(id); fn() }
  try {
    const stop = observeHeaderClearance(header, (...value) => values.push(value))
    assert.deepEqual(values.at(-1), [92, 92])
    rect = { ...rect, top: -92, bottom: 0 }
    headerEvents.get('transitionrun')({ target: header })
    tick()
    assert.deepEqual(values.at(-1), [0, 92])
    headerEvents.get('transitionend')({ target: header })
    tick()
    rect = { ...rect, height: 0 }
    resized()
    tick()
    assert.deepEqual(values.at(-1), [0, 0])
    events.get('resize')()
    stop()
    assert.equal(frames.size, 0)
    assert.equal(events.size, 0)
    assert.equal(headerEvents.size, 0)
    assert.equal(disconnected, true)
  } finally {
    delete globalThis.window
    delete globalThis.ResizeObserver
  }
})
