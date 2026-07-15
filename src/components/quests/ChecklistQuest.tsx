import { useEffect, useState } from 'react'
import type { ChecklistConfig } from '../../lessons/quest-config'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalCard, BrutalCheckbox } from '../ui'
import { questHintClass } from './quest-ui'

interface ChecklistQuestProps {
  config: ChecklistConfig
  onComplete: () => void
}

export function ChecklistQuest({ config, onComplete }: ChecklistQuestProps) {
  const { t } = useI18n()
  const q = t.quests.checklist

  const { items, successLabel } = config
  const [doneIds, setDoneIds] = useState<Set<string>>(() => new Set())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const allDone = doneIds.size === items.length
  const activeStep = items.find((s) => s.id === activeId)

  useEffect(() => {
    if (!activeId || secondsLeft <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setDoneIds((ids) => new Set(ids).add(activeId))
          setActiveId(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [activeId, secondsLeft])

  const startTimer = (step: (typeof items)[number]) => {
    if (doneIds.has(step.id) || !step.seconds) return
    setActiveId(step.id)
    setSecondsLeft(step.seconds)
  }

  const markDone = (stepId: string) => {
    setDoneIds((ids) => new Set(ids).add(stepId))
    if (activeId === stepId) {
      setActiveId(null)
      setSecondsLeft(0)
    }
  }

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint}</p>

      <ul className="space-y-3">
        {items.map((step) => {
          const isDone = doneIds.has(step.id)
          const isActive = activeId === step.id

          return (
            <li key={step.id}>
              <BrutalCard variant={isDone ? 'success' : 'surface'} className="!p-3">
                <div className="flex items-start gap-3">
                  <BrutalCheckbox
                    checked={isDone}
                    onChange={() => markDone(step.id)}
                    disabled={isDone}
                    className="mt-0.5 shrink-0"
                    aria-label={isDone ? q.aria.done : q.aria.mark(step.label)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{step.label}</div>
                    <div className="text-body-sm opacity-80">{step.hint}</div>
                    {isActive && secondsLeft > 0 && (
                      <div className="mt-2 font-display text-hero font-extrabold text-jazz-wine">
                        {secondsLeft}
                      </div>
                    )}
                  </div>
                  {!isDone && !isActive && step.seconds && (
                    <BrutalButton size="sm" variant="secondary" onClick={() => startTimer(step)}>
                      {q.timerButton(step.seconds)}
                    </BrutalButton>
                  )}
                </div>
              </BrutalCard>
            </li>
          )
        })}
      </ul>

      {activeStep && (
        <BrutalButton variant="ghost" fullWidth onClick={() => markDone(activeStep.id)}>
          {q.manualDoneButton(activeStep.label)}
        </BrutalButton>
      )}

      <BrutalButton variant="primary" fullWidth disabled={!allDone} onClick={onComplete}>
        {successLabel}
      </BrutalButton>
    </div>
  )
}
