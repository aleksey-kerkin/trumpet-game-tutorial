import { getMessages } from './messages'
import { useLocaleStore } from './store'

export function useI18n() {
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)
  const t = getMessages(locale)

  return { locale, setLocale, t }
}
