import { useMemo } from 'react'
import type { PitchSequenceConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { ConfigurablePitchSequenceQuest } from './ConfigurablePitchSequenceQuest'

interface TwoNotesQuestProps {
  onComplete: () => void
}

export function TwoNotesQuest({ onComplete }: TwoNotesQuestProps) {
  const { t } = useI18n()
  const q = t.quests.twoNotes

  const config: PitchSequenceConfig = useMemo(
    () => ({
      steps: [{ noteId: 'C4' }, { noteId: 'E4' }],
      toleranceCents: 90,
      holdMs: 1500,
      successLabel: q.successLabel,
      showStaff: true,
    }),
    [q.successLabel],
  )

  return <ConfigurablePitchSequenceQuest config={config} onComplete={onComplete} />
}
