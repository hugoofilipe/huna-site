import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import compiler from 'vue-template-compiler'
import { loadComponent } from './helpers/load-component.mjs'

function templateNodes (path) {
  const sfc = compiler.parseComponent(readFileSync(new URL('../' + path, import.meta.url), 'utf8'))
  const compiled = compiler.compile(sfc.template.content)
  assert.equal(compiled.errors.length, 0)
  const walk = node => [node, ...(node.children || []).flatMap(walk)]
  return walk(compiled.ast)
}

test('legacy Peniche/Cam1/Cam3 players cannot expose unsupported capture controls', () => {
  const player = loadComponent('src/components/VideoPlayer.vue')
  assert.equal(player.props.captureEnabled.default, false)
  for (const path of ['src/pages/Peniche.vue', 'src/pages/Cam1.vue', 'src/pages/Cam3.vue']) {
    const players = templateNodes(path).filter(node => node.tag === 'video-player')
    assert.ok(players.length > 0)
    for (const consumer of players) {
      assert.equal(consumer.attrsMap['capture-enabled'], undefined)
      assert.equal(consumer.attrsMap[':capture-enabled'], undefined)
    }
  }
})

test('WebcamItem opts in to capture and forwards displayed identity and events', () => {
  const player = templateNodes('src/components/WebcamItem.vue').find(node => node.tag === 'video-player')
  assert.equal(player.attrsMap['capture-enabled'], '')
  assert.equal(player.attrsMap[':displayed-camera'], 'displayedCamera || beach')
  assert.equal(player.attrsMap['@capture-request'], "$emit('capture-image', index)")
})
