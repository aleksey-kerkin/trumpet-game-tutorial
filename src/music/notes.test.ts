import { describe, expect, it } from 'vitest'
import { getConcertHz, getNoteHz, staffRenderWidth } from './notes'

describe('getNoteHz', () => {
  it('returns written trumpet pitch for C4', () => {
    expect(getNoteHz('C4')).toBeCloseTo(261.63, 1)
  })
})

describe('getConcertHz', () => {
  it('transposes Bb trumpet written C4 down 2 semitones', () => {
    expect(getConcertHz('C4')).toBeCloseTo(233.08, 1)
  })

  it('is lower than written pitch', () => {
    expect(getConcertHz('C4')).toBeLessThan(getNoteHz('C4'))
  })
})

describe('staffRenderWidth', () => {
  it('uses compact width for a single note', () => {
    expect(staffRenderWidth(1, 800)).toBe(260)
  })

  it('caps width at container size', () => {
    expect(staffRenderWidth(1, 200)).toBe(200)
  })

  it('never exceeds 640px', () => {
    expect(staffRenderWidth(10, 2000)).toBeLessThanOrEqual(640)
  })
})
