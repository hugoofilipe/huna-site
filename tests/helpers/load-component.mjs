import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import compiler from 'vue-template-compiler'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

// Mock imports by their local binding names in globals (e.g. videojs, axios).
// Returns the actual SFC options; callers can bind methods/computed to a state
// object or mount them with Vue. No DOM or bundler is needed.
export function loadComponent (relativePath, globals = {}) {
  const filename = resolve(root, relativePath)
  const sfc = compiler.parseComponent(readFileSync(filename, 'utf8'))
  if (!sfc.script) throw new Error('No script in ' + relativePath)
  const imports = {}
  const script = sfc.script.content
    .replace(/^import\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
    .replace(/^import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"]\s*;?\s*$/gm, (_, bindings) => {
      const named = bindings.match(/\{([^}]+)\}/)
      if (named) {
        for (const entry of named[1].split(',')) {
          const name = entry.trim().split(/\s+as\s+/).pop()
          if (name) imports[name] = {}
        }
      }
      const defaultName = bindings.split(',')[0].trim()
      if (/^[\w$]+$/.test(defaultName)) imports[defaultName] = {}
      return ''
    })
    .replace(/\bexport default\b/, 'module.exports =')
  const context = vm.createContext({
    console, URL, setTimeout, clearTimeout, ...imports, ...globals, module: { exports: {} }
  })
  new vm.Script(script, { filename }).runInContext(context)
  return context.module.exports
}
