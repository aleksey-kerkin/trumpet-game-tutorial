import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrutalLink } from './BrutalLink'

interface BrutalNavProps {
  title: string
  children?: ReactNode
}

export function BrutalNav({ title, children }: BrutalNavProps) {
  return (
    <nav className="flex items-center justify-between gap-4">
      <Link
        to="/"
        className="min-w-0 flex-1 truncate font-display text-headline font-extrabold uppercase tracking-tight text-foreground no-underline transition-colors hover:text-jazz-blue focus-visible:brutal-focus"
      >
        {title}
      </Link>
      <div className="flex items-center gap-2">{children}</div>
    </nav>
  )
}

interface BrutalNavLinkProps {
  to: string
  children: ReactNode
}

export function BrutalNavLink({ to, children }: BrutalNavLinkProps) {
  return (
    <BrutalLink to={to} variant="secondary" size="sm">
      {children}
    </BrutalLink>
  )
}
