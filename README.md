# Trumpeter on Horseback

A neo-brutalist web PWA for learning trumpet — short daily quests from your first lip buzz to your first melody. Microphone feedback for sound, pitch, rhythm, and dynamics.

**Live stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Zustand · IndexedDB

## Features

- **30 quests** across 4 weeks — instrument basics, breathing, embouchure, rhythm, pitch, vocalise, daily routine
- **RU / EN** UI with persisted locale
- **Progress** — XP, levels, daily streak, quest map with unlock chain
- **Web Audio** — microphone level, pitch detection ([pitchy](https://github.com/ianprime0509/pitchy)), metronome, reference tones ([Tone.js](https://tonejs.github.io/))
- **Staff notation** in select quests ([VexFlow](https://www.vexflow.com/))
- **Installable PWA** with offline shell via `vite-plugin-pwa`

## Quick start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Project layout

```
src/
├── app/           # routing, layout, pages
├── game/          # XP, levels, streak, IndexedDB persistence
├── lessons/       # quest catalog and types
├── components/    # neo-brutal UI + quest mini-games
├── content/       # RU/EN strings, quests, catalog
├── audio/         # mic, pitch, metronome, RMS
├── assets/        # Noun Project icons (traced SVG)
└── i18n/          # locale store and messages
tools/pdf-pipeline/  # local OCR pipeline (not shipped with the app)
```

## Credits

UI icons and hero decor are from [The Noun Project](https://thenounproject.com/) (CC BY 3.0). See [CREDITS.md](CREDITS.md).

## Author

© Aleksey Kerkin — [GitHub](https://github.com/aleksey-kerkin) · [Telegram](https://t.me/aleksey_kerkin)

Educational project. Not affiliated with any trumpet method book publisher.
