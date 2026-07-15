import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { MascotBubble } from '../../components/MascotBubble'
import { BreathingQuest } from '../../components/quests/BreathingQuest'
import { BuzzQuest } from '../../components/quests/BuzzQuest'
import { ChecklistQuest } from '../../components/quests/ChecklistQuest'
import { ComplexFlowQuest } from '../../components/quests/ComplexFlowQuest'
import { ConfigurablePitchHoldQuest } from '../../components/quests/ConfigurablePitchHoldQuest'
import { ConfigurablePitchSequenceQuest } from '../../components/quests/ConfigurablePitchSequenceQuest'
import { CrescendoQuest } from '../../components/quests/CrescendoQuest'
import { DailyMiniQuest } from '../../components/quests/DailyMiniQuest'
import { DynamicsQuest } from '../../components/quests/DynamicsQuest'
import { HoldNoteQuest } from '../../components/quests/HoldNoteQuest'
import { LipWarmupQuest } from '../../components/quests/LipWarmupQuest'
import { MetronomeQuest } from '../../components/quests/MetronomeQuest'
import { MouthpieceQuest } from '../../components/quests/MouthpieceQuest'
import { NoteEchoQuest } from '../../components/quests/NoteEchoQuest'
import { ReviewWeakQuest } from '../../components/quests/ReviewWeakQuest'
import { SlowFastQuest } from '../../components/quests/SlowFastQuest'
import { StreakGateQuest } from '../../components/quests/StreakGateQuest'
import { TwoNotesQuest } from '../../components/quests/TwoNotesQuest'
import { useI18n } from '../../i18n'
import { useGameStore } from '../../game/store'
import { getQuestById, getQuestStatus } from '../../lessons/catalog'
import type { QuestDefinition } from '../../lessons/types'
import { BrutalCard, BrutalLink } from '../../components/ui'

function renderQuestBody(quest: QuestDefinition, onComplete: () => void, t: ReturnType<typeof useI18n>['t']) {
  switch (quest.type) {
    case 'breathing':
      return <BreathingQuest onComplete={onComplete} />
    case 'buzz':
      return <BuzzQuest onComplete={onComplete} />
    case 'lip-warmup':
      return <LipWarmupQuest onComplete={onComplete} />
    case 'mouthpiece':
      return <MouthpieceQuest onComplete={onComplete} />
    case 'dynamics':
      return <DynamicsQuest onComplete={onComplete} />
    case 'metronome': {
      const metronomeConfig =
        quest.config?.kind === 'metronome' ? quest.config.data : undefined
      return (
        <MetronomeQuest
          onComplete={onComplete}
          bpm={metronomeConfig?.bpm}
          totalBeats={metronomeConfig?.totalBeats}
          requiredHits={metronomeConfig?.requiredHits}
        />
      )
    }
    case 'hold-note':
      return <HoldNoteQuest onComplete={onComplete} />
    case 'two-notes':
      return <TwoNotesQuest onComplete={onComplete} />
    case 'daily-mini':
      return <DailyMiniQuest onComplete={onComplete} />
    case 'pitch-hold':
      if (quest.config?.kind === 'pitch-hold') {
        return <ConfigurablePitchHoldQuest config={quest.config.data} onComplete={onComplete} />
      }
      break
    case 'pitch-sequence':
      if (quest.config?.kind === 'pitch-sequence') {
        return (
          <ConfigurablePitchSequenceQuest config={quest.config.data} onComplete={onComplete} />
        )
      }
      break
    case 'checklist':
      if (quest.config?.kind === 'checklist') {
        return <ChecklistQuest config={quest.config.data} onComplete={onComplete} />
      }
      break
    case 'slow-fast':
      if (quest.config?.kind === 'slow-fast') {
        return <SlowFastQuest config={quest.config.data} onComplete={onComplete} />
      }
      break
    case 'note-echo':
      if (quest.config?.kind === 'note-echo') {
        return <NoteEchoQuest config={quest.config.data} onComplete={onComplete} />
      }
      break
    case 'complex-flow':
      if (quest.config?.kind === 'complex-flow') {
        return <ComplexFlowQuest config={quest.config.data} onComplete={onComplete} />
      }
      break
    case 'streak-gate':
      if (quest.config?.kind === 'streak-gate') {
        return <StreakGateQuest config={quest.config.data} onComplete={onComplete} />
      }
      break
    case 'crescendo':
      if (quest.config?.kind === 'crescendo') {
        return <CrescendoQuest steps={quest.config.data.steps} onComplete={onComplete} />
      }
      break
    case 'review-weak':
      return <ReviewWeakQuest onComplete={onComplete} />
    default:
      break
  }
  return (
    <p className="brutal-type-hint">
      {t.strings.questInDevelopment}{' '}
      <BrutalLink to="/">{t.strings.returnToMap}</BrutalLink>
    </p>
  )
}

export function QuestPage() {
  const { locale, t } = useI18n()
  const { questId = '' } = useParams()
  const quest = getQuestById(questId, locale)
  const completedQuestIds = useGameStore((s) => s.completedQuestIds)
  const completeQuest = useGameStore((s) => s.completeQuest)
  const [justCompleted, setJustCompleted] = useState(false)

  if (!quest) return <Navigate to="/" replace />

  const status = getQuestStatus(quest, new Set(completedQuestIds))
  if (status === 'locked') return <Navigate to="/" replace />

  const alreadyDone = status === 'completed'

  const handleComplete = () => {
    if (!alreadyDone) {
      completeQuest(quest.id, quest.xpReward)
    }
    setJustCompleted(true)
  }

  return (
    <div className="space-y-6">
      <BrutalLink to="/" leadingIcon="arrow-left">{t.strings.backToMap}</BrutalLink>

      <div>
        <h2 className="font-display text-title font-bold text-foreground">{quest.title}</h2>
        <p className="mt-1 text-body-sm text-foreground-muted">{quest.description}</p>
      </div>

      <MascotBubble
        message={
          justCompleted || alreadyDone
            ? t.strings.mascotQuestDone
            : t.strings.mascotQuestIntro(quest.title)
        }
      />

      {justCompleted || alreadyDone ? (
        <BrutalCard variant="success" className="animate-brutal-pop space-y-4 text-center">
          <div className="text-lead font-bold">{t.strings.questCompleted}</div>
          {!alreadyDone && (
            <div className="font-semibold text-main">{t.strings.xpGained(quest.xpReward)}</div>
          )}
          <BrutalLink to="/" variant="primary">
            {t.strings.backToMap}
          </BrutalLink>
        </BrutalCard>
      ) : (
        renderQuestBody(quest, handleComplete, t)
      )}
    </div>
  )
}
