import { useEffect, useMemo, useRef, useState } from 'react'
import { isInTune, NOTE_C4_HZ } from '../../audio/pitch'
import { MetronomeEngine } from '../../audio/metronome'
import { usePitchDetector } from '../../audio/usePitchDetector'
import { useI18n } from '../../i18n'
import { PitchTuner } from '../PitchTuner'
import { BrutalButton, BrutalCard, BrutalCheckbox, BrutalTapZone } from '../ui'
import { HoldProgress, questHintClass } from './quest-ui'

const METRONOME_BPM = 60
const METRONOME_BEATS = 4
const TOLERANCE_MS = 180
const PITCH_TOLERANCE = 100
const PITCH_HOLD_MS = 1500

type Phase = 'warmup' | 'rhythm' | 'pitch'

interface DailyMiniQuestProps {
  onComplete: () => void
}

export function DailyMiniQuest({ onComplete }: DailyMiniQuestProps) {
  const { t } = useI18n()
  const q = t.quests.dailyMini
  const shared = t.quests.shared

  const warmupItems = useMemo(() => [...q.warmup.items], [q.warmup.items])

  const [phase, setPhase] = useState<Phase>('warmup')
  const [warmupDone, setWarmupDone] = useState<boolean[]>(() => warmupItems.map(() => false))
  const [rhythmHits, setRhythmHits] = useState(0)
  const [rhythmRunning, setRhythmRunning] = useState(false)
  const [rhythmFinished, setRhythmFinished] = useState(false)
  const [rhythmPulse, setRhythmPulse] = useState(false)
  const [pitchFinished, setPitchFinished] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)

  const engineRef = useRef<MetronomeEngine | null>(null)
  const beatTimesRef = useRef<number[]>([])
  const matchedBeatsRef = useRef<Set<number>>(new Set())
  const rhythmStartRef = useRef(0)
  const holdStartRef = useRef<number | null>(null)

  const { status, reading, start, stop, reset } = usePitchDetector(NOTE_C4_HZ)

  useEffect(() => () => {
    engineRef.current?.stop()
    stop()
  }, [stop])

  const warmupComplete = warmupDone.every(Boolean)

  const startRhythm = async () => {
    beatTimesRef.current = []
    matchedBeatsRef.current = new Set()
    setRhythmHits(0)
    setRhythmFinished(false)
    setRhythmRunning(true)
    rhythmStartRef.current = performance.now()

    const engine = new MetronomeEngine(METRONOME_BPM, (beatIndex) => {
      beatTimesRef.current.push(
        rhythmStartRef.current + beatIndex * (60_000 / METRONOME_BPM),
      )
      setRhythmPulse(true)
      setTimeout(() => setRhythmPulse(false), 80)
      if (beatIndex + 1 >= METRONOME_BEATS) {
        setTimeout(() => {
          engine.stop()
          setRhythmFinished(true)
          setRhythmRunning(false)
        }, 60_000 / METRONOME_BPM)
      }
    })
    engineRef.current = engine
    await engine.start()
  }

  const handleTap = () => {
    if (phase !== 'rhythm' || rhythmFinished) return
    const tapMs = performance.now()
    let bestBeat = -1
    let bestDistance = TOLERANCE_MS + 1
    beatTimesRef.current.forEach((beatMs, index) => {
      if (matchedBeatsRef.current.has(index)) return
      const distance = Math.abs(tapMs - beatMs)
      if (distance <= TOLERANCE_MS && distance < bestDistance) {
        bestDistance = distance
        bestBeat = index
      }
    })
    if (bestBeat >= 0) {
      matchedBeatsRef.current.add(bestBeat)
      setRhythmHits((n) => n + 1)
    }
  }

  useEffect(() => {
    if (phase !== 'pitch' || status !== 'listening' || pitchFinished) return

    const inTune = isInTune(reading.frequency, NOTE_C4_HZ, PITCH_TOLERANCE)
    const now = performance.now()
    if (inTune) {
      if (!holdStartRef.current) holdStartRef.current = now
      const elapsed = now - holdStartRef.current
      setHoldProgress(Math.min(1, elapsed / PITCH_HOLD_MS))
      if (elapsed >= PITCH_HOLD_MS) {
        setPitchFinished(true)
        stop()
      }
    } else {
      holdStartRef.current = null
      setHoldProgress(0)
    }
  }, [phase, pitchFinished, reading, status, stop])

  if (phase === 'warmup') {
    return (
      <div className="space-y-6">
        <p className={questHintClass}>{q.warmup.hint}</p>
        <p className="brutal-type-label text-main">{q.warmup.title}</p>
        <ul className="space-y-2">
          {warmupItems.map((item, index) => (
            <li key={item}>
              <BrutalCard className="!p-3">
                <BrutalCheckbox
                  label={item}
                  checked={warmupDone[index]}
                  onChange={() => {
                    setWarmupDone((prev) => {
                      const next = [...prev]
                      next[index] = !next[index]
                      return next
                    })
                  }}
                />
              </BrutalCard>
            </li>
          ))}
        </ul>
        <BrutalButton variant="primary" fullWidth disabled={!warmupComplete} onClick={() => setPhase('rhythm')}>
          {q.warmup.nextButton}
        </BrutalButton>
      </div>
    )
  }

  if (phase === 'rhythm') {
    const rhythmOk = rhythmFinished && rhythmHits >= 3
    return (
      <div className="space-y-6">
        <p className="brutal-type-label text-main">{q.rhythm.title(METRONOME_BPM)}</p>
        <BrutalTapZone
          onClick={handleTap}
          disabled={!rhythmRunning && !rhythmFinished}
          pulsing={rhythmPulse}
          heightClass="h-32"
        >
          <span className="font-display text-title font-bold">{q.rhythm.tapLabel}</span>
        </BrutalTapZone>
        <p className="text-center text-body-sm font-bold text-foreground-muted">
          {q.rhythm.hitsProgress(rhythmHits, METRONOME_BEATS)}
        </p>
        {!rhythmRunning && !rhythmFinished && (
          <BrutalButton variant="primary" fullWidth onClick={() => void startRhythm()}>
            {shared.startMetronome}
          </BrutalButton>
        )}
        {rhythmOk && (
          <BrutalButton variant="primary" fullWidth onClick={() => setPhase('pitch')}>
            {q.rhythm.toPitchButton}
          </BrutalButton>
        )}
        {rhythmFinished && !rhythmOk && (
          <BrutalButton variant="ghost" fullWidth onClick={() => void startRhythm()}>
            {q.rhythm.againButton}
          </BrutalButton>
        )}
      </div>
    )
  }

  if (phase === 'pitch' && !pitchFinished) {
    return (
      <div className="space-y-6">
        <p className="brutal-type-label text-main">{q.pitch.title}</p>
        <PitchTuner
          label={q.pitch.noteLabel}
          targetHz={NOTE_C4_HZ}
          frequency={reading.frequency}
          cents={reading.cents}
          toleranceCents={PITCH_TOLERANCE}
        />
        {status === 'listening' && <HoldProgress progress={holdProgress} />}
        {status === 'idle' && (
          <BrutalButton variant="primary" fullWidth aria-pressed={false} onClick={() => void start()}>
            {shared.startMicrophone}
          </BrutalButton>
        )}
        {status === 'error' && (
          <BrutalButton variant="ghost" fullWidth onClick={reset}>
            {shared.retry}
          </BrutalButton>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 text-center">
      <p className="font-semibold text-jazz-success">{q.done.message}</p>
      <BrutalButton variant="success" fullWidth onClick={onComplete}>
        {shared.complete}
      </BrutalButton>
    </div>
  )
}
