import { BrutalIcon } from '../icons'
import { useI18n } from '../../i18n'
import { BrutalBadge, BrutalProgress } from '../ui'

export const questHintClass = 'brutal-type-hint'

interface HoldProgressProps {
  progress: number
  label?: string
}

export function HoldProgress({ progress, label }: HoldProgressProps) {
  const { t } = useI18n()
  const displayLabel = label ?? t.quests.shared.holdProgress

  return (
    <div>
      <div className="mb-1 brutal-type-label text-foreground-muted">{displayLabel}</div>
      <BrutalProgress value={progress * 100} max={100} variant="success" />
    </div>
  )
}

interface StepBadgesProps {
  labels: string[]
  currentIndex: number
}

export function StepBadges({ labels, currentIndex }: StepBadgesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {labels.map((label, index) => (
        <BrutalBadge
          key={`${label}-${index}`}
          variant={
            index < currentIndex ? 'completed' : index === currentIndex ? 'brass' : 'locked'
          }
          className={
            index < currentIndex
              ? 'inline-flex items-center gap-1'
              : undefined
          }
        >
          {index < currentIndex && <BrutalIcon name="check" size="xs" />}
          {label}
        </BrutalBadge>
      ))}
    </div>
  )
}
