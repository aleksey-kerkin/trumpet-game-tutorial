import { useMemo } from 'react'
import type { PitchHoldConfig } from '../../lessons/quest-config'
import { ConfigurablePitchHoldQuest } from './ConfigurablePitchHoldQuest'

interface HoldNoteQuestProps {
  onComplete: () => void
}

export function HoldNoteQuest({ onComplete }: HoldNoteQuestProps) {
  const config: PitchHoldConfig = useMemo(
    () => ({
      noteId: 'C4',
      toleranceCents: 80,
      holdMs: 2000,
      showStaff: true,
    }),
    [],
  )

  return <ConfigurablePitchHoldQuest config={config} onComplete={onComplete} />
}
