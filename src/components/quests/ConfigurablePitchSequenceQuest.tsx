import { useEffect, useMemo, useRef, useState } from 'react'
import { isInTune } from '../../audio/pitch'
import { playReferenceTone } from '../../audio/referenceTone'
import { usePitchDetector } from '../../audio/usePitchDetector'
import type { PitchSequenceConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { NoteStaff } from '../notes/NoteStaff'
import { PitchTuner } from '../PitchTuner'
import { BrutalButton } from '../ui'
import { HoldProgress, questHintClass, StepBadges } from './quest-ui'

interface ConfigurablePitchSequenceQuestProps {
  config: PitchSequenceConfig
  onComplete: () => void
}

function stepsToVexString(steps: PitchSequenceConfig['steps']): string {
  const parts = steps.map((step) => {
    const match = step.label.match(/([A-G])(#|b)?/i)
    if (!match) return 'C4/q'
    const letter = match[1].toUpperCase()
    const accidental = match[2] ?? ''
    const octave = step.label.match(/\d/)?.[0] ?? '4'
    return `${letter}${accidental}${octave}/q`
  })
  return parts.join(', ')
}

export function ConfigurablePitchSequenceQuest({
  config,
  onComplete,
}: ConfigurablePitchSequenceQuestProps) {
  const { t } = useI18n()
  const q = t.quests.pitchSequence
  const shared = t.quests.shared

  const { steps, toleranceCents, holdMs, successLabel, showStaff } = config
  const [stepIndex, setStepIndex] = useState(0)
  const [holdProgress, setHoldProgress] = useState(0)
  const [finished, setFinished] = useState(false)
  const holdStartRef = useRef<number | null>(null)

  const step = steps[stepIndex]
  const { status, reading, start, stop, reset } = usePitchDetector(step.hz)
  const staffNotes = useMemo(() => stepsToVexString(steps), [steps])

  const holdSeconds = Math.round(holdMs / 100) / 10

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    if (status !== 'listening' || finished) return

    const inTune = isInTune(reading.frequency, step.hz, toleranceCents)
    const now = performance.now()

    if (inTune) {
      if (!holdStartRef.current) holdStartRef.current = now
      const elapsed = now - holdStartRef.current
      setHoldProgress(Math.min(1, elapsed / holdMs))
      if (elapsed >= holdMs) {
        holdStartRef.current = null
        setHoldProgress(0)
        stop()
        if (stepIndex + 1 >= steps.length) {
          setFinished(true)
        } else {
          setStepIndex((i) => i + 1)
        }
      }
    } else {
      holdStartRef.current = null
      setHoldProgress(0)
    }
  }, [reading, status, finished, step.hz, stepIndex, steps.length, stop, toleranceCents, holdMs])

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint(holdSeconds)}</p>

      {showStaff && <NoteStaff noteString={staffNotes} />}

      <StepBadges labels={steps.map((s) => s.label)} currentIndex={stepIndex} />

      {!finished && (
        <>
          <BrutalButton
            variant="secondary"
            fullWidth
            size="sm"
            leadingIcon="play"
            onClick={() => void playReferenceTone(step.hz)}
          >
            {q.referenceButton(step.label)}
          </BrutalButton>

          <PitchTuner
            label={step.label}
            targetHz={step.hz}
            frequency={reading.frequency}
            cents={reading.cents}
            toleranceCents={toleranceCents}
          />
        </>
      )}

      {status === 'listening' && !finished && <HoldProgress progress={holdProgress} />}

      {status === 'idle' && !finished && (
        <BrutalButton variant="primary" fullWidth onClick={() => void start()}>
          {stepIndex === 0 ? q.startMicrophoneFirst : q.startMicrophoneNext}
        </BrutalButton>
      )}

      {status === 'listening' && !finished && (
        <BrutalButton
          variant="ghost"
          fullWidth
          onClick={() => {
            stop()
            holdStartRef.current = null
            setHoldProgress(0)
          }}
        >
          {shared.stop}
        </BrutalButton>
      )}

      {status === 'error' && (
        <BrutalButton variant="ghost" fullWidth onClick={reset}>
          {shared.tryAgain}
        </BrutalButton>
      )}

      {finished && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {successLabel}
        </BrutalButton>
      )}
    </div>
  )
}
