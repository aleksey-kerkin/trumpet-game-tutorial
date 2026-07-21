import type { CourseWeek } from '../../i18n/types'

export const weeks: CourseWeek[] = [
  {
    id: 1,
    title: 'Неделя 1 — Посадка в седло',
    subtitle: 'Инструмент, дыхание, эмбушюра, ритм',
    questFrom: 1,
    questTo: 7,
  },
  {
    id: 2,
    title: 'Неделя 2 — Первые тропы',
    subtitle: 'Первые ноты, устойчивость, слух',
    questFrom: 8,
    questTo: 15,
  },
  {
    id: 3,
    title: 'Неделя 3 — Вокализ на привале',
    subtitle: 'Вокализ, интервалы, темп',
    questFrom: 16,
    questTo: 22,
  },
  {
    id: 4,
    title: 'Неделя 4 — Комплекс и мелодия',
    subtitle: 'Комплекс дня, повторение, первая мелодия',
    questFrom: 23,
    questTo: 31,
  },
]
