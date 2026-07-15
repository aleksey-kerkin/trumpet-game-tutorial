import { useMemo } from 'react'
import { useGameStore } from '../../game/store'
import { getQuestCatalog } from '../../lessons/catalog'
import { useI18n } from '../../i18n'
import { BrutalButton, BrutalCard, BrutalLink } from '../ui'
import { questHintClass } from './quest-ui'

interface ReviewWeakQuestProps {
  onComplete: () => void
}

export function ReviewWeakQuest({ onComplete }: ReviewWeakQuestProps) {
  const { locale, t } = useI18n()
  const q = t.quests.reviewWeak
  const shared = t.quests.shared

  const completedQuestIds = useGameStore((s) => s.completedQuestIds)
  const catalog = getQuestCatalog(locale)

  const suggested = useMemo(() => {
    const completedEarly = catalog.filter(
      (quest) => completedQuestIds.includes(quest.id) && quest.order <= 14,
    )
    return completedEarly.length > 0
      ? completedEarly.reduce((weakest, quest) =>
          quest.xpReward < weakest.xpReward ? quest : weakest,
        )
      : catalog.find((quest) => quest.order === 3)
  }, [catalog, completedQuestIds])

  if (!suggested) {
    return (
      <div className="space-y-4 text-center">
        <p className={questHintClass}>{q.emptyHint}</p>
        <BrutalLink to="/">{shared.backToMap}</BrutalLink>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className={questHintClass}>{q.hint}</p>

      <BrutalCard>
        <div className="font-display text-title font-bold">{suggested.title}</div>
        <div className="mt-1 text-body-sm opacity-80">{suggested.description}</div>
      </BrutalCard>

      <BrutalLink to={`/quest/${suggested.id}`} variant="primary" className="block w-full">
        {q.repeatLink(suggested.title)}
      </BrutalLink>

      <BrutalButton variant="ghost" fullWidth onClick={onComplete}>
        {q.alreadyDoneButton}
      </BrutalButton>
    </div>
  )
}
