import { useCallback, useEffect, useRef, useState } from 'react'
import { useMicrophoneLevel } from '../../audio/useMicrophoneLevel'
import { BrutalIcon } from '../icons'
import { useI18n } from '../../i18n'
import { BrutalBadge, BrutalButton, BrutalPanel, BrutalProgress } from '../ui'
import { HoldProgress, questHintClass } from './quest-ui'

const NOISE_FLOOR = 0.008
const LOUD_RATIO = 1.35
const LOUD_ABSOLUTE_MIN = 0.018
const HOLD_MS = 1000
const RMS_SMOOTHING = 0.2

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
  const [loudTarget, setLoudTarget] = useState(LOUD_ABSOLUTE_MIN)
  const [holdProgress, setHoldProgress] = useState(0)

  const phaseRef = useRef<Phase>('idle')
  const holdStartRef = useRef<number | null>(null)
  const quietBaselineRef = useRef(0)
  const loudTargetRef = useRef(LOUD_ABSOLUTE_MIN)
  const smoothedRmsRef = useRef(0)

  useEffect(() => () => stop(), [stop])

  const setPhaseSafe = (next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }

  const handleLevel = useCallback(
    (rms: number) => {
      const currentPhase = phaseRef.current
      if (currentPhase !== 'quiet' && currentPhase !== 'loud') return

      smoothedRmsRef.current =
        smoothedRmsRef.current * (1 - RMS_SMOOTHING) + rms * RMS_SMOOTHING
      const levelSample = smoothedRmsRef.current
      const now = performance.now()

      if (currentPhase === 'quiet') {
        if (levelSample >= NOISE_FLOOR) {
          if (!holdStartRef.current) holdStartRef.current = now
          const elapsed = now - holdStartRef.current
          setHoldProgress(Math.min(1, elapsed / HOLD_MS))
          quietBaselineRef.current = Math.max(quietBaselineRef.current, levelSample)

          if (elapsed >= HOLD_MS) {
            holdStartRef.current = null
            setHoldProgress(0)
            const target = Math.max(
              quietBaselineRef.current * LOUD_RATIO,
              LOUD_ABSOLUTE_MIN,
            )
            loudTargetRef.current = target
            setLoudTarget(target)
            setPhaseSafe('loud')
          }
        } else {
          holdStartRef.current = null
          quietBaselineRef.current = 0
          setHoldProgress(0)
        }
        return
      }

      if (levelSample >= loudTargetRef.current) {
        if (!holdStartRef.current) holdStartRef.current = now
        const elapsed = now - holdStartRef.current
        setHoldProgress(Math.min(1, elapsed / HOLD_MS))
        if (elapsed >= HOLD_MS) {
          holdStartRef.current = null
          setHoldProgress(0)
          stop()
          setPhaseSafe('done')
        }
      } else {
        holdStartRef.current = null
        setHoldProgress(0)
      }
    },
    [stop],
  )

  const begin = async () => {
    holdStartRef.current = null
    quietBaselineRef.current = 0
    loudTargetRef.current = LOUD_ABSOLUTE_MIN
    smoothedRmsRef.current = 0
    setHoldProgress(0)
    setLoudTarget(LOUD_ABSOLUTE_MIN)
    setPhaseSafe('quiet')
    await start(handleLevel)
  }

  const meterPercent =
    phase === 'loud'
      ? Math.min(100, (level / loudTarget) * 100)
      : Math.min(100, (level / NOISE_FLOOR) * 35)

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

      {(phase === 'quiet' || phase === 'loud') && (
        <HoldProgress progress={holdProgress} />
      )}

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
            setPhaseSafe('idle')
            setHoldProgress(0)
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
            setPhaseSafe('idle')
            setHoldProgress(0)
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
