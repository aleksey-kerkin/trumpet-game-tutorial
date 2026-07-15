import { useMemo } from 'react'
import { NOTE_C4_HZ, NOTE_E4_HZ } from '../../audio/pitch'
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
      steps: [
        { label: q.steps.c4, hz: NOTE_C4_HZ },
        { label: q.steps.e4, hz: NOTE_E4_HZ },
      ],
      toleranceCents: 90,
      holdMs: 1500,
      successLabel: q.successLabel,
    }),
    [q.steps.c4, q.steps.e4, q.successLabel],
  )

  return <ConfigurablePitchSequenceQuest config={config} onComplete={onComplete} />
}
