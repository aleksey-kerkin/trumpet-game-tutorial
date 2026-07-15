const XP_PER_LEVEL = 100

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpProgressInLevel(xp: number): { current: number; max: number } {
  const current = xp % XP_PER_LEVEL
  return { current, max: XP_PER_LEVEL }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function computeStreak(lastPlayedDate: string | null, currentStreak: number): number {
  if (!lastPlayedDate) return 1

  const today = todayKey()
  if (lastPlayedDate === today) return currentStreak

  const last = new Date(`${lastPlayedDate}T12:00:00`)
  const now = new Date(`${today}T12:00:00`)
  const diffDays = Math.round((now.getTime() - last.getTime()) / 86_400_000)

  if (diffDays === 1) return currentStreak + 1
  return 1
}
