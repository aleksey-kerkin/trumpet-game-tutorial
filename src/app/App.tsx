import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { useGameStore } from '../game/store'
import { useI18n } from '../i18n'
import { useLocaleStore } from '../i18n/store'

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const QuestPage = lazy(() =>
  import('./pages/QuestPage').then((m) => ({ default: m.QuestPage })),
)

function RouteLoadingFallback() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-40 items-center justify-center font-semibold text-foreground-muted">
      {t.strings.loading}
    </div>
  )
}

function AppBootstrap() {
  const hydrateGame = useGameStore((s) => s.hydrate)
  const gameHydrated = useGameStore((s) => s.hydrated)
  const hydrateLocale = useLocaleStore((s) => s.hydrate)
  const localeHydrated = useLocaleStore((s) => s.hydrated)
  const { t } = useI18n()

  useEffect(() => {
    hydrateLocale()
    void hydrateGame()
  }, [hydrateGame, hydrateLocale])

  if (!gameHydrated || !localeHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center font-semibold text-foreground-muted">
        {t.strings.loading}
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="about"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="quest/:questId"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <QuestPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppBootstrap
