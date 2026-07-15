import sparkleSvg from '../assets/decor/noun/decor-sparkle.svg?raw'
import { DecorSvg } from './decor/DecorSvg'
import { BrutalCard } from './ui'

interface MascotBubbleProps {
  message: string
}

export function MascotBubble({ message }: MascotBubbleProps) {
  return (
    <BrutalCard variant="surface" className="flex items-start gap-3 pl-5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--border-radius)] border-[3px] border-border bg-main p-1.5 text-main-foreground brutal-shadow-sm"
        aria-hidden
      >
        <DecorSvg svg={sparkleSvg} className="h-full w-full" />
      </div>
      <p className="text-body font-medium leading-relaxed text-main-foreground">{message}</p>
    </BrutalCard>
  )
}
