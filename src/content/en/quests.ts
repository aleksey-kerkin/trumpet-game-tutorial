export const quests = {
  shared: {
    startMicrophone: 'Turn on microphone',
    stop: 'Stop',
    tryAgain: 'Try again',
    retry: 'Retry',
    startMetronome: 'Start metronome',
    complete: 'Complete',
    backToMap: 'Back to map',
    backToQuestMap: 'Back to quest map',
    holdProgress: 'Hold',
  },
  breathing: {
    hint: (cyclesRequired: number) =>
      `Breathe with your belly: 4 seconds in, 2 seconds hold, 6 seconds out. Complete ${cyclesRequired} cycles.`,
    phases: {
      inhale: 'Inhale',
      hold: 'Hold',
      exhale: 'Exhale',
    },
    ready: 'Ready?',
    cyclesProgress: (done: number, required: number) => `Cycles: ${done}/${required}`,
    startButton: 'Start breathing',
    completeButton: 'Breathing mastered!',
  },
  dailyMini: {
    warmup: {
      hint: 'Mini routine: warmup → rhythm → one note. Like a short Dokshitser-style lesson.',
      title: '1. Warmup',
      items: ['Lip massage 15 sec', '5 slow buzzes'],
      nextButton: 'To rhythm',
    },
    rhythm: {
      title: (bpm: number) => `2. Rhythm — ${bpm} BPM`,
      tapLabel: 'Tap in time',
      hitsProgress: (hits: number, total: number) => `Hits: ${hits}/${total}`,
      toPitchButton: 'To middle C',
      againButton: 'Again',
    },
    pitch: {
      title: '3. One note',
      noteLabel: 'Middle C (C4)',
    },
    done: {
      message: 'Daily mini routine complete!',
    },
  },
  metronome: {
    hint: (requiredHits: number, totalBeats: number, bpm: number) =>
      `Listen to the metronome clicks and tap in time. Hit at least ${requiredHits} of ${totalBeats} beats (${bpm} BPM).`,
    tapZoneSubtitle: 'BPM — tap here',
    hitsDuringRun: (hits: number) => `Hits: ${hits}`,
    result: (hits: number, attempts: number) =>
      `Result: ${hits} accurate hits out of ${attempts} taps`,
    successButton: 'Rhythm in the pocket!',
  },
  slowFast: {
    roundHint: (current: number, total: number, bpm: number) =>
      `Round ${current} of ${total}: tempo ${bpm} BPM`,
  },
  buzz: {
    idleMessage: 'Press the button and produce a steady lip buzz.',
    listeningMessage: 'Listening… Press your lips together and make a “brrr”.',
    successMessage: 'Great buzz! Your lips are working correctly.',
    errorMessage:
      'Could not access the microphone. Allow audio recording in your browser.',
    completeLabel: 'Buzz achieved!',
  },
  mouthpiece: {
    idleMessage:
      'Use only the mouthpiece. Press the button and hold a steady sound for at least one second.',
    listeningMessage: 'Listening… Blow evenly, without jerks. Hold the sound.',
    successMessage: 'First mouthpiece sound! Great start.',
    errorMessage:
      'Microphone unavailable. Move the trumpet closer or try on a computer.',
    completeLabel: 'Sound achieved!',
  },
  dynamics: {
    hints: {
      idle: 'Start quiet, then loud. We are not judging pitch — only breath strength.',
      quiet: 'Play a quiet steady sound and hold it.',
      loud: 'Now the same sound, but noticeably louder.',
      done: 'Great air control!',
      error: 'Microphone access is required.',
    },
    meter: {
      quiet: 'Quiet',
      loud: 'Loud',
    },
    completeButton: 'Dynamics mastered!',
  },
  crescendo: {
    hint: (steps: number) =>
      `Gradually increase volume: ${steps} steps from quiet to loud.`,
    stepLabel: (current: number) => `Step ${current}`,
    completeButton: 'Crescendo complete!',
  },
  lipWarmup: {
    successLabel: 'Warmup complete!',
    items: {
      massage: {
        label: 'Lip massage',
        hint: 'Massage your lips with your fingertips',
      },
      rr: {
        label: '“Rah-rah”',
        hint: 'Say “rah-rah” with light lip resistance',
      },
      buzz: {
        label: '5 slow buzzes',
        hint: 'Make five calm buzzes in a row',
      },
      stretch: {
        label: 'Corner stretch',
        hint: 'Pull the corners of your lips outward and relax',
      },
    },
  },
  checklist: {
    hint: 'Check off each step. You can start a timer or mark it manually.',
    aria: {
      done: 'Done',
      mark: (label: string) => `Mark as done: ${label}`,
    },
    timerButton: (seconds: number) => `${seconds}s`,
    manualDoneButton: (label: string) => `Done — “${label}”`,
  },
  holdNote: {
    label: 'Middle C (C4)',
  },
  twoNotes: {
    successLabel: 'Two notes in a row!',
    steps: {
      c4: 'Middle C (C4)',
      e4: 'E (E4)',
    },
  },
  pitchHold: {
    hint: (label: string, toleranceCents: number, holdSeconds: number) =>
      `Hold the note “${label}” within ±${toleranceCents} cents (${holdSeconds} s).`,
    referenceButton: 'Play reference',
    completeButton: 'Note held!',
  },
  pitchSequence: {
    hint: (holdSeconds: number) =>
      `Play the notes in order. Hold each one for ~${holdSeconds} s.`,
    referenceButton: (label: string) => `Reference: ${label}`,
    startMicrophoneFirst: 'Turn on microphone',
    startMicrophoneNext: 'Next note — turn on microphone',
  },
  noteEcho: {
    hint: 'Listen to the mentor note and repeat it on your instrument.',
    listenButton: (label: string) => `Listen: ${label}`,
    holdProgressLabel: 'Repeat the note',
    startMicrophoneButton: 'Turn on microphone and repeat',
    listenAgainButton: 'Listen again',
    completeButton: 'Ear training in action!',
  },
  complexFlow: {
    warmupStepTitle: 'Step 1 — warmup',
    sequenceStepTitle: 'Step 2 — vocalise and sequence',
  },
  reviewWeak: {
    emptyHint: 'Complete a few more quests — then we will return to review.',
    hint: 'Your mentor suggests repeating a quest with a foundational skill — no rush.',
    repeatLink: (title: string) => `Repeat “${title}”`,
    alreadyDoneButton: 'Already reviewed — complete quest',
  },
  streakGate: {
    hint: (minStreak: number) =>
      `Play every day and build a streak of ${minStreak} days in a row.`,
    progress: (minStreak: number) => `of ${minStreak} days`,
    successButton: (minStreak: number) => `${minStreak}-day streak — reward yours!`,
    lockedHint: 'Come back tomorrow and complete any quest to extend your streak.',
  },
  pitchTuner: {
    zones: {
      silent: 'Waiting for sound…',
      cold: 'Cold — far off',
      warm: 'Getting warmer…',
      hot: 'Hot — nailed it!',
    },
    axis: {
      below: 'below',
      target: 'target',
      above: 'above',
    },
  },
} as const
