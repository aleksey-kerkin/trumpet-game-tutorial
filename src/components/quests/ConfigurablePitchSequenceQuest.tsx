import { useEffect, useMemo, useRef, useState } from 'react'
import { isInTune } from '../../audio/pitch'
import { playReferenceTone } from '../../audio/referenceTone'
import { usePitchDetector } from '../../audio/usePitchDetector'
import type { PitchSequenceConfig } from '../../lessons/quest-config'
import { formatNoteLabel, getNoteHz } from '../../music/notes'
import { useI18n } from '../../i18n'
import { NoteStaff } from '../notes/NoteStaff'
import { PitchTuner } from '../PitchTuner'
import { BrutalButton } from '../ui'
import { HoldProgress, questHintClass, StepBadges } from './quest-ui'

interface ConfigurablePitchSequenceQuestProps {
  config: PitchSequenceConfig
  onComplete: () => void
}

export function ConfigurablePitchSequenceQuest({
  config,
  onComplete,
}: ConfigurablePitchSequenceQuestProps) {
  const { locale, t } = useI18n()
  const q = t.quests.pitchSequence
  const shared = t.quests.shared

  const { steps, toleranceCents, holdMs, successLabel, showStaff } = config
  const [stepIndex, setStepIndex] = useState(0)
  const [holdProgress, setHoldProgress] = useState(0)
  const [finished, setFinished] = useState(false)
  const holdStartRef = useRef<number | null>(null)

  const resolvedSteps = useMemo(
    () =>
      steps.map((step) => ({
        noteId: step.noteId,
        label: formatNoteLabel(step.noteId, locale),
        hz: getNoteHz(step.noteId),
      })),
    [locale, steps],
  )

  const noteIds = useMemo(
    () => resolvedSteps.map((step) => step.noteId),
    [resolvedSteps],
  )

  const step = resolvedSteps[stepIndex]
  const { status, reading, start, stop, reset } = usePitchDetector(step.hz)

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
        if (stepIndex + 1 >= resolvedSteps.length) {
          setFinished(true)
        } else {
          setStepIndex((i) => i + 1)
        }
      }
    } else {
      holdStartRef.current = null
      setHoldProgress(0)
    }
  }, [
    reading,
    status,
    finished,
    step.hz,
    stepIndex,
    resolvedSteps.length,
    stop,
    toleranceCents,
    holdMs,
  ])

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint(holdSeconds)}</p>

      {showStaff && (
        <NoteStaff noteIds={noteIds} highlightIndex={stepIndex} captionNoteId={step.noteId} />
      )}

      <StepBadges labels={resolvedSteps.map((s) => s.label)} currentIndex={stepIndex} />

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

          {status === 'listening' && (
            <HoldProgress progress={holdProgress} label={shared.holdProgress} />
          )}

          {status === 'idle' && (
            <BrutalButton variant="primary" fullWidth onClick={() => void start()}>
              {stepIndex === 0 ? q.startMicrophoneFirst : q.startMicrophoneNext}
            </BrutalButton>
          )}

          {status === 'listening' && (
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
        </>
      )}

      {finished && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {successLabel}
        </BrutalButton>
      )}
    </div>
  )
}
