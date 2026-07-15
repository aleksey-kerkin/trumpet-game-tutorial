import { useCallback, useEffect, useRef, useState } from 'react'
import { useMicrophoneLevel } from '../../audio/useMicrophoneLevel'
import { BrutalIcon } from '../icons'
import { useI18n } from '../../i18n'
import { BrutalBadge, BrutalButton, BrutalPanel, BrutalProgress } from '../ui'
import { questHintClass } from './quest-ui'

const NOISE_FLOOR = 0.012
const QUIET_MAX = 0.038
const LOUD_MIN = 0.065
const HOLD_MS = 1200

type Phase = 'idle' | 'quiet' | 'loud' | 'done' | 'error'

interface DynamicsQuestProps {
  onComplete: () => void
}

export function DynamicsQuest({ onComplete }: DynamicsQuestProps) {
  const { t } = useI18n()
  const q = t.quests.dynamics
  const shared = t.quests.shared

  const { status, level, start, stop, reset } = useMicrophoneLevel()
  const [phase, setPhase] = useState<Phase>('idle')
  const holdStartRef = useRef<number | null>(null)

  useEffect(() => () => stop(), [stop])

  const handleLevel = useCallback(
    (rms: number) => {
      if (phase !== 'quiet' && phase !== 'loud') return

      const now = performance.now()

      if (phase === 'quiet') {
        const inRange = rms >= NOISE_FLOOR && rms <= QUIET_MAX
        if (inRange) {
          if (!holdStartRef.current) holdStartRef.current = now
          if (now - holdStartRef.current >= HOLD_MS) {
            holdStartRef.current = null
            setPhase('loud')
          }
        } else {
          holdStartRef.current = null
        }
        return
      }

      if (rms >= LOUD_MIN) {
        if (!holdStartRef.current) holdStartRef.current = now
        if (now - holdStartRef.current >= HOLD_MS) {
          holdStartRef.current = null
          stop()
          setPhase('done')
        }
      } else {
        holdStartRef.current = null
      }
    },
    [phase, stop],
  )

  const begin = async () => {
    holdStartRef.current = null
    setPhase('quiet')
    await start(handleLevel)
  }

  const meterPercent = Math.min(100, (level / LOUD_MIN) * 70)

  const hint =
    phase === 'idle'
      ? q.hints.idle
      : phase === 'quiet'
        ? q.hints.quiet
        : phase === 'loud'
          ? q.hints.loud
          : phase === 'done'
            ? q.hints.done
            : q.hints.error

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{hint}</p>

      <BrutalPanel className="p-6">
        <div className="mb-2 flex justify-between brutal-type-label">
          <span>{q.meter.quiet}</span>
          <span>{q.meter.loud}</span>
        </div>
        <BrutalProgress value={meterPercent} variant="wine" size="md" />
        <div className="mt-4 flex justify-center gap-2">
          <BrutalBadge variant={phase === 'loud' || phase === 'done' ? 'completed' : phase === 'quiet' ? 'brass' : 'locked'} className="gap-1">
            {(phase === 'loud' || phase === 'done') && <BrutalIcon name="check" size="xs" />}
            {q.meter.quiet}
          </BrutalBadge>
          <BrutalBadge variant={phase === 'done' ? 'completed' : phase === 'loud' ? 'brass' : 'locked'} className="gap-1">
            {phase === 'done' && <BrutalIcon name="check" size="xs" />}
            {q.meter.loud}
          </BrutalBadge>
        </div>
      </BrutalPanel>

      {phase === 'idle' && (
        <BrutalButton variant="primary" fullWidth onClick={() => void begin()}>
          {shared.startMicrophone}
        </BrutalButton>
      )}

      {(phase === 'quiet' || phase === 'loud') && (
        <BrutalButton
          variant="ghost"
          fullWidth
          onClick={() => {
            stop()
            setPhase('idle')
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
            setPhase('idle')
          }}
        >
          {shared.tryAgain}
        </BrutalButton>
      )}

      {phase === 'done' && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {q.completeButton}
        </BrutalButton>
      )}
    </div>
  )
}
