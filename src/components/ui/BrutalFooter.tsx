import { BrutalIcon } from '../icons'
import { BrutalLink } from './BrutalLink'
import { cn } from './cn'

interface BrutalFooterProps {
  aboutLabel: string
  copyright?: string
}

const AUTHOR_GITHUB_URL = 'https://github.com/aleksey-kerkin'
const AUTHOR_TELEGRAM_URL = 'https://t.me/aleksey_kerkin'

const socialLinkClass =
  'inline-flex min-h-11 min-w-11 items-center justify-center text-main transition-colors hover:text-jazz-blue focus-visible:brutal-focus'

export function BrutalFooter({ aboutLabel, copyright }: BrutalFooterProps) {
  return (
    <footer className="mt-10 border-t-[3px] border-border pt-4 text-center text-xs text-foreground-muted">
      {copyright && (
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>{copyright}</span>
          <span className="inline-flex items-center gap-2" aria-label="Author links">
            <a
              href={AUTHOR_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub — Aleksey Kerkin"
              className={socialLinkClass}
            >
              <BrutalIcon name="github" size="xs" />
            </a>
            <a
              href={AUTHOR_TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram — @aleksey_kerkin"
              className={socialLinkClass}
            >
              <BrutalIcon name="telegram" size="xs" />
            </a>
          </span>
        </p>
      )}
      <BrutalLink to="/about" className={cn('mt-2 inline-block text-xs')}>
        {aboutLabel}
      </BrutalLink>
    </footer>
  )
}
