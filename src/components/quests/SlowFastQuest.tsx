import { useState } from 'react'
import type { SlowFastConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { questHintClass } from './quest-ui'
import { MetronomeQuest } from './MetronomeQuest'

interface SlowFastQuestProps {
  config: SlowFastConfig
  onComplete: () => void
}

export function SlowFastQuest({ config, onComplete }: SlowFastQuestProps) {
  const { t } = useI18n()
  const q = t.quests.slowFast

  const [roundIndex, setRoundIndex] = useState(0)
  const round = config.rounds[roundIndex]

  if (!round) {
    onComplete()
    return null
  }

  return (
    <div className="space-y-4">
      <p className={questHintClass}>
        {q.roundHint(roundIndex + 1, config.rounds.length, round.bpm)}
      </p>
      <MetronomeQuest
        key={round.bpm}
        bpm={round.bpm}
        totalBeats={round.totalBeats}
        requiredHits={round.requiredHits}
        onComplete={() => {
          if (roundIndex + 1 >= config.rounds.length) {
            onComplete()
          } else {
            setRoundIndex((i) => i + 1)
          }
        }}
      />
    </div>
  )
}
