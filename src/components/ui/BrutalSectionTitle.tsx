import type { HTMLAttributes, ReactNode } from 'react'
import { BrutalDivider } from './BrutalDivider'
import { cn } from './cn'

type BrutalDividerVariant = 'brass' | 'wine' | 'surface'
type BrutalSectionDivider = 'inline' | 'below'

interface BrutalSectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  divider?: BrutalSectionDivider
  dividerVariant?: BrutalDividerVariant
  children?: ReactNode
}

export function BrutalSectionTitle({
  title,
  subtitle,
  divider,
  dividerVariant = 'surface',
  className,
  children,
  ...props
}: BrutalSectionTitleProps) {
  return (
    <div className={cn('space-y-2 overflow-visible', className)} {...props}>
      {divider === 'inline' ? (
        <div className="flex items-end gap-4 pb-px">
          <h2 className="shrink-0 font-display text-title font-bold uppercase tracking-brutal text-main">
            {title}
          </h2>
          <BrutalDivider variant={dividerVariant} width="full" className="mb-0.5 min-w-0 flex-1" />
        </div>
      ) : (
        <h2 className="font-display text-title font-bold uppercase tracking-brutal text-main">
          {title}
        </h2>
      )}
      {subtitle && <p className="text-body-sm text-foreground-muted">{subtitle}</p>}
      {divider === 'below' && (
        <div className="pb-px pt-1">
          <BrutalDivider variant={dividerVariant} width="full" />
        </div>
      )}
      {children}
    </div>
  )
}
