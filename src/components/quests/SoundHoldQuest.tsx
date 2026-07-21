import { useSoundHoldDetector, type SoundDetectorStatus } from '../../audio/useSoundHoldDetector'
import type { IconName } from '../icons'
import { BrutalIcon } from '../icons'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalPanel, BrutalProgress } from '../ui'

interface SoundHoldQuestProps {
  icon: IconName
  idleMessage: string
  listeningMessage: string
  successMessage: string
  errorMessage: string
  startLabel: string
  completeLabel: string
  holdMs?: number
  threshold?: number
  onComplete: () => void
}

export function SoundHoldQuest({
  icon,
  idleMessage,
  listeningMessage,
  successMessage,
  errorMessage,
  startLabel,
  completeLabel,
  holdMs,
  threshold,
  onComplete,
}: SoundHoldQuestProps) {
  const { t } = useI18n()
  const shared = t.quests.shared

  const { status, level, startListening, stopListening, reset } = useSoundHoldDetector({
    holdMs,
    threshold,
  })

  const message = messageForStatus(status, {
    idle: idleMessage,
    listening: listeningMessage,
    detected: successMessage,
    error: errorMessage,
  })

  return (
    <div className="space-y-6">
      <BrutalPanel className="p-6 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-md border-[3px] border-jazz-ink bg-jazz-brass text-main-foreground brutal-shadow-sm">
          <BrutalIcon name={icon} size="lg" />
        </div>
        <p className="mt-3 text-body font-medium leading-relaxed">{message}</p>
        {status === 'listening' && (
          <div className="mx-auto mt-4 max-w-xs">
            <BrutalProgress value={level * 100} max={100} variant="brass" />
          </div>
        )}
      </BrutalPanel>

      {status === 'idle' && (
        <BrutalButton variant="primary" fullWidth aria-pressed={false} onClick={() => void startListening()}>
          {startLabel}
        </BrutalButton>
      )}

      {status === 'listening' && (
        <BrutalButton variant="ghost" fullWidth aria-pressed={true} onClick={stopListening}>
          {shared.stop}
        </BrutalButton>
      )}

      {status === 'error' && (
        <BrutalButton variant="ghost" fullWidth onClick={reset}>
          {shared.tryAgain}
        </BrutalButton>
      )}

      {status === 'detected' && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {completeLabel}
        </BrutalButton>
      )}
    </div>
  )
}

function messageForStatus(
  status: SoundDetectorStatus,
  messages: Record<SoundDetectorStatus, string>,
): string {
  return messages[status]
}
