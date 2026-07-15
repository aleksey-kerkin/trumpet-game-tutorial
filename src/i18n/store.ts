import { create } from 'zustand'
import type { Locale } from './types'

const STORAGE_KEY = 'trumpet-locale'

interface LocaleState {
  locale: Locale
  hydrated: boolean
  hydrate: () => void
  setLocale: (locale: Locale) => void
}

function detectDefaultLocale(): Locale {
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'ru'
}

function applyDocumentLang(locale: Locale) {
  document.documentElement.lang = locale
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'ru',
  hydrated: false,

  hydrate: () => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    const locale = stored === 'en' || stored === 'ru' ? stored : detectDefaultLocale()
    applyDocumentLang(locale)
    set({ locale, hydrated: true })
  },

  setLocale: (locale) => {
    localStorage.setItem(STORAGE_KEY, locale)
    applyDocumentLang(locale)
    set({ locale })
  },
}))
