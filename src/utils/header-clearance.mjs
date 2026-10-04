export function visibleHeaderClearance (rect, viewportHeight) {
  if (!rect || rect.width <= 0 || rect.height <= 0 || rect.top >= viewportHeight) return 0
  return Math.max(0, Math.min(rect.bottom, viewportHeight))
}

export function observeHeaderClearance (header, update) {
  let frame = null
  let transitioning = false
  const measure = () => {
    const rect = header.getBoundingClientRect()
    update(visibleHeaderClearance(rect, window.innerHeight), rect.height)
  }
  const tick = () => {
    frame = null
    measure()
    if (transitioning) schedule()
  }
  const schedule = () => {
    if (frame === null) frame = window.requestAnimationFrame(tick)
  }
  const start = event => {
    if (event.target !== header) return
    transitioning = true
    schedule()
  }
  const end = event => {
    if (event.target !== header) return
    transitioning = false
    schedule()
  }
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
  if (observer) observer.observe(header)
  window.addEventListener('resize', schedule)
  window.addEventListener('scroll', schedule, { passive: true })
  header.addEventListener('transitionrun', start)
  header.addEventListener('transitionend', end)
  header.addEventListener('transitioncancel', end)
  measure()
  return () => {
    if (observer) observer.disconnect()
    if (frame !== null) window.cancelAnimationFrame(frame)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('scroll', schedule)
    header.removeEventListener('transitionrun', start)
    header.removeEventListener('transitionend', end)
    header.removeEventListener('transitioncancel', end)
  }
}
