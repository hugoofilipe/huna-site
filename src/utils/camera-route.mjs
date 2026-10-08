export function isCameraPath (path) {
  return /^\/(cam|caparica)\/?$/.test(path || '')
}

export function isCaparicaPath (path) {
  return /^\/caparica\/?$/.test(path || '')
}

export function cameraAnchorFromHash (hash) {
  if (!hash || hash.charAt(0) !== '#') return null
  try {
    return decodeURIComponent(hash.slice(1)) || null
  } catch (error) {
    return null
  }
}

// Camera pages own hash positioning (Cam4 waits for the cameras and applies
// the measured header offset), so the router must not scroll them itself.
export function scrollBehavior (to) {
  if (to.hash) return isCameraPath(to.path) ? false : { selector: to.hash }
  return { x: 0, y: 0 }
}
