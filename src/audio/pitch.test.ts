import { describe, expect, it } from 'vitest'
import {
  centsOffTarget,
  foldToNearestOctave,
  isInTune,
  medianFrequency,
  tunerZone,
} from './pitch'

describe('centsOffTarget', () => {
  it('returns 0 for exact match', () => {
    expect(centsOffTarget(440, 440)).toBe(0)
  })

  it('returns infinity for invalid input', () => {
    expect(centsOffTarget(0, 440)).toBe(Number.POSITIVE_INFINITY)
  })
})

describe('foldToNearestOctave', () => {
  it('folds octave harmonic to target', () => {
    expect(foldToNearestOctave(466, 233)).toBeCloseTo(233, 0)
  })

  it('leaves in-range frequency unchanged', () => {
    expect(foldToNearestOctave(235, 233)).toBeCloseTo(235, 0)
  })
})

describe('medianFrequency', () => {
  it('returns median of valid readings', () => {
    expect(medianFrequency([0, 220, 240, 230])).toBe(230)
  })

  it('returns 0 when no valid readings', () => {
    expect(medianFrequency([0, -1])).toBe(0)
  })
})

describe('isInTune', () => {
  it('accepts frequency within tolerance', () => {
    expect(isInTune(233, 233, 80)).toBe(true)
  })

  it('rejects frequency outside tolerance', () => {
    expect(isInTune(200, 233, 80)).toBe(false)
  })
})

describe('tunerZone', () => {
  it('returns silent for no signal', () => {
    expect(tunerZone(0, 233, 80)).toBe('silent')
  })

  it('returns hot when in tune', () => {
    expect(tunerZone(233, 233, 80)).toBe('hot')
  })

  it('returns warm when close', () => {
    expect(tunerZone(250, 233, 80)).toBe('warm')
  })

  it('returns cold when far', () => {
    expect(tunerZone(180, 233, 80)).toBe('cold')
  })
})
