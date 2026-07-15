import { enMessages } from '../content/en'
import { ruMessages } from '../content/ru'
import type { Messages } from './messages-types'
import type { Locale } from './types'

const catalogs: Record<Locale, Messages> = {
  ru: ruMessages,
  en: enMessages,
}

export function getMessages(locale: Locale): Messages {
  return catalogs[locale]
}

export type { Messages } from './messages-types'
