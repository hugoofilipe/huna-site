import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import compiler from 'vue-template-compiler'
import { loadComponent } from './helpers/load-component.mjs'
import { isCaparicaPath } from '../src/utils/camera-route.mjs'

function templateNodes (path) {
  const sfc = compiler.parseComponent(readFileSync(new URL('../' + path, import.meta.url), 'utf8'))
  const compiled = compiler.compile(sfc.template.content)
  assert.equal(compiled.errors.length, 0)
  const walk = node => [node, ...(node.children || []).flatMap(walk), ...(node.ifConditions || []).slice(1).flatMap(condition => walk(condition.block))]
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

test('only Caparica opts shared HLS players into fullscreen auto-hide; never YouTube', () => {
  const page = loadComponent('src/pages/Cam4.vue', { isCaparicaPath })
  for (const path of ['/cam', '/cam/', '/caparica', '/caparica/']) {
    assert.equal(page.computed.fullscreenControlsAutoHide.call({ $route: { path } }), path.startsWith('/caparica'))
  }
  const item = templateNodes('src/pages/Cam4.vue').find(node => node.tag === 'webcam-item')
  assert.equal(item.attrsMap[':fullscreen-controls-auto-hide'], 'fullscreenControlsAutoHide')
  assert.equal(loadComponent('src/components/WebcamItem.vue').props.fullscreenControlsAutoHide.default, false)
  const nodes = templateNodes('src/components/WebcamItem.vue')
  assert.equal(nodes.find(node => node.tag === 'video-player').attrsMap[':fullscreen-controls-auto-hide'], 'fullscreenControlsAutoHide')
  assert.equal(nodes.find(node => node.tag === 'video-youtube').attrsMap[':fullscreen-controls-auto-hide'], undefined)
  for (const path of ['src/pages/Peniche.vue', 'src/pages/Cam1.vue', 'src/pages/Cam3.vue']) {
    for (const node of templateNodes(path).filter(node => node.tag === 'video-player')) {
      assert.equal(node.attrsMap[':fullscreen-controls-auto-hide'], undefined)
      assert.equal(node.attrsMap['fullscreen-controls-auto-hide'], undefined)
    }
  }
})

test('WebcamItem opts in to capture and forwards displayed identity and events', () => {
  const player = templateNodes('src/components/WebcamItem.vue').find(node => node.tag === 'video-player')
  assert.equal(player.attrsMap['capture-enabled'], '')
  assert.equal(player.attrsMap[':displayed-camera'], 'displayedCamera || beach')
  assert.equal(player.attrsMap['@capture-request'], "$emit('capture-image', index)")
})
