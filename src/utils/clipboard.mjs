export async function copyText (text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (error) {
      // LAN previews can lack clipboard permissions; use the legacy fallback.
    }
  }
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.left = '-9999px'
  document.body.appendChild(field)
  try {
    field.select()
    if (!document.execCommand('copy')) throw new Error('Clipboard unavailable')
  } finally {
    field.remove()
  }
}
