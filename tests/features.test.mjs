import assert from 'node:assert/strict'
import test from 'node:test'
import { features } from '../src/config/features.mjs'

test('every feature switch is a literal true or false, never a quoted string', () => {
  assert.ok(Object.keys(features).length > 0)
  for (const [name, value] of Object.entries(features)) {
    assert.equal(typeof value, 'boolean', name + ' must be true or false, without quotes')
  }
})

test('the real-estate ad popup has its own switch', () => {
  assert.ok('realEstateAdPopup' in features)
})
