import { enMessages } from '../content/en'
import { ruMessages } from '../content/ru'
import type { Locale } from '../i18n/types'
import type { QuestDefinition } from './types'

const catalogs: Record<Locale, QuestDefinition[]> = {
  ru: ruMessages.catalog,
  en: enMessages.catalog,
}

const LEGACY_QUEST_IDS: Record<string, string> = {
  'assemble-trumpet': 'trumpet-basics',
}

export function migrateCompletedQuestIds(ids: string[]): string[] {
  const migrated = ids.map((id) => LEGACY_QUEST_IDS[id] ?? id)
  const unique = [...new Set(migrated)]
  if (unique.includes('hold-c4') && !unique.includes('staff-basics')) {
    unique.push('staff-basics')
  }
  return unique
}

export function getQuestCatalog(locale: Locale): QuestDefinition[] {
  return catalogs[locale]
}

export function getQuestById(id: string, locale: Locale): QuestDefinition | undefined {
  return getQuestCatalog(locale).find((quest) => quest.id === id)
}

export function getQuestStatus(
  quest: QuestDefinition,
  completedIds: Set<string>,
): 'locked' | 'available' | 'completed' {
  if (completedIds.has(quest.id)) return 'completed'
  if (!quest.unlockAfter) return 'available'
  if (completedIds.has(quest.unlockAfter)) return 'available'
  return 'locked'
}
