export function findCamera (webcams, index, step, fullscreen = false) {
  if (step !== -1 && step !== 1) return -1
  for (let i = index + step; i >= 0 && i < webcams.length; i += step) {
    const type = webcams[i].type
    if (fullscreen ? type === 'application/x-mpegURL' : type !== 'previsoes') return i
  }
  return -1
}
