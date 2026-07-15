import { useEffect, useRef, useState } from 'react'
import { MetronomeEngine } from '../../audio/metronome'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalTapZone } from '../ui'
import { questHintClass } from './quest-ui'

const BPM_DEFAULT = 60
const TOTAL_BEATS_DEFAULT = 8
const TOLERANCE_MS = 180
const REQUIRED_HITS_DEFAULT = 6

interface MetronomeQuestProps {
  onComplete: () => void
  bpm?: number
  totalBeats?: number
  requiredHits?: number
}

export function MetronomeQuest({
  onComplete,
  bpm = BPM_DEFAULT,
  totalBeats = TOTAL_BEATS_DEFAULT,
  requiredHits = REQUIRED_HITS_DEFAULT,
}: MetronomeQuestProps) {
  const { t } = useI18n()
  const q = t.quests.metronome
  const shared = t.quests.shared

  const [started, setStarted] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [finished, setFinished] = useState(false)
  const engineRef = useRef<MetronomeEngine | null>(null)
  const beatTimesRef = useRef<number[]>([])
  const matchedBeatsRef = useRef<Set<number>>(new Set())
  const startTimeRef = useRef(0)

  useEffect(() => {
    return () => engineRef.current?.stop()
  }, [])

  const startMetronome = async () => {
    beatTimesRef.current = []
    matchedBeatsRef.current = new Set()
    setHits(0)
    setAttempts(0)
    setFinished(false)
    setStarted(true)
    startTimeRef.current = performance.now()

    const engine = new MetronomeEngine(bpm, (beatIndex) => {
      const beatMs = startTimeRef.current + beatIndex * (60_000 / bpm)
      beatTimesRef.current.push(beatMs)
      setPulse(true)
      setTimeout(() => setPulse(false), 80)

      if (beatIndex + 1 >= totalBeats) {
        setTimeout(() => {
          engine.stop()
          setFinished(true)
        }, 60_000 / bpm)
      }
    })
    engineRef.current = engine
    await engine.start()
  }

  const handleTap = () => {
    if (!started || finished) return
    const tapMs = performance.now()
    setAttempts((n) => n + 1)

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
      setHits((n) => n + 1)
    }
  }

  const success = finished && hits >= requiredHits

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint(requiredHits, totalBeats, bpm)}</p>

      <BrutalTapZone
        onClick={handleTap}
        disabled={!started || finished}
        pulsing={pulse}
      >
        <span className="font-display text-display font-extrabold">{bpm}</span>
        <span className="text-body-sm font-bold">{q.tapZoneSubtitle}</span>
        {started && !finished && (
          <span className="mt-2 text-meta font-bold opacity-70">{q.hitsDuringRun(hits)}</span>
        )}
      </BrutalTapZone>

      {!started && (
        <BrutalButton variant="primary" fullWidth onClick={() => void startMetronome()}>
          {shared.startMetronome}
        </BrutalButton>
      )}

      {finished && (
        <div className="space-y-4 text-center">
          <p className="text-body-sm font-medium text-foreground-muted">
            {q.result(hits, attempts)}
          </p>
          {success ? (
            <BrutalButton variant="success" fullWidth onClick={onComplete}>
              {q.successButton}
            </BrutalButton>
          ) : (
            <BrutalButton variant="ghost" fullWidth onClick={() => void startMetronome()}>
              {shared.tryAgain}
            </BrutalButton>
          )}
        </div>
      )}
    </div>
  )
}
