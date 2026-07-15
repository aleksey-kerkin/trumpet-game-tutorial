import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { IconName } from '../icons'
import { BrutalIcon } from '../icons'
import { cn } from './cn'

type BrutalButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'outline'
type BrutalButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<BrutalButtonVariant, string> = {
  primary: 'bg-main text-main-foreground',
  secondary: 'bg-secondary-background text-main-foreground',
  success: 'bg-jazz-success text-secondary-background',
  ghost: 'bg-transparent text-foreground brutal-border hover:bg-secondary-background/10',
  outline: 'bg-transparent text-main-foreground brutal-border hover:bg-main-foreground/5',
}

const sizeStyles: Record<BrutalButtonSize, string> = {
  sm: 'px-3 py-1.5 text-meta font-bold',
  md: 'px-4 py-2.5 text-body font-bold',
  lg: 'px-6 py-3 text-lead font-bold',
}

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BrutalButtonVariant
  size?: BrutalButtonSize
  fullWidth?: boolean
  leadingIcon?: IconName
  children: ReactNode
}

export function BrutalButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon,
  className,
  children,
  type = 'button',
  ...props
}: BrutalButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'brutal-border brutal-shadow brutal-hover-lift brutal-pressable rounded-[var(--border-radius)]',
        leadingIcon && 'inline-flex items-center justify-center gap-2',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leadingIcon && <BrutalIcon name={leadingIcon} size="sm" />}
      {children}
    </button>
  )
}
