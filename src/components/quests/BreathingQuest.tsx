import { useEffect, useMemo, useRef, useState } from 'react'
import { BrutalIcon } from '../icons'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalCard } from '../ui'
import { questHintClass } from './quest-ui'

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle'

const CYCLES_REQUIRED = 3

interface BreathingQuestProps {
  onComplete: () => void
}

export function BreathingQuest({ onComplete }: BreathingQuestProps) {
  const { t } = useI18n()
  const q = t.quests.breathing

  const PHASES = useMemo(
    () => [
      { phase: 'inhale' as Phase, label: q.phases.inhale, seconds: 4 },
      { phase: 'hold' as Phase, label: q.phases.hold, seconds: 2 },
      { phase: 'exhale' as Phase, label: q.phases.exhale, seconds: 6 },
    ],
    [q.phases.exhale, q.phases.hold, q.phases.inhale],
  )

  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds)
  const [cyclesDone, setCyclesDone] = useState(0)

  const phaseIndexRef = useRef(0)
  const secondsLeftRef = useRef(PHASES[0].seconds)
  const cyclesDoneRef = useRef(0)

  const current = PHASES[phaseIndex]

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      if (secondsLeftRef.current > 1) {
        secondsLeftRef.current -= 1
        setSecondsLeft(secondsLeftRef.current)
        return
      }

      const nextIndex = (phaseIndexRef.current + 1) % PHASES.length
      if (nextIndex === 0) {
        cyclesDoneRef.current += 1
        setCyclesDone(cyclesDoneRef.current)
        if (cyclesDoneRef.current >= CYCLES_REQUIRED) {
          setRunning(false)
        }
      }

      phaseIndexRef.current = nextIndex
      secondsLeftRef.current = PHASES[nextIndex].seconds
      setPhaseIndex(nextIndex)
      setSecondsLeft(PHASES[nextIndex].seconds)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running, PHASES])

  const scale =
    current.phase === 'inhale' ? 1.15 : current.phase === 'hold' ? 1.15 : 0.9

  const handleStart = () => {
    phaseIndexRef.current = 0
    secondsLeftRef.current = PHASES[0].seconds
    setPhaseIndex(0)
    setSecondsLeft(PHASES[0].seconds)
    setRunning(true)
  }

  return (
    <div className="space-y-6 text-center">
      <p className={questHintClass}>{q.hint(CYCLES_REQUIRED)}</p>

      <div className="flex justify-center">
        <BrutalCard
          className="flex h-40 w-40 items-center justify-center !p-0 transition-transform duration-1000"
          style={{ transform: `scale(${running ? scale : 1})` }}
        >
          <div>
            <div className="font-display text-title font-bold">
              {running ? current.label : q.ready}
            </div>
            <div className="font-display text-display font-extrabold text-jazz-wine">
              {running ? secondsLeft : <BrutalIcon name="play" size="lg" className="mx-auto h-12 w-12" />}
            </div>
          </div>
        </BrutalCard>
      </div>

      <div className="text-body-sm font-bold text-foreground-muted">
        {q.cyclesProgress(cyclesDone, CYCLES_REQUIRED)}
      </div>

      {!running && cyclesDone < CYCLES_REQUIRED && (
        <BrutalButton variant="primary" fullWidth onClick={handleStart}>
          {q.startButton}
        </BrutalButton>
      )}

      {cyclesDone >= CYCLES_REQUIRED && (
        <BrutalButton variant="success" fullWidth onClick={onComplete}>
          {q.completeButton}
        </BrutalButton>
      )}
    </div>
  )
}
