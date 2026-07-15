import { useI18n } from '../../i18n'
import { SoundHoldQuest } from './SoundHoldQuest'

interface BuzzQuestProps {
  onComplete: () => void
}

export function BuzzQuest({ onComplete }: BuzzQuestProps) {
  const { t } = useI18n()
  const q = t.quests.buzz
  const shared = t.quests.shared

  return (
    <SoundHoldQuest
      icon="lips"
      idleMessage={q.idleMessage}
      listeningMessage={q.listeningMessage}
      successMessage={q.successMessage}
      errorMessage={q.errorMessage}
      startLabel={shared.startMicrophone}
      completeLabel={q.completeLabel}
      onComplete={onComplete}
    />
  )
}
