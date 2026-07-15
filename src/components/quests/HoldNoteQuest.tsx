import { useMemo } from 'react'
import { NOTE_C4_HZ } from '../../audio/pitch'
import type { PitchHoldConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { ConfigurablePitchHoldQuest } from './ConfigurablePitchHoldQuest'

interface HoldNoteQuestProps {
  onComplete: () => void
}

export function HoldNoteQuest({ onComplete }: HoldNoteQuestProps) {
  const { t } = useI18n()
  const q = t.quests.holdNote

  const config: PitchHoldConfig = useMemo(
    () => ({
      label: q.label,
      hz: NOTE_C4_HZ,
      toleranceCents: 80,
      holdMs: 2000,
    }),
    [q.label],
  )

  return <ConfigurablePitchHoldQuest config={config} onComplete={onComplete} />
}
