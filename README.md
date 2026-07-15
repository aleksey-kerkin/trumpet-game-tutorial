# Трубач на коне

Игровой веб-тренажёр для обучения игре на трубе (PWA).

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Zustand + IndexedDB (прогресс)
- vite-plugin-pwa

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Структура

```
src/
├── app/          # роутинг, layout, страницы
├── game/         # XP, уровни, streak, persistence
├── lessons/      # каталог квестов
├── components/   # UI и мини-игры квестов
├── content/      # тексты RU/EN
└── audio/        # микрофон, pitch, метроном
```

## Документация (локально)

Внутренние заметки и карта курса — в `.cursor/docs/` (не в git):

- `.cursor/docs/quest-map-30.md` — карта 30 квестов
- `.cursor/docs/rights-strategy.md` — стратегия прав
- `.cursor/plans/` — планы разработки

## MVP

Реализованы все 30 квестов: от знакомства с трубой до первой мелодии.

План разработки: `.cursor/plans/trumpet_learning_game_941c7163.plan.md`
