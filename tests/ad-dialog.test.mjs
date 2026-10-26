import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { loadComponent } from './helpers/load-component.mjs'

const options = loadComponent('src/components/AdDialog.vue')
const source = readFileSync(new URL('../src/components/AdDialog.vue', import.meta.url), 'utf8')
const defaults = { posterDesktop: options.props.posterDesktop.default, posterMobile: options.props.posterMobile.default }

test('the mobile poster is used on mobile and the desktop poster otherwise', () => {
  assert.equal(options.computed.poster.call({ ...defaults, mobile: true }), '/images/poster_bg_mobile.png')
  assert.equal(options.computed.poster.call({ ...defaults, mobile: false }), '/images/poster_bg.png')
  assert.equal(options.computed.poster.call({ posterDesktop: 'a.png', posterMobile: 'b.png', mobile: true }), 'b.png')
})

test('the default posters are absolute paths to files that ship with the site', () => {
  for (const url of Object.values(defaults)) {
    assert.match(url, /^\/images\/[\w-]+\.png$/, 'absolute, so /caparica/ with a trailing slash works too')
    assert.ok(existsSync(new URL('../public' + url, import.meta.url)), url + ' is missing from public/')
  }
})

test('the dialog follows v-model and both buttons close it', () => {
  assert.match(source, /<q-dialog :value="value" persistent @input="\$emit\('input', \$event\)">/)
  assert.equal(source.match(/v-close-popup/g).length, 2)
  assert.match(source, /label="Não tenho tempo"/)
  assert.match(source, /aria-label="Fechar anúncio"/)
})

test('a poster that cannot load closes the popup instead of leaving an empty card', () => {
  assert.match(source, /<img[^>]*@error="\$emit\('input', false\)"/)
})

test('the card announces itself as a dialog and the poster carries the ad text', () => {
  assert.match(source, /<q-card[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-label="Anúncio imobiliário"/)
  assert.match(source, /alt="Vendo a tua casa\./)
})
