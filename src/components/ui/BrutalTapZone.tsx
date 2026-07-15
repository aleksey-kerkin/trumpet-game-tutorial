import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface BrutalTapZoneProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  pulsing?: boolean
  heightClass?: string
}

export function BrutalTapZone({
  children,
  pulsing = false,
  heightClass = 'h-44',
  className,
  type = 'button',
  ...props
}: BrutalTapZoneProps) {
  return (
    <button
      type={type}
      className={cn(
        'brutal-border brutal-pressable relative flex w-full flex-col items-center justify-center rounded-[var(--border-radius)] bg-secondary-background text-main-foreground transition',
        heightClass,
        pulsing
          ? 'brutal-shadow-pressed translate-x-0.5 translate-y-0.5 bg-main text-main-foreground'
          : 'brutal-shadow brutal-hover-lift',
        props.disabled && 'opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
