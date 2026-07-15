export interface PitchStep {
  label: string
  hz: number
}

export interface PitchHoldConfig {
  label: string
  hz: number
  toleranceCents: number
  holdMs: number
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
  label: string
  toneNote: string
  hz: number
}

export interface NoteEchoConfig {
  steps: NoteEchoStep[]
  toleranceCents: number
  holdMs: number
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
  | { kind: 'complex-flow'; data: ComplexFlowConfig }
  | { kind: 'streak-gate'; data: StreakGateConfig }
  | { kind: 'crescendo'; data: { steps: number } }
  | { kind: 'review-weak'; data: Record<string, never> }
