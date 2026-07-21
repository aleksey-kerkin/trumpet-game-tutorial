import type { NoteId } from '../music/notes'

export interface PitchStep {
  noteId: NoteId
}

export interface PitchHoldConfig {
  noteId: NoteId
  toleranceCents: number
  holdMs: number
  showStaff?: boolean
}

export interface PitchSequenceConfig {
  steps: PitchStep[]
  toleranceCents: number
  holdMs: number
  successLabel: string
  showStaff?: boolean
}

export interface ChecklistItem {
  id: string
  label: string
  hint: string
  seconds?: number
}

export interface ChecklistConfig {
  items: ChecklistItem[]
  successLabel: string
}

export interface MetronomeConfig {
  bpm: number
  totalBeats: number
  requiredHits: number
}

export interface SlowFastConfig {
  rounds: MetronomeConfig[]
}

export interface NoteEchoStep {
  noteId: NoteId
}

export interface NoteEchoConfig {
  steps: NoteEchoStep[]
  toleranceCents: number
  holdMs: number
  showStaff?: boolean
}

export interface StaffIntroConfig {
  introNoteId: NoteId
  quizNoteId: NoteId
  quizOptions: NoteId[]
}

export interface ComplexFlowConfig {
  warmup: ChecklistConfig
  sequence: PitchSequenceConfig
}

export interface StreakGateConfig {
  minStreak: number
}

export type QuestConfig =
  | { kind: 'pitch-hold'; data: PitchHoldConfig }
  | { kind: 'pitch-sequence'; data: PitchSequenceConfig }
  | { kind: 'checklist'; data: ChecklistConfig }
  | { kind: 'metronome'; data: MetronomeConfig }
  | { kind: 'slow-fast'; data: SlowFastConfig }
  | { kind: 'note-echo'; data: NoteEchoConfig }
  | { kind: 'staff-intro'; data: StaffIntroConfig }
  | { kind: 'complex-flow'; data: ComplexFlowConfig }
  | { kind: 'streak-gate'; data: StreakGateConfig }
  | { kind: 'crescendo'; data: { steps: number } }
  | { kind: 'review-weak'; data: Record<string, never> }
