import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

type BrutalBadgeVariant =
  | 'default'
  | 'locked'
  | 'available'
  | 'completed'
  | 'brass'
  | 'wine'
  | 'blue'

const variantStyles: Record<BrutalBadgeVariant, string> = {
  default: 'bg-secondary-background text-main-foreground',
  locked: 'bg-secondary-background-muted text-foreground-muted',
  available: 'bg-main text-main-foreground',
  completed: 'bg-jazz-success text-secondary-background',
  brass: 'bg-main text-main-foreground',
  wine: 'bg-jazz-wine text-secondary-background',
  blue: 'bg-jazz-blue text-secondary-background',
}

interface BrutalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BrutalBadgeVariant
  children: ReactNode
}

export function BrutalBadge({
  variant = 'default',
  className,
  children,
  ...props
}: BrutalBadgeProps) {
  return (
    <span
      className={cn(
        'brutal-type-label inline-flex items-center rounded-[var(--border-radius)] border-[3px] border-border px-2.5 py-0.5',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
