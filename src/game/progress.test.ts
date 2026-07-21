import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computeStreak, levelFromXp, xpProgressInLevel } from './progress'

describe('levelFromXp', () => {
  it('starts at level 1 with zero xp', () => {
    expect(levelFromXp(0)).toBe(1)
  })

  it('increments level every 100 xp', () => {
    expect(levelFromXp(100)).toBe(2)
    expect(levelFromXp(250)).toBe(3)
  })
})

describe('xpProgressInLevel', () => {
  it('tracks progress within current level', () => {
    expect(xpProgressInLevel(150)).toEqual({ current: 50, max: 100 })
  })
})

describe('computeStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-21T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at 1 with no prior play date', () => {
    expect(computeStreak(null, 0)).toBe(1)
  })

  it('keeps streak when already played today', () => {
    expect(computeStreak('2026-07-21', 5)).toBe(5)
  })

  it('increments streak on consecutive days', () => {
    expect(computeStreak('2026-07-20', 3)).toBe(4)
  })

  it('resets streak after a gap', () => {
    expect(computeStreak('2026-07-19', 10)).toBe(1)
  })
})
