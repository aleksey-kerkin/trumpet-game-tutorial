import { Link } from 'react-router-dom'
import { BrutalIcon, type IconName } from './icons'
import { getQuestCatalog, getQuestStatus } from '../lessons/catalog'
import { useGameStore } from '../game/store'
import { useI18n } from '../i18n'
import type { QuestStatus } from '../lessons/types'
import {
  BrutalBadge,
  BrutalCard,
  BrutalSectionTitle,
  BrutalWeekSummary,
  cn,
} from './ui'

const statusCardVariant: Record<QuestStatus, 'surface' | 'muted' | 'success'> = {
  locked: 'muted',
  available: 'surface',
  completed: 'success',
}

const statusIcon: Record<QuestStatus, IconName> = {
  locked: 'lock',
  available: 'play',
  completed: 'check',
}

export function QuestMap() {
  const { locale, t } = useI18n()
  const completedQuestIds = useGameStore((s) => s.completedQuestIds)
  const completedSet = new Set(completedQuestIds)
  const questCatalog = getQuestCatalog(locale)

  return (
    <div className="space-y-8">
      <BrutalSectionTitle title={t.strings.questMap} divider="inline" />

      {t.weeks.map((week) => {
        const weekQuests = questCatalog.filter(
          (q) => q.order >= week.questFrom && q.order <= week.questTo,
        )
        const weekCompleted = weekQuests.filter((q) => completedSet.has(q.id)).length

        return (
          <section key={week.id} className="space-y-4">
            <BrutalWeekSummary
              title={week.title}
              questRange={`${week.questFrom}–${week.questTo}`}
              questRangeLabel={t.strings.questRangeLabel}
              completed={weekCompleted}
              total={weekQuests.length}
            />
            <p className="text-body-sm text-foreground-muted">{week.subtitle}</p>
            <ol className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {weekQuests.map((quest) => {
                const status = getQuestStatus(quest, completedSet)
                const isPlayable = status !== 'locked'

                const content = (
                  <BrutalCard
                    variant={statusCardVariant[status]}
                    interactive={status === 'available'}
                    className={cn(
                      'relative flex items-center gap-4',
                      status === 'locked' && 'dashed opacity-80',
                    )}
                    dashed={status === 'locked'}
                    shadow={status !== 'locked'}
                  >
                    {status === 'available' && (
                      <div className="absolute left-0 top-0 h-full w-1.5 rounded-l bg-main" />
                    )}
                    <div
                      className={cn(
                        'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--border-radius)] border-[3px] border-border text-lg font-bold',
                        status === 'completed'
                          ? 'bg-jazz-success text-secondary-background'
                          : 'bg-main text-main-foreground',
                      )}
                    >
                      {quest.order}
                    </div>
                    <div className="relative flex-1">
                      <div className="font-bold">{quest.title}</div>
                      <div className="text-body-sm opacity-80">{quest.skill}</div>
                    </div>
                    <BrutalBadge
                      variant={
                        status === 'completed'
                          ? 'completed'
                          : status === 'available'
                            ? 'brass'
                            : 'locked'
                      }
                      className="relative text-base"
                    >
                      <BrutalIcon name={statusIcon[status]} size="sm" />
                    </BrutalBadge>
                  </BrutalCard>
                )

                return (
                  <li key={quest.id} className="relative">
                    {isPlayable ? (
                      <Link to={`/quest/${quest.id}`} className="block no-underline">
                        {content}
                      </Link>
                    ) : (
                      <div title={t.strings.locked}>{content}</div>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </div>
  )
}
