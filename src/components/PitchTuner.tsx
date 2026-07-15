import { tunerZone, type TunerZone } from '../audio/pitch'
import { useI18n } from '../i18n'
import { BrutalBadge, BrutalPanel } from './ui'

interface PitchTunerProps {
  label: string
  targetHz: number
  frequency: number
  cents: number
  toleranceCents: number
}

const zoneVariant: Record<TunerZone, 'blue' | 'brass' | 'completed' | 'locked'> = {
  silent: 'locked',
  cold: 'blue',
  warm: 'brass',
  hot: 'completed',
}

export function PitchTuner({
  label,
  targetHz,
  frequency,
  cents,
  toleranceCents,
}: PitchTunerProps) {
  const { t } = useI18n()
  const q = t.quests.pitchTuner

  const zoneLabels: Record<TunerZone, string> = {
    silent: q.zones.silent,
    cold: q.zones.cold,
    warm: q.zones.warm,
    hot: q.zones.hot,
  }

  const zone = tunerZone(frequency, targetHz, toleranceCents)
  const clampedCents = Number.isFinite(cents) ? Math.max(-150, Math.min(150, cents)) : 0
  const markerLeft = 50 + (clampedCents / 150) * 45

  return (
    <BrutalPanel className="p-5">
      <div className="mb-2 text-center font-display text-title font-extrabold">{label}</div>
      <div className="mb-4 flex justify-center">
        <BrutalBadge variant={zoneVariant[zone]} className="px-4 py-1.5 text-body-sm">
          {zoneLabels[zone]}
          {frequency > 0 && (
            <span className="ml-2 text-meta opacity-80">
              {Math.round(frequency)} Hz · {cents > 0 ? '+' : ''}
              {Number.isFinite(cents) ? Math.round(cents) : '—'}¢
            </span>
          )}
        </BrutalBadge>
      </div>
      <div className="relative h-4 overflow-hidden rounded-md border-2 border-jazz-ink">
        <div className="absolute inset-0 flex">
          <div className="h-full flex-1 bg-jazz-blue" />
          <div className="h-full flex-1 bg-jazz-brass" />
          <div className="h-full flex-1 bg-jazz-success" />
        </div>
        <div
          className="absolute top-0 h-full w-1.5 -translate-x-1/2 bg-jazz-ink"
          style={{ left: `${markerLeft}%` }}
        />
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-jazz-wine" />
      </div>
      <div className="mt-2 flex justify-between brutal-type-label text-jazz-ink/60">
        <span>{q.axis.below}</span>
        <span>{q.axis.target}</span>
        <span>{q.axis.above}</span>
      </div>
    </BrutalPanel>
  )
}
