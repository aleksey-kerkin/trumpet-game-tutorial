import { useEffect, useRef, useState } from 'react'
import { isInTune } from '../../audio/pitch'
import { playReferenceTone } from '../../audio/referenceTone'
import { usePitchDetector } from '../../audio/usePitchDetector'
import type { PitchHoldConfig } from '../../lessons/quest-config'
import { formatNoteLabel, getConcertHz } from '../../music/notes'
import { useI18n } from '../../i18n'
import { NoteStaff } from '../notes/NoteStaff'
import { PitchTuner } from '../PitchTuner'
import { BrutalButton } from '../ui'
import { HoldProgress, questHintClass } from './quest-ui'

interface ConfigurablePitchHoldQuestProps {
  config: PitchHoldConfig
  onComplete: () => void
}

export function ConfigurablePitchHoldQuest({ config, onComplete }: ConfigurablePitchHoldQuestProps) {
  const { locale, t } = useI18n()
  const q = t.quests.pitchHold
  const shared = t.quests.shared

  const { noteId, toleranceCents, holdMs, showStaff } = config
  const label = formatNoteLabel(noteId, locale)
  const hz = getConcertHz(noteId)
  const { status, reading, start, stop, reset } = usePitchDetector(hz)
  const [holdProgress, setHoldProgress] = useState(0)
  const [finished, setFinished] = useState(false)
  const holdStartRef = useRef<number | null>(null)

  const holdSeconds = Math.round(holdMs / 100) / 10

  useEffect(() => () => stop(), [stop])

  useEffect(() => {
    if (status !== 'listening' || finished) return

    const inTune = isInTune(reading.frequency, hz, toleranceCents)
    const now = performance.now()

    if (inTune) {
      if (!holdStartRef.current) holdStartRef.current = now
      const elapsed = now - holdStartRef.current
      setHoldProgress(Math.min(1, elapsed / holdMs))
      if (elapsed >= holdMs) {
        setFinished(true)
        stop()
      }
    } else {
      holdStartRef.current = null
      setHoldProgress(0)
    }
  }, [reading, status, finished, stop, hz, toleranceCents, holdMs])

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint(label, toleranceCents, holdSeconds)}</p>

      {showStaff && <NoteStaff noteIds={[noteId]} highlightIndex={0} captionNoteId={noteId} />}

      <BrutalButton variant="secondary" fullWidth size="sm" leadingIcon="play" onClick={() => void playReferenceTone(hz)}>
        {q.referenceButton}
      </BrutalButton>

      <PitchTuner
        label={label}
        targetHz={hz}
        frequency={reading.frequency}
        cents={reading.cents}
        toleranceCents={toleranceCents}
      />

      {status === 'listening' && !finished && <HoldProgress progress={holdProgress} />}

      {status === 'idle' && !finished && (
        <BrutalButton variant="primary" fullWidth onClick={() => void start()}>
          {shared.startMicrophone}
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
          {q.completeButton}
        </BrutalButton>
      )}
    </div>
  )
}
