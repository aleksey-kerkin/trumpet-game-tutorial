import { BrutalLink } from './BrutalLink'

interface BrutalFooterProps {
  aboutLabel: string
  copyright?: string
}

export function BrutalFooter({ aboutLabel, copyright }: BrutalFooterProps) {
  return (
    <footer className="mt-10 border-t-[3px] border-border pt-4 text-center text-xs text-foreground-muted">
      {copyright && <p>{copyright}</p>}
      <BrutalLink to="/about" className="mt-2 inline-block text-xs">
        {aboutLabel}
      </BrutalLink>
    </footer>
  )
}
