import type { QuestDefinition } from '../lessons/types'
import type { AboutContent, CourseWeek } from './types'

export interface QuestUiMessages {
  shared: {
    startMicrophone: string
    stop: string
    tryAgain: string
    retry: string
    startMetronome: string
    complete: string
    backToMap: string
    backToQuestMap: string
    holdProgress: string
  }
  breathing: {
    hint: (cyclesRequired: number) => string
    phases: { inhale: string; hold: string; exhale: string }
    ready: string
    cyclesProgress: (done: number, required: number) => string
    startButton: string
    completeButton: string
  }
  dailyMini: {
    warmup: {
      hint: string
      title: string
      items: readonly [string, string]
      nextButton: string
    }
    rhythm: {
      title: (bpm: number) => string
      tapLabel: string
      hitsProgress: (hits: number, total: number) => string
      toPitchButton: string
      againButton: string
    }
    pitch: { title: string; noteLabel: string }
    done: { message: string }
  }
  metronome: {
    hint: (requiredHits: number, totalBeats: number, bpm: number) => string
    tapZoneSubtitle: string
    hitsDuringRun: (hits: number) => string
    result: (hits: number, attempts: number) => string
    successButton: string
  }
  slowFast: {
    roundHint: (current: number, total: number, bpm: number) => string
  }
  buzz: {
    idleMessage: string
    listeningMessage: string
    successMessage: string
    errorMessage: string
    completeLabel: string
  }
  mouthpiece: {
    idleMessage: string
    listeningMessage: string
    successMessage: string
    errorMessage: string
    completeLabel: string
  }
  dynamics: {
    hints: {
      idle: string
      quiet: string
      loud: string
      done: string
      error: string
    }
    meter: { quiet: string; loud: string }
    completeButton: string
  }
  crescendo: {
    hint: (steps: number) => string
    stepLabel: (current: number) => string
    completeButton: string
  }
  lipWarmup: {
    successLabel: string
    items: {
      massage: { label: string; hint: string }
      rr: { label: string; hint: string }
      buzz: { label: string; hint: string }
      stretch: { label: string; hint: string }
    }
  }
  checklist: {
    hint: string
    aria: { done: string; mark: (label: string) => string }
    timerButton: (seconds: number) => string
    manualDoneButton: (label: string) => string
  }
  holdNote: { label: string }
  twoNotes: {
    successLabel: string
    steps: { c4: string; e4: string }
  }
  pitchHold: {
    hint: (label: string, toleranceCents: number, holdSeconds: number) => string
    referenceButton: string
    completeButton: string
  }
  pitchSequence: {
    hint: (holdSeconds: number) => string
    referenceButton: (label: string) => string
    startMicrophoneFirst: string
    startMicrophoneNext: string
  }
  noteEcho: {
    hint: string
    listenButton: (label: string) => string
    holdProgressLabel: string
    startMicrophoneButton: string
    listenAgainButton: string
    completeButton: string
  }
  staffIntro: {
    learnHint: string
    learnBody: string
    toQuizButton: string
    quizHint: string
    quizWrong: string
    quizCorrect: string
    completeButton: string
  }
  complexFlow: {
    warmupStepTitle: string
    sequenceStepTitle: string
  }
  reviewWeak: {
    emptyHint: string
    hint: string
    repeatLink: (title: string) => string
    alreadyDoneButton: string
  }
  streakGate: {
    hint: (minStreak: number) => string
    progress: (minStreak: number) => string
    successButton: (minStreak: number) => string
    lockedHint: string
  }
  pitchTuner: {
    zones: { silent: string; cold: string; warm: string; hot: string }
    axis: { below: string; target: string; above: string }
    scaleAriaLabel: (label: string, targetHz: number) => string
  }
}

export interface ShellStrings {
  appName: string
  questMap: string
  questRangeLabel: string
  backToMap: string
  questCompleted: string
  questInDevelopment: string
  returnToMap: string
  xpGained: (xp: number) => string
  level: string
  streak: string
  streakDays: (days: number) => string
  locked: string
  mascotQuestIntro: (title: string) => string
  mascotQuestDone: string
  heroTitle: string
  heroLead: string
  heroCtaAbout: string
  marqueeItems: readonly string[]
  footerAbout: string
  footerCopyright: (year: number) => string
  weekProgress: (done: number, total: number) => string
  loading: string
  langSwitchLabel: string
  langRu: string
  langEn: string
  noteStaffAriaLabel: string
  resetProgress: string
  resetProgressConfirmTitle: string
  resetProgressConfirmMessage: string
  resetProgressConfirm: string
  cancel: string
}

export interface Messages {
  strings: ShellStrings
  weeks: CourseWeek[]
  catalog: QuestDefinition[]
  about: AboutContent
  quests: QuestUiMessages
}
