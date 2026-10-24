import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import compiler from 'vue-template-compiler'
import { loadComponent } from './helpers/load-component.mjs'

function nodes (path) {
  const sfc = compiler.parseComponent(readFileSync(new URL('../' + path, import.meta.url), 'utf8'))
  const compiled = compiler.compile(sfc.template.content)
  assert.deepEqual(compiled.errors, [])
  const walk = node => [node, ...(node.children || []).flatMap(walk), ...(node.ifConditions || []).slice(1).flatMap(condition => walk(condition.block))]
  return walk(compiled.ast)
}

test('camera cards have exactly one bottom capture button per video type, on either viewport', () => {
  const item = nodes('src/components/WebcamItem.vue')
  assert.equal(item.filter(node => node.attrsMap?.['aria-label'] === 'Capturar imagem').length, 0)
  const hls = item.find(node => node.tag === 'video-player')
  const youtube = item.find(node => node.tag === 'video-youtube')
  assert.equal(hls.attrsMap['capture-enabled'], '')
  assert.equal(hls.attrsMap['@capture-request'], "$emit('capture-image', index)")
  assert.equal(youtube.attrsMap['camera-controls'], '')
  assert.equal(youtube.attrsMap[':title'], 'beach.title')
  for (const path of ['src/components/VideoPlayer.vue', 'src/components/VideoYoutube.vue']) {
    const controls = nodes(path).filter(node => node.attrsMap?.class?.includes('custom-controls'))
    assert.equal(controls.length, 1)
    const capture = nodes(path).filter(node => node.attrsMap?.['aria-label'] === 'Capturar imagem')
    assert.equal((readFileSync(new URL('../' + path, import.meta.url), 'utf8').match(/<q-btn[^>]*aria-label="Capturar imagem"/g) || []).length, 1)
    assert.ok(!/mobile|fullscreen/i.test(capture[0].attrsMap['v-if'] || ''), 'no viewport-specific capture condition')
    assert.equal(capture[0].attrsMap.icon, 'camera_alt')
    assert.ok(['Capturar imagem'].includes(capture[0].attrsMap.title))
  }
  assert.equal(nodes('src/components/VideoPlayer.vue').find(node => node.attrsMap?.['aria-label'] === 'Capturar imagem').if, 'captureEnabled')
  assert.equal(nodes('src/components/VideoYoutube.vue').find(node => node.attrsMap?.class?.includes('youtube-controls')).if, 'cameraControls')
})

test('YouTube camera menu retains playback and route-aware sharing, but capture only explains the iframe limitation', async () => {
  const copied = []
  const calls = []
  const options = loadComponent('src/components/VideoYoutube.vue', {
    copyText: async value => copied.push(value),
    window: { location: { origin: 'https://huna.pt' } }
  })
  const component = {
    ...options.data(), cameraControls: true, anchor: 'camera-1', title: 'Praia',
    $route: { path: '/caparica' },
    $refs: { lazyVideo: { playVideo: () => calls.push('play'), pauseVideo: () => calls.push('pause'), resetView: () => calls.push('reset') } }
  }
  for (const [name, fn] of Object.entries(options.methods)) component[name] = fn.bind(component)
  component.play()
  component.pause()
  component.restart()
  assert.deepEqual(calls, ['play', 'pause', 'reset', 'play'])
  await component.copyCameraURL()
  assert.deepEqual(copied, ['https://huna.pt/caparica#camera-1'])
  assert.equal(component.showDialog, true)
  const menu = nodes('src/components/VideoYoutube.vue')
  assert.equal(menu.find(node => node.tag === 'socialSharing' && node.attrsMap[':path']).attrsMap[':path'], '$route.path')
  const capture = menu.find(node => node.attrsMap?.['aria-label'] === 'Capturar imagem')
  assert.equal(capture.attrsMap['@click'], 'showCaptureLimit = true')
  assert.equal(menu.find(node => node.attrsMap?.id === 'youtube-capture-message').children[0].text.includes('Não é possível capturar uma imagem'), true)
  assert.equal(menu.find(node => node.attrsMap?.role === 'alertdialog').attrsMap['aria-describedby'], 'youtube-capture-message')
  assert.equal(options.props.cameraControls.default, false, 'legacy consumers are unchanged')
})
