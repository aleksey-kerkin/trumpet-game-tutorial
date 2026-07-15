import { Outlet, useLocation } from 'react-router-dom'
import { PlayerStats } from '../../components/PlayerStats'
import { BrutalFooter, BrutalHero, BrutalLangSwitch, BrutalLink, BrutalMarquee, BrutalNav } from '../../components/ui'
import { useI18n } from '../../i18n'

export function AppLayout() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg px-4 py-6 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-8 xl:max-w-5xl">
      <header className="mb-6 space-y-4">
        <BrutalNav title={t.strings.appName}>
          <BrutalLangSwitch />
        </BrutalNav>
        <BrutalMarquee items={[...t.strings.marqueeItems]} />
      </header>
      {isHome && (
        <div className="mb-6">
          <BrutalHero
            title={t.strings.heroTitle}
            lead={t.strings.heroLead}
            actions={
              <BrutalLink to="/about" variant="ghost">
                {t.strings.heroCtaAbout}
              </BrutalLink>
            }
          />
        </div>
      )}
      <div className="mb-6">
        <PlayerStats />
      </div>
      <main>
        <Outlet />
      </main>
      <BrutalFooter
        aboutLabel={t.strings.footerAbout}
        copyright={t.strings.footerCopyright(new Date().getFullYear())}
      />
    </div>
  )
}
