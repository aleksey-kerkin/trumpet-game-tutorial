export {
  NOTE_G3_HZ,
  NOTE_C4_HZ,
  NOTE_D4_HZ,
  NOTE_E4_HZ,
  NOTE_F4_HZ,
  NOTE_G4_HZ,
} from './notes'

export function centsOffTarget(frequency: number, targetHz: number): number {
  if (frequency <= 0 || targetHz <= 0) return Number.POSITIVE_INFINITY
  return 1200 * Math.log2(frequency / targetHz)
}

export function medianFrequency(readings: number[]): number {
  const valid = readings.filter((value) => value > 0)
  if (!valid.length) return 0
  const sorted = [...valid].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function isInTune(frequency: number, targetHz: number, toleranceCents: number): boolean {
  return Math.abs(centsOffTarget(frequency, targetHz)) <= toleranceCents
}

export type TunerZone = 'cold' | 'warm' | 'hot' | 'silent'

export function tunerZone(frequency: number, targetHz: number, toleranceCents: number): TunerZone {
  if (frequency <= 0) return 'silent'
  const cents = Math.abs(centsOffTarget(frequency, targetHz))
  if (cents <= toleranceCents) return 'hot'
  if (cents <= toleranceCents * 2) return 'warm'
  return 'cold'
}
