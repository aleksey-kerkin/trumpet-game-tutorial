let referenceContext: AudioContext | null = null

const ATTACK_SEC = 0.05
const RELEASE_SEC = 0.25
const DEFAULT_DURATION_SEC = 1.4
const PEAK_GAIN = 0.15

export async function playReferenceTone(
  frequencyHz: number,
  durationSec = DEFAULT_DURATION_SEC,
): Promise<void> {
  if (!referenceContext) referenceContext = new AudioContext()
  if (referenceContext.state === 'suspended') await referenceContext.resume()

  const ctx = referenceContext
  const time = ctx.currentTime
  const releaseStart = time + Math.max(ATTACK_SEC, durationSec - RELEASE_SEC)
  const stopTime = time + durationSec + 0.05

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequencyHz
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, time + ATTACK_SEC)
  gain.gain.setValueAtTime(PEAK_GAIN, releaseStart)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(time)
  osc.stop(stopTime)
}
