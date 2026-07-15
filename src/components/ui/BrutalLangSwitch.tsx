import { cn } from './cn'
import { useI18n } from '../../i18n'
import type { Locale } from '../../i18n/types'

export function BrutalLangSwitch() {
  const { locale, setLocale, t } = useI18n()

  const options: { value: Locale; label: string }[] = [
    { value: 'ru', label: t.strings.langRu },
    { value: 'en', label: t.strings.langEn },
  ]

  return (
    <div
      role="group"
      aria-label={t.strings.langSwitchLabel}
      className="inline-flex rounded-[var(--border-radius)] brutal-border brutal-shadow-sm"
    >
      {options.map((option) => {
        const active = locale === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(option.value)}
            className={cn(
              'brutal-pressable px-3.5 py-2 text-meta font-bold transition first:rounded-l-[2px] last:rounded-r-[2px]',
              active
                ? 'bg-main !text-main-foreground'
                : 'bg-secondary-background !text-main-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
