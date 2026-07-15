import { useState } from 'react'
import type { ComplexFlowConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { ChecklistQuest } from './ChecklistQuest'
import { ConfigurablePitchSequenceQuest } from './ConfigurablePitchSequenceQuest'

interface ComplexFlowQuestProps {
  config: ComplexFlowConfig
  onComplete: () => void
}

export function ComplexFlowQuest({ config, onComplete }: ComplexFlowQuestProps) {
  const { t } = useI18n()
  const q = t.quests.complexFlow

  const [phase, setPhase] = useState<'warmup' | 'sequence'>('warmup')

  if (phase === 'warmup') {
    return (
      <div className="space-y-4">
        <p className="brutal-type-label text-main">{q.warmupStepTitle}</p>
        <ChecklistQuest
          config={config.warmup}
          onComplete={() => setPhase('sequence')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="brutal-type-label text-main">{q.sequenceStepTitle}</p>
      <ConfigurablePitchSequenceQuest config={config.sequence} onComplete={onComplete} />
    </div>
  )
}
