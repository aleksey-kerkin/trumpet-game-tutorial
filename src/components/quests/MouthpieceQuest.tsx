import { useI18n } from '../../i18n'
import { SoundHoldQuest } from './SoundHoldQuest'

interface MouthpieceQuestProps {
  onComplete: () => void
}

export function MouthpieceQuest({ onComplete }: MouthpieceQuestProps) {
  const { t } = useI18n()
  const q = t.quests.mouthpiece
  const shared = t.quests.shared

  return (
    <SoundHoldQuest
      icon="mouthpiece"
      idleMessage={q.idleMessage}
      listeningMessage={q.listeningMessage}
      successMessage={q.successMessage}
      errorMessage={q.errorMessage}
      startLabel={shared.startMicrophone}
      completeLabel={q.completeLabel}
      holdMs={1000}
      threshold={0.015}
      onComplete={onComplete}
    />
  )
}
