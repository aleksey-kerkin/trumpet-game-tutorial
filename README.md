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
├── content/ru/   # тексты
└── audio/        # звук (фаза 2+)
docs/
└── curriculum.md # карта курса
```

## MVP

Реализованы первые 3 квеста: сборка трубы, дыхание 4-2-6, buzz с микрофоном.

План разработки: `.cursor/plans/trumpet_learning_game_941c7163.plan.md`  
Стратегия прав (публичный релиз): `docs/rights-strategy.md`
