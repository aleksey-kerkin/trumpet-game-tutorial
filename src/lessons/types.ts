import type { QuestConfig } from './quest-config'

export type QuestType =
  | 'breathing'
  | 'buzz'
  | 'lip-warmup'
  | 'mouthpiece'
  | 'dynamics'
  | 'metronome'
  | 'hold-note'
  | 'two-notes'
  | 'daily-mini'
  | 'pitch-hold'
  | 'pitch-sequence'
  | 'checklist'
  | 'slow-fast'
  | 'note-echo'
  | 'complex-flow'
  | 'streak-gate'
  | 'crescendo'
  | 'review-weak'

export type QuestStatus = 'locked' | 'available' | 'completed'

export interface QuestDefinition {
  id: string
  order: number
  title: string
  description: string
  skill: string
  xpReward: number
  type: QuestType
  unlockAfter?: string
  config?: QuestConfig
}
