import { BrutalCard } from './BrutalCard'
import { BrutalProgress } from './BrutalProgress'

interface BrutalWeekSummaryProps {
  title: string
  questRange: string
  questRangeLabel: string
  completed: number
  total: number
}

export function BrutalWeekSummary({
  title,
  questRange,
  questRangeLabel,
  completed,
  total,
}: BrutalWeekSummaryProps) {
  return (
    <BrutalCard variant="blue" className="!py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-body-sm font-extrabold uppercase tracking-brutal">{title}</div>
          <div className="brutal-type-label mt-0.5 opacity-90">
            {questRangeLabel} {questRange}
          </div>
        </div>
        <div className="brutal-type-label text-right">
          {completed}/{total}
        </div>
      </div>
      <div className="mt-3">
        <BrutalProgress value={completed} max={total} variant="brass" />
      </div>
    </BrutalCard>
  )
}
