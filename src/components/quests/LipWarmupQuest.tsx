import { useMemo } from 'react'
import type { ChecklistConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { ChecklistQuest } from './ChecklistQuest'

interface LipWarmupQuestProps {
  onComplete: () => void
}

export function LipWarmupQuest({ onComplete }: LipWarmupQuestProps) {
  const { t } = useI18n()
  const q = t.quests.lipWarmup

  const config: ChecklistConfig = useMemo(
    () => ({
      successLabel: q.successLabel,
      items: [
        {
          id: 'massage',
          label: q.items.massage.label,
          hint: q.items.massage.hint,
          seconds: 15,
        },
        {
          id: 'rr',
          label: q.items.rr.label,
          hint: q.items.rr.hint,
          seconds: 15,
        },
        {
          id: 'buzz',
          label: q.items.buzz.label,
          hint: q.items.buzz.hint,
          seconds: 30,
        },
        {
          id: 'stretch',
          label: q.items.stretch.label,
          hint: q.items.stretch.hint,
          seconds: 10,
        },
      ],
    }),
    [q],
  )

  return <ChecklistQuest config={config} onComplete={onComplete} />
}
