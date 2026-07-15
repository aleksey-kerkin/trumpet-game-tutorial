# Карта курса — Trumpet Learning Game

Краткий статус. Полная карта: **[quest-map-30.md](quest-map-30.md)**.

OCR гл. 1: **[extracted/ch1-outline.md](extracted/ch1-outline.md)** ✅  
Права / публичный релиз: **[rights-strategy.md](rights-strategy.md)** ✅

## Все 30 квестов — реализованы ✅

| Неделя | Квесты | Статус |
|--------|--------|--------|
| 1 | 1–7 | ✅ |
| 2 | 8–14 | ✅ |
| 3 | 15–21 | ✅ |
| 4 | 22–30 | ✅ |

## Стек фаз 2–3

- **Pitch:** pitchy + конфигурируемые квесты удержания и секвенций
- **Tone.js:** квест «Повтори за наставником»
- **VexFlow:** нотный стан в вокализах и мелодиях
- **Комплекс дня:** `ComplexFlowQuest` (разминка → секвенция)

## Открыто

- **Деплой PWA** (Vercel/Netlify) — `phase1-deploy`
- **Фаза 4** — интеграция нот из учебников после лицензии (отменена до решения по правам)

## PDF pipeline

```bash
cd tools/pdf-pipeline && source .venv/bin/activate
python ocr_text.py --all-pages
```
