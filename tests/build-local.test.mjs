import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { loadComponent } from './helpers/load-component.mjs'

test('Portfolio uses Vue 2 data with independent expandable card state', () => {
  const options = loadComponent('src/pages/Portfolio.vue')
  const first = options.data()
  const second = options.data()
  assert.equal(first.expanded, false)
  first.expanded = !first.expanded
  assert.equal(first.expanded, true)
  assert.equal(second.expanded, false)
  assert.ok(first.lorem.length > 0)
  assert.equal(options.setup, undefined)
})

test('local build runs Quasar only while deployment reuses the same build step', () => {
  const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
  const pkg = JSON.parse(read('package.json'))
  assert.equal(pkg.scripts['build:local'], 'sh ./scripts/build_pwa.sh')
  assert.equal(pkg.scripts.build, 'sh ./scripts/build_deploy.sh')
  const local = read('scripts/build_pwa.sh')
  assert.match(local, /node_modules\/\.bin\/quasar" build -m pwa/)
  assert.match(local, /--openssl-legacy-provider/)
  assert.doesNotMatch(local, /\bgit\b|build_deploy|\brm\b/)
  assert.match(read('scripts/build_deploy.sh'), /sh "\$ROOT_DIR\/scripts\/build_pwa.sh"/)
})
