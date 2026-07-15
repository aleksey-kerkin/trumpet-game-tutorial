import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface BrutalPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  inset?: boolean
}

export function BrutalPanel({ children, inset = false, className, ...props }: BrutalPanelProps) {
  return (
    <div
      className={cn(
        'brutal-border rounded-[var(--border-radius)] bg-secondary-background text-main-foreground',
        inset ? 'shadow-none border-2' : 'brutal-shadow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
