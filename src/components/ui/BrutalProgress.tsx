import { cn } from './cn'

type BrutalProgressVariant = 'brass' | 'success' | 'blue' | 'wine'

const fillStyles: Record<BrutalProgressVariant, string> = {
  brass: 'bg-main',
  success: 'bg-jazz-success',
  blue: 'bg-jazz-blue',
  wine: 'bg-jazz-wine',
}

interface BrutalProgressProps {
  value: number
  max?: number
  variant?: BrutalProgressVariant
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function BrutalProgress({
  value,
  max = 100,
  variant = 'brass',
  label,
  className,
  size = 'sm',
}: BrutalProgressProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const fillHeight = size === 'sm' ? 'h-2.5' : 'h-3.5'

  return (
    <div className={cn('w-full', className)}>
      {label && <div className="mb-1 brutal-type-label text-foreground-muted">{label}</div>}
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="brutal-border brutal-shadow-sm rounded-[var(--border-radius)] bg-secondary-background p-1"
      >
        <div
          className={cn(
            'overflow-hidden rounded-[calc(var(--border-radius)-2px)] bg-secondary-background-muted',
            fillHeight,
          )}
        >
          <div
            className={cn(
              'h-full brutal-border transition-[width] duration-200 ease-out',
              fillStyles[variant],
              percent > 0 && 'min-w-1',
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
