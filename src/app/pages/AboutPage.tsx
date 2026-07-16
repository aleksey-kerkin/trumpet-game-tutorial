import { BrutalCard, BrutalLink, BrutalSectionTitle } from '../../components/ui'
import { useI18n } from '../../i18n'

export function AboutPage() {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      <BrutalLink to="/" leadingIcon="arrow-left">{t.about.backLink}</BrutalLink>
      <BrutalSectionTitle title={t.about.title} divider="inline" />
      <div className="space-y-4">
        {t.about.faq.map((item) => (
          <BrutalCard key={item.q} className="space-y-2 text-body leading-relaxed">
            <h3 className="font-display text-title font-bold text-main">{item.q}</h3>
            <p className="text-main-foreground/90">{item.a}</p>
          </BrutalCard>
        ))}
      </div>
    </div>
  )
}
