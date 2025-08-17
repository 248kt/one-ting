export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  const mm = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}