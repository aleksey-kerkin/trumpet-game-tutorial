import { useGameStore } from '../../game/store'
import type { StreakGateConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalCard, BrutalLink } from '../ui'
import { questHintClass } from './quest-ui'

interface StreakGateQuestProps {
  config: StreakGateConfig
  onComplete: () => void
}

export function StreakGateQuest({ config, onComplete }: StreakGateQuestProps) {
  const { t } = useI18n()
  const q = t.quests.streakGate
  const shared = t.quests.shared

  const streak = useGameStore((s) => s.streak)
  const { minStreak } = config
  const unlocked = streak >= minStreak

  return (
    <div className="space-y-6 text-center">
      <p className={questHintClass}>{q.hint(minStreak)}</p>

      <BrutalCard variant="surface" className="py-8">
        <div className="font-display text-display font-extrabold text-jazz-wine">{streak}</div>
        <div className="mt-2 text-body-sm font-bold text-jazz-ink/70">{q.progress(minStreak)}</div>
      </BrutalCard>

      {unlocked ? (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {q.successButton(minStreak)}
        </BrutalButton>
      ) : (
        <>
          <p className="brutal-type-hint">{q.lockedHint}</p>
          <BrutalLink to="/" variant="secondary" className="block w-full">
            {shared.backToQuestMap}
          </BrutalLink>
        </>
      )}
    </div>
  )
}
