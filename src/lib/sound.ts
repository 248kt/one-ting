let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx!
}

export async function beep(freq = 880, ms = 120, vol = 0.03) {
  const audio = getCtx()
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = vol
  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start()
  await new Promise(r => setTimeout(r, ms))
  osc.stop()
}

export async function chime() {
  await beep(880, 100)
  await beep(1320, 140)
}