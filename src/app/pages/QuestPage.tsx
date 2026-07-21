import { lazy, Suspense, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { MascotBubble } from '../../components/MascotBubble'
import { useI18n } from '../../i18n'
import { useGameStore } from '../../game/store'
import { getQuestById, getQuestStatus } from '../../lessons/catalog'
import type { QuestDefinition } from '../../lessons/types'
import { BrutalCard, BrutalLink } from '../../components/ui'

const BreathingQuest = lazy(() =>
  import('../../components/quests/BreathingQuest').then((m) => ({ default: m.BreathingQuest })),
)
const BuzzQuest = lazy(() =>
  import('../../components/quests/BuzzQuest').then((m) => ({ default: m.BuzzQuest })),
)
const ChecklistQuest = lazy(() =>
  import('../../components/quests/ChecklistQuest').then((m) => ({ default: m.ChecklistQuest })),
)
const ComplexFlowQuest = lazy(() =>
  import('../../components/quests/ComplexFlowQuest').then((m) => ({ default: m.ComplexFlowQuest })),
)
const ConfigurablePitchHoldQuest = lazy(() =>
  import('../../components/quests/ConfigurablePitchHoldQuest').then((m) => ({
    default: m.ConfigurablePitchHoldQuest,
  })),
)
const ConfigurablePitchSequenceQuest = lazy(() =>
  import('../../components/quests/ConfigurablePitchSequenceQuest').then((m) => ({
    default: m.ConfigurablePitchSequenceQuest,
  })),
)
const CrescendoQuest = lazy(() =>
  import('../../components/quests/CrescendoQuest').then((m) => ({ default: m.CrescendoQuest })),
)
const DailyMiniQuest = lazy(() =>
  import('../../components/quests/DailyMiniQuest').then((m) => ({ default: m.DailyMiniQuest })),
)
const DynamicsQuest = lazy(() =>
  import('../../components/quests/DynamicsQuest').then((m) => ({ default: m.DynamicsQuest })),
)
const HoldNoteQuest = lazy(() =>
  import('../../components/quests/HoldNoteQuest').then((m) => ({ default: m.HoldNoteQuest })),
)
const LipWarmupQuest = lazy(() =>
  import('../../components/quests/LipWarmupQuest').then((m) => ({ default: m.LipWarmupQuest })),
)
const MetronomeQuest = lazy(() =>
  import('../../components/quests/MetronomeQuest').then((m) => ({ default: m.MetronomeQuest })),
)
const MouthpieceQuest = lazy(() =>
  import('../../components/quests/MouthpieceQuest').then((m) => ({ default: m.MouthpieceQuest })),
)
const NoteEchoQuest = lazy(() =>
  import('../../components/quests/NoteEchoQuest').then((m) => ({ default: m.NoteEchoQuest })),
)
const ReviewWeakQuest = lazy(() =>
  import('../../components/quests/ReviewWeakQuest').then((m) => ({ default: m.ReviewWeakQuest })),
)
const SlowFastQuest = lazy(() =>
  import('../../components/quests/SlowFastQuest').then((m) => ({ default: m.SlowFastQuest })),
)
const StaffIntroQuest = lazy(() =>
  import('../../components/quests/StaffIntroQuest').then((m) => ({ default: m.StaffIntroQuest })),
)
const StreakGateQuest = lazy(() =>
  import('../../components/quests/StreakGateQuest').then((m) => ({ default: m.StreakGateQuest })),
)
const TwoNotesQuest = lazy(() =>
  import('../../components/quests/TwoNotesQuest').then((m) => ({ default: m.TwoNotesQuest })),
)

function QuestLoadingFallback() {
  const { t } = useI18n()
  return (
    <p className="brutal-type-hint text-center text-foreground-muted">{t.strings.loading}</p>
  )
}

function renderQuestBody(
  quest: QuestDefinition,
  onComplete: () => void,
  t: ReturnType<typeof useI18n>['t'],
) {
  const fallback = <QuestLoadingFallback />

  switch (quest.type) {
    case 'breathing':
      return (
        <Suspense fallback={fallback}>
          <BreathingQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'buzz':
      return (
        <Suspense fallback={fallback}>
          <BuzzQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'lip-warmup':
      return (
        <Suspense fallback={fallback}>
          <LipWarmupQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'mouthpiece':
      return (
        <Suspense fallback={fallback}>
          <MouthpieceQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'dynamics':
      return (
        <Suspense fallback={fallback}>
          <DynamicsQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'metronome': {
      const metronomeConfig =
        quest.config?.kind === 'metronome' ? quest.config.data : undefined
      return (
        <Suspense fallback={fallback}>
          <MetronomeQuest
            onComplete={onComplete}
            bpm={metronomeConfig?.bpm}
            totalBeats={metronomeConfig?.totalBeats}
            requiredHits={metronomeConfig?.requiredHits}
          />
        </Suspense>
      )
    }
    case 'hold-note':
      return (
        <Suspense fallback={fallback}>
          <HoldNoteQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'two-notes':
      return (
        <Suspense fallback={fallback}>
          <TwoNotesQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'daily-mini':
      return (
        <Suspense fallback={fallback}>
          <DailyMiniQuest onComplete={onComplete} />
        </Suspense>
      )
    case 'pitch-hold':
      if (quest.config?.kind === 'pitch-hold') {
        return (
          <Suspense fallback={fallback}>
            <ConfigurablePitchHoldQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'pitch-sequence':
      if (quest.config?.kind === 'pitch-sequence') {
        return (
          <Suspense fallback={fallback}>
            <ConfigurablePitchSequenceQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'checklist':
      if (quest.config?.kind === 'checklist') {
        return (
          <Suspense fallback={fallback}>
            <ChecklistQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'slow-fast':
      if (quest.config?.kind === 'slow-fast') {
        return (
          <Suspense fallback={fallback}>
            <SlowFastQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'note-echo':
      if (quest.config?.kind === 'note-echo') {
        return (
          <Suspense fallback={fallback}>
            <NoteEchoQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'staff-intro':
      if (quest.config?.kind === 'staff-intro') {
        return (
          <Suspense fallback={fallback}>
            <StaffIntroQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'complex-flow':
      if (quest.config?.kind === 'complex-flow') {
        return (
          <Suspense fallback={fallback}>
            <ComplexFlowQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'streak-gate':
      if (quest.config?.kind === 'streak-gate') {
        return (
          <Suspense fallback={fallback}>
            <StreakGateQuest config={quest.config.data} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'crescendo':
      if (quest.config?.kind === 'crescendo') {
        return (
          <Suspense fallback={fallback}>
            <CrescendoQuest steps={quest.config.data.steps} onComplete={onComplete} />
          </Suspense>
        )
      }
      break
    case 'review-weak':
      return (
        <Suspense fallback={fallback}>
          <ReviewWeakQuest onComplete={onComplete} />
        </Suspense>
      )
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
      <BrutalLink to="/" leadingIcon="arrow-left">
        {t.strings.backToMap}
      </BrutalLink>

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
