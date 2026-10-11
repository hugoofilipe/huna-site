import assert from 'node:assert/strict'
import test from 'node:test'
import { isCameraPath, isCaparicaPath, cameraAnchorFromHash, scrollBehavior } from '../src/utils/camera-route.mjs'

test('camera route detection accepts both camera paths with optional trailing slash only', () => {
  for (const path of ['/cam', '/cam/', '/caparica', '/caparica/']) assert.equal(isCameraPath(path), true, path)
  for (const path of ['/cam1', '/cam//', '/caparica/x', '/peniche', '/', '', undefined]) assert.equal(isCameraPath(path), false, String(path))
  assert.equal(isCaparicaPath('/caparica'), true)
  assert.equal(isCaparicaPath('/caparica/'), true)
  assert.equal(isCaparicaPath('/cam'), false)
  assert.equal(isCaparicaPath('/cam/'), false)
})

test('fragments are decoded once and invalid ones are ignored', () => {
  assert.equal(cameraAnchorFromHash('#camera-1'), 'camera-1')
  assert.equal(cameraAnchorFromHash('#a%20b'), 'a b')
  assert.equal(cameraAnchorFromHash('#a%2520b'), 'a%20b')
  for (const hash of ['', '#', '#%E0%A4%A', 'camera', undefined, null]) assert.equal(cameraAnchorFromHash(hash), null, String(hash))
})

test('router leaves camera hashes to the page and keeps other behavior unchanged', () => {
  for (const path of ['/cam', '/cam/', '/caparica', '/caparica/']) {
    assert.equal(scrollBehavior({ path, hash: '#camera-1' }, {}, { x: 0, y: 500 }), false, path)
  }
  assert.deepEqual(scrollBehavior({ path: '/', hash: '#welcome' }), { selector: '#welcome' })
  assert.deepEqual(scrollBehavior({ path: '/cam1', hash: '#x' }), { selector: '#x' })
  assert.deepEqual(scrollBehavior({ path: '/caparica', hash: '' }, {}, { x: 0, y: 500 }), { x: 0, y: 0 })
  assert.deepEqual(scrollBehavior({ path: '/portfolio', hash: '' }), { x: 0, y: 0 })
})
