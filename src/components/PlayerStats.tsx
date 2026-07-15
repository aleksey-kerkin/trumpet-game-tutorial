import { useState } from 'react'
import { xpProgressInLevel } from '../game/progress'
import { useGameStore } from '../game/store'
import { useI18n } from '../i18n'
import { BrutalButton, BrutalCard, BrutalConfirmDialog, BrutalProgress } from './ui'

export function PlayerStats() {
  const { t } = useI18n()
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const level = useGameStore((s) => s.getLevel())
  const resetProgress = useGameStore((s) => s.resetProgress)
  const { current, max } = xpProgressInLevel(xp)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleReset = () => {
    resetProgress()
    setConfirmOpen(false)
  }

  return (
    <>
      <BrutalCard className="flex flex-wrap items-center gap-4 py-3">
        <div className="min-w-20">
          <div className="brutal-type-label text-jazz-blue">{t.strings.level}</div>
          <div className="font-display text-3xl font-extrabold text-main-foreground">{level}</div>
        </div>
        <div className="min-w-36 flex-1">
          <div className="mb-1 flex justify-between brutal-type-label text-main-foreground/70">
            <span>XP</span>
            <span>
              {current}/{max}
            </span>
          </div>
          <BrutalProgress value={current} max={max} variant="brass" />
        </div>
        <div className="min-w-20 text-right">
          <div className="brutal-type-label text-jazz-blue">{t.strings.streak}</div>
          <div className="text-body font-bold text-jazz-success">
            {streak > 0 ? t.strings.streakDays(streak) : '—'}
          </div>
        </div>
        <BrutalButton variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          {t.strings.resetProgress}
        </BrutalButton>
      </BrutalCard>
      <BrutalConfirmDialog
        open={confirmOpen}
        title={t.strings.resetProgressConfirmTitle}
        message={t.strings.resetProgressConfirmMessage}
        confirmLabel={t.strings.resetProgressConfirm}
        cancelLabel={t.strings.cancel}
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
