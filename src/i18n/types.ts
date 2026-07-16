export type Locale = 'ru' | 'en'

export interface CourseWeek {
  id: number
  title: string
  subtitle: string
  questFrom: number
  questTo: number
}

export interface FaqItem {
  q: string
  a: string
}

export interface AboutContent {
  backLink: string
  title: string
  faq: FaqItem[]
}
