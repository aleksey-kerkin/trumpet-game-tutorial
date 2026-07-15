import { cn } from './cn'

type BrutalDividerVariant = 'brass' | 'wine' | 'surface'
type BrutalDividerWidth = 'accent' | 'full'

interface BrutalDividerProps {
  className?: string
  variant?: BrutalDividerVariant
  width?: BrutalDividerWidth
}

export function BrutalDivider({ className, variant = 'surface', width = 'full' }: BrutalDividerProps) {
  return (
    <div
      className={cn(
        'box-border rounded-[var(--border-radius)] border-[3px] border-border brutal-shadow-sm',
        width === 'full' ? 'h-3 w-full' : 'h-2 w-16',
        variant === 'brass' && 'bg-main',
        variant === 'wine' && 'bg-jazz-wine',
        variant === 'surface' && 'bg-secondary-background',
        className,
      )}
      role="separator"
      aria-hidden
    />
  )
}
