import { useCallback, useEffect, useRef, useState } from 'react'
import { useMicrophoneLevel } from '../../audio/useMicrophoneLevel'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalPanel, BrutalProgress, cn } from '../ui'
import { questHintClass } from './quest-ui'

const HOLD_MS = 900

interface CrescendoQuestProps {
  steps: number
  onComplete: () => void
}

export function CrescendoQuest({ steps, onComplete }: CrescendoQuestProps) {
  const { t } = useI18n()
  const q = t.quests.crescendo
  const shared = t.quests.shared

  const { status, level, start, stop, reset } = useMicrophoneLevel()
  const [stepIndex, setStepIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const holdStartRef = useRef<number | null>(null)

  const minLevel = 0.02 + stepIndex * 0.012
  const maxLevel = minLevel + 0.025

  useEffect(() => () => stop(), [stop])

  const handleLevel = useCallback(
    (rms: number) => {
      if (!started || finished) return
      const now = performance.now()
      const inRange = rms >= minLevel && rms <= maxLevel + 0.03

      if (inRange) {
        if (!holdStartRef.current) holdStartRef.current = now
        if (now - holdStartRef.current >= HOLD_MS) {
          holdStartRef.current = null
          if (stepIndex + 1 >= steps) {
            stop()
            setFinished(true)
          } else {
            setStepIndex((i) => i + 1)
          }
        }
      } else {
        holdStartRef.current = null
      }
    },
    [started, finished, minLevel, maxLevel, stepIndex, steps, stop],
  )

  const begin = async () => {
    holdStartRef.current = null
    setStarted(true)
    await start(handleLevel)
  }

  const meterPercent = Math.min(100, (level / (minLevel + 0.05)) * 80)

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint(steps)}</p>

      <div className="flex justify-center gap-1">
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-10 w-7 rounded-sm border-2 border-jazz-ink',
              i < stepIndex
                ? 'bg-jazz-success'
                : i === stepIndex
                  ? 'bg-jazz-brass brutal-shadow-sm'
                  : 'bg-jazz-surface-muted',
            )}
          />
        ))}
      </div>

      <BrutalPanel className="p-6">
        <BrutalProgress value={meterPercent} variant="brass" size="md" />
        <p className="mt-3 text-center brutal-type-label text-jazz-ink/70">
          {q.stepLabel(Math.min(stepIndex + 1, steps))}
        </p>
      </BrutalPanel>

      {!started && (
        <BrutalButton variant="primary" fullWidth onClick={() => void begin()}>
          {shared.startMicrophone}
        </BrutalButton>
      )}

      {started && !finished && (
        <BrutalButton
          variant="ghost"
          fullWidth
          onClick={() => {
            stop()
            setStarted(false)
          }}
        >
          {shared.stop}
        </BrutalButton>
      )}

      {status === 'error' && (
        <BrutalButton
          variant="ghost"
          fullWidth
          onClick={() => {
            reset()
            setStarted(false)
            setStepIndex(0)
          }}
        >
          {shared.tryAgain}
        </BrutalButton>
      )}

      {finished && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {q.completeButton}
        </BrutalButton>
      )}
    </div>
  )
}
