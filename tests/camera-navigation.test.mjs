import assert from 'node:assert/strict'
import test from 'node:test'
import { findCamera } from '../src/utils/camera-navigation.mjs'

const webcams = [
  { type: 'application/x-mpegURL' },
  { type: 'previsoes' },
  { type: 'video/youtube' },
  { type: 'application/x-mpegURL' },
  { type: 'previsoes' }
]

test('camera navigation skips forecasts and respects list boundaries', () => {
  assert.equal(findCamera(webcams, 0, -1), -1)
  assert.equal(findCamera(webcams, 0, 1), 2)
  assert.equal(findCamera(webcams, 3, -1), 2)
  assert.equal(findCamera(webcams, 3, 1), -1)
  assert.equal(findCamera([], 0, 1), -1)
  assert.equal(findCamera(webcams, 0, 0), -1)
})

test('fullscreen source switches only navigate compatible HLS cameras', () => {
  assert.equal(findCamera(webcams, 0, 1, true), 3)
  assert.equal(findCamera(webcams, 3, -1, true), 0)
  assert.equal(findCamera(webcams, 0, -1, true), -1)
  assert.equal(findCamera(webcams, 3, 1, true), -1)
})
