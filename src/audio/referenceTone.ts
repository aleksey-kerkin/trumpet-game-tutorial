let referenceContext: AudioContext | null = null

export async function playReferenceTone(frequencyHz: number, durationSec = 0.6): Promise<void> {
  if (!referenceContext) referenceContext = new AudioContext()
  if (referenceContext.state === 'suspended') await referenceContext.resume()

  const ctx = referenceContext
  const time = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequencyHz
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(0.15, time + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(time)
  osc.stop(time + durationSec + 0.05)
}
