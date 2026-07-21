export const quests = {
  shared: {
    startMicrophone: 'Включить микрофон',
    stop: 'Остановить',
    tryAgain: 'Попробовать снова',
    retry: 'Повторить',
    startMetronome: 'Запустить метроном',
    complete: 'Завершить',
    backToMap: 'На карту',
    backToQuestMap: 'На карту квестов',
    holdProgress: 'Удержание',
  },
  breathing: {
    hint: (cyclesRequired: number) =>
      `Дыши животом: 4 секунды вдох, 2 секунды пауза, 6 секунд выдох. Пройди ${cyclesRequired} цикла.`,
    phases: {
      inhale: 'Вдох',
      hold: 'Задержка',
      exhale: 'Выдох',
    },
    ready: 'Готов?',
    cyclesProgress: (done: number, required: number) => `Циклы: ${done}/${required}`,
    startButton: 'Начать дыхание',
    completeButton: 'Дыхание освоено!',
  },
  dailyMini: {
    warmup: {
      hint: 'Мини-комплекс: разминка → ритм → одна нота. Как короткий урок по Докшицеру.',
      title: '1. Разминка',
      items: ['Массаж губ 15 сек', '5 медленных buzz'],
      nextButton: 'К ритму',
    },
    rhythm: {
      title: (bpm: number) => `2. Ритм — ${bpm} BPM`,
      tapLabel: 'Тап в такт',
      hitsProgress: (hits: number, total: number) => `Попаданий: ${hits}/${total}`,
      toPitchButton: 'К ноте «до»',
      againButton: 'Ещё раз',
    },
    pitch: {
      title: '3. Одна нота',
      noteLabel: 'До (C4)',
    },
    done: {
      message: 'Мини-комплекс дня пройден!',
    },
  },
  metronome: {
    hint: (requiredHits: number, totalBeats: number, bpm: number) =>
      `Слушай клики метронома и нажимай кнопку в такт. Нужно попасть минимум в ${requiredHits} из ${totalBeats} долей (${bpm} BPM).`,
    tapZoneSubtitle: 'BPM — тапни здесь',
    hitsDuringRun: (hits: number) => `Попаданий: ${hits}`,
    result: (hits: number, attempts: number) =>
      `Результат: ${hits} точных попаданий из ${attempts} нажатий`,
    successButton: 'Ритм в кармане!',
  },
  slowFast: {
    roundHint: (current: number, total: number, bpm: number) =>
      `Проход ${current} из ${total}: темп ${bpm} BPM`,
  },
  buzz: {
    idleMessage: 'Нажми кнопку и издай устойчивый buzz губами.',
    listeningMessage: 'Слушаю… Сожми губы и издай «бррр».',
    successMessage: 'Отличный buzz! Губы работают правильно.',
    errorMessage:
      'Не удалось получить доступ к микрофону. Разреши запись звука в браузере.',
    completeLabel: 'Buzz получен!',
  },
  mouthpiece: {
    idleMessage:
      'Возьми только мундштук. Нажми кнопку и издай устойчивый звук не меньше секунды.',
    listeningMessage: 'Слушаю… Дуй ровно, без рывков. Держи звук.',
    successMessage: 'Первый звук в мундштук получен! Отличное начало.',
    errorMessage:
      'Микрофон недоступен. Поднеси трубу ближе или попробуй на компьютере.',
    completeLabel: 'Звук есть!',
  },
  dynamics: {
    hints: {
      idle: 'Сначала тихий звук, потом громкий. Высоту не оцениваем — только силу дыхания.',
      quiet: 'Издай тихий устойчивый звук и удержи его.',
      loud: 'Теперь тот же звук, но заметно громче.',
      done: 'Отличный контроль воздуха!',
      error: 'Нужен доступ к микрофону.',
    },
    meter: {
      quiet: 'Тихо',
      loud: 'Громко',
    },
    completeButton: 'Динамика освоена!',
  },
  crescendo: {
    hint: (steps: number) =>
      `Постепенно увеличивай громкость: ${steps} ступеней от тихого к громкому.`,
    stepLabel: (current: number) => `Ступень ${current}`,
    completeButton: 'Crescendo готов!',
  },
  lipWarmup: {
    successLabel: 'Разминка завершена!',
    items: {
      massage: {
        label: 'Массаж губ',
        hint: 'Помассируй губы подушечками пальцев',
      },
      rr: {
        label: '«Раз-раз»',
        hint: 'Произнеси «раз-раз» с лёгким сопротивлением губ',
      },
      buzz: {
        label: '5 медленных buzz',
        hint: 'Сделай пять спокойных buzz подряд',
      },
      stretch: {
        label: 'Растяжка уголков',
        hint: 'Потяни уголки губ в стороны и расслабь',
      },
    },
  },
  checklist: {
    hint: 'Отметь каждый шаг. Можно запустить таймер или отметить вручную.',
    aria: {
      done: 'Выполнено',
      mark: (label: string) => `Отметить: ${label}`,
    },
    timerButton: (seconds: number) => `${seconds}с`,
    manualDoneButton: (label: string) => `Готово — «${label}»`,
  },
  holdNote: {
    label: 'До (C4)',
  },
  twoNotes: {
    successLabel: 'Две ноты подряд!',
    steps: {
      c4: 'До (C4)',
      e4: 'Ми (E4)',
    },
  },
  pitchHold: {
    hint: (label: string, toleranceCents: number, holdSeconds: number) =>
      `Удержи ноту «${label}» в допуске ±${toleranceCents} центов (${holdSeconds} с).`,
    referenceButton: 'Послушать эталон',
    completeButton: 'Нота удержана!',
  },
  pitchSequence: {
    hint: (holdSeconds: number) =>
      `Сыграй ноты по порядку. Удержи каждую ~${holdSeconds} с.`,
    referenceButton: (label: string) => `Эталон: ${label}`,
    startMicrophoneFirst: 'Включить микрофон',
    startMicrophoneNext: 'Следующая нота — включить микрофон',
  },
  noteEcho: {
    hint: 'Слушай ноту наставника и повтори её на инструменте.',
    listenButton: (label: string) => `Послушать: ${label}`,
    holdProgressLabel: 'Повтори ноту',
    startMicrophoneButton: 'Включить микрофон и повторить',
    listenAgainButton: 'Ещё раз послушать',
    completeButton: 'Слух в деле!',
  },
  staffIntro: {
    learnHint: 'Скрипичный ключ задаёт нотный стан для трубы. Ноты стоят на линиях или между ними.',
    learnBody:
      'Первая октава «до» (C4) — частая первая нота на трубе; её пишут на добавочной линейке под станом.',
    toQuizButton: 'Мини-проверка',
    quizHint: 'Какая нота выделена на стане?',
    quizWrong: 'Пока нет — посмотри на линию или междустрочье и попробуй снова.',
    quizCorrect: 'Верно — ты уже читаешь первую ноту!',
    completeButton: 'К игре на ноте',
  },
  complexFlow: {
    warmupStepTitle: 'Шаг 1 — разминка',
    sequenceStepTitle: 'Шаг 2 — вокализ и секвенция',
  },
  reviewWeak: {
    emptyHint: 'Пройди ещё несколько квестов — потом вернёмся к повторению.',
    hint: 'Наставник предлагает повторить квест с базовым навыком — без спешки.',
    repeatLink: (title: string) => `Повторить «${title}»`,
    alreadyDoneButton: 'Уже повторил — завершить квест',
  },
  streakGate: {
    hint: (minStreak: number) =>
      `Играй каждый день и набирай ${minStreak} дней подряд.`,
    progress: (minStreak: number) => `из ${minStreak} дней`,
    successButton: (minStreak: number) => `${minStreak} дней подряд — награда твоя!`,
    lockedHint: 'Вернись завтра и пройди любой квест, чтобы не прервать дни подряд.',
  },
  pitchTuner: {
    zones: {
      silent: 'Жду звук…',
      cold: 'Холодно — далеко',
      warm: 'Теплее…',
      hot: 'Горячо — попал!',
    },
    axis: {
      below: 'ниже',
      target: 'цель',
      above: 'выше',
    },
    scaleAriaLabel: (label: string, targetHz: number) =>
      `Тюнер для ${label}, цель ${Math.round(targetHz)} герц`,
  },
} as const
