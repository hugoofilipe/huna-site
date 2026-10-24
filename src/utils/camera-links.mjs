// Only the camera list bypasses HTTP caching; player and PWA asset policies stay independent.
export async function loadCameraLinks (url, { fetchImpl = globalThis.fetch, signal, timeoutMs = 15000 } = {}) {
  const controller = new AbortController()
  let timer
  let abort
  const interrupted = new Promise((resolve, reject) => {
    abort = () => {
      controller.abort()
      reject(new Error('Camera list request cancelled'))
    }
    if (signal) signal.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => {
      controller.abort()
      reject(new Error('Camera list request timed out'))
    }, timeoutMs)
  })
  try {
    if (signal && signal.aborted) abort()
    const request = async () => {
      const response = await fetchImpl(url, { cache: 'no-store', signal: controller.signal })
      if (!response.ok) throw new Error('Camera list HTTP error: ' + response.status)
      const cameras = await response.json()
      const anchors = new Set()
      // Forecast cards can have an empty source; playable cameras cannot.
      if (!Array.isArray(cameras) || !cameras.length || !cameras.every(camera => {
        if (!camera || !['anchor', 'title', 'type'].every(key => typeof camera[key] === 'string' && camera[key].trim())) return false
        if (!['application/x-mpegURL', 'video/youtube', 'previsoes'].includes(camera.type)) return false
        if (typeof camera.src !== 'string' || (camera.type !== 'previsoes' && !camera.src.trim()) || anchors.has(camera.anchor)) return false
        anchors.add(camera.anchor)
        return true
      })) throw new Error('Invalid camera list')
      return cameras
    }
    return await Promise.race([interrupted, request()])
  } finally {
    clearTimeout(timer)
    if (signal) signal.removeEventListener('abort', abort)
  }
}
