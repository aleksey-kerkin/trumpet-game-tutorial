import { useEffect, useMemo, useRef, useState } from 'react'
import * as Tone from 'tone'
import { isInTune } from '../../audio/pitch'
import { usePitchDetector } from '../../audio/usePitchDetector'
import type { NoteEchoConfig } from '../../lessons/quest-config'
import { formatNoteLabel, getNoteHz } from '../../music/notes'
import { useI18n } from '../../i18n'
import { NoteStaff } from '../notes/NoteStaff'
import { PitchTuner } from '../PitchTuner'
import { BrutalButton } from '../ui'
import { HoldProgress, questHintClass, StepBadges } from './quest-ui'

interface NoteEchoQuestProps {
  config: NoteEchoConfig
  onComplete: () => void
}

export function NoteEchoQuest({ config, onComplete }: NoteEchoQuestProps) {
  const { locale, t } = useI18n()
  const q = t.quests.noteEcho
  const shared = t.quests.shared

  const { steps, toleranceCents, holdMs, showStaff } = config
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<'listen' | 'play' | 'done'>('listen')
  const [holdProgress, setHoldProgress] = useState(0)
  const [finished, setFinished] = useState(false)
  const holdStartRef = useRef<number | null>(null)
  const synthRef = useRef<Tone.Synth | null>(null)

  const resolvedSteps = useMemo(
    () =>
      steps.map((step) => ({
        noteId: step.noteId,
        label: formatNoteLabel(step.noteId, locale),
        hz: getNoteHz(step.noteId),
        toneNote: step.noteId,
      })),
    [locale, steps],
  )

  const noteIds = useMemo(
    () => resolvedSteps.map((step) => step.noteId),
    [resolvedSteps],
  )

  const step = resolvedSteps[stepIndex]
  const { status, reading, start, stop, reset } = usePitchDetector(step.hz)

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    if (phase !== 'play' || status !== 'listening' || finished) return

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
          setPhase('done')
        } else {
          setStepIndex((i) => i + 1)
          setPhase('listen')
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
    phase,
  ])

  const playMentorNote = async () => {
    await Tone.start()
    if (!synthRef.current) {
      synthRef.current = new Tone.Synth().toDestination()
    }
    synthRef.current.triggerAttackRelease(step.toneNote, '0.7')
    setPhase('play')
  }

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint}</p>

      {showStaff && (
        <NoteStaff noteIds={noteIds} highlightIndex={stepIndex} captionNoteId={step.noteId} />
      )}

      <StepBadges labels={resolvedSteps.map((s) => s.label)} currentIndex={stepIndex} />

      {!finished && phase === 'listen' && (
        <BrutalButton variant="primary" fullWidth leadingIcon="play" onClick={() => void playMentorNote()}>
          {q.listenButton(step.label)}
        </BrutalButton>
      )}

      {!finished && phase === 'play' && (
        <>
          <PitchTuner
            label={step.label}
            targetHz={step.hz}
            frequency={reading.frequency}
            cents={reading.cents}
            toleranceCents={toleranceCents}
          />

          {status === 'listening' && (
            <HoldProgress progress={holdProgress} label={q.holdProgressLabel} />
          )}

          {status === 'idle' && (
            <BrutalButton variant="primary" fullWidth onClick={() => void start()}>
              {q.startMicrophoneButton}
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

          <BrutalButton variant="secondary" fullWidth size="sm" onClick={() => void playMentorNote()}>
            {q.listenAgainButton}
          </BrutalButton>
        </>
      )}

      {finished && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {q.completeButton}
        </BrutalButton>
      )}
    </div>
  )
}
