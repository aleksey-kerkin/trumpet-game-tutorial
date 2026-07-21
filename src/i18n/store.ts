import { create } from 'zustand'
import type { Locale } from './types'

const STORAGE_KEY = 'trumpet-locale'
const DEFAULT_LOCALE: Locale = 'en'

interface LocaleState {
  locale: Locale
  hydrated: boolean
  hydrate: () => void
  setLocale: (locale: Locale) => void
}

function applyDocumentLang(locale: Locale) {
  document.documentElement.lang = locale
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: DEFAULT_LOCALE,
  hydrated: false,

  hydrate: () => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    const locale = stored === 'en' || stored === 'ru' ? stored : DEFAULT_LOCALE
    applyDocumentLang(locale)
    set({ locale, hydrated: true })
  },

  setLocale: (locale) => {
    localStorage.setItem(STORAGE_KEY, locale)
    applyDocumentLang(locale)
    set({ locale })
  },
}))

if (typeof document !== 'undefined') {
  applyDocumentLang(DEFAULT_LOCALE)
}
