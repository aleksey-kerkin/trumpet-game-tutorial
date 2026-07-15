import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

type BrutalCardVariant = 'surface' | 'blue' | 'wine' | 'success' | 'muted'

const variantStyles: Record<BrutalCardVariant, string> = {
  surface: 'bg-secondary-background text-main-foreground',
  blue: 'bg-jazz-blue text-secondary-background',
  wine: 'bg-jazz-wine text-secondary-background',
  success: 'bg-jazz-success text-secondary-background',
  muted: 'bg-secondary-background-muted text-main-foreground',
}

interface BrutalCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrutalCardVariant
  padded?: boolean
  shadow?: boolean
  dashed?: boolean
  interactive?: boolean
  children: ReactNode
}

export function BrutalCard({
  variant = 'surface',
  padded = true,
  shadow = true,
  dashed = false,
  interactive = false,
  className,
  children,
  ...props
}: BrutalCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--border-radius)]',
        dashed ? 'border-[3px] border-dashed border-border' : 'brutal-border',
        shadow && !dashed && 'brutal-shadow',
        interactive && 'brutal-hover-lift cursor-pointer transition-transform',
        padded && 'p-4',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
