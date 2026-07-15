import { Link, type LinkProps } from 'react-router-dom'
import type { IconName } from '../icons'
import { BrutalIcon } from '../icons'
import { cn } from './cn'

type BrutalLinkVariant = 'default' | 'primary' | 'secondary' | 'success' | 'ghost'
type BrutalLinkSize = 'sm' | 'md'

const variantStyles: Record<Exclude<BrutalLinkVariant, 'default'>, string> = {
  primary: 'bg-main !text-main-foreground',
  secondary: 'bg-secondary-background !text-main-foreground',
  success: 'bg-jazz-success !text-secondary-background',
  ghost: 'bg-transparent !text-main-foreground hover:bg-secondary-background/20',
}

const sizeStyles: Record<BrutalLinkSize, string> = {
  sm: 'px-3 py-1.5 text-meta font-bold',
  md: 'px-4 py-2.5 text-body font-bold',
}

interface BrutalLinkProps extends LinkProps {
  variant?: BrutalLinkVariant
  size?: BrutalLinkSize
  leadingIcon?: IconName
}

export function BrutalLink({
  variant = 'default',
  size = 'md',
  leadingIcon,
  className,
  children,
  ...props
}: BrutalLinkProps) {
  const isButton = variant !== 'default'

  return (
    <Link
      className={cn(
        'no-underline focus-visible:brutal-focus',
        variant === 'default' &&
          'inline-flex items-center gap-2 text-body-sm font-bold text-main underline-offset-4 hover:underline',
        isButton &&
          cn(
            'inline-flex items-center justify-center gap-2 rounded-[var(--border-radius)] brutal-border brutal-shadow brutal-hover-lift brutal-pressable text-center',
            variantStyles[variant],
            sizeStyles[size],
          ),
        className,
      )}
      {...props}
    >
      {leadingIcon && <BrutalIcon name={leadingIcon} size="sm" />}
      {children}
    </Link>
  )
}
