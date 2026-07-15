import type { ReactNode } from 'react'
import { BrutalCard } from './BrutalCard'
import { HeroDecor } from './HeroDecor'

interface BrutalHeroProps {
  title: string
  lead: string
  actions?: ReactNode
}

export function BrutalHero({ title, lead, actions }: BrutalHeroProps) {
  return (
    <BrutalCard className="relative overflow-hidden">
      <HeroDecor />
      <div className="relative z-10">
        <h1 className="font-display text-hero font-extrabold leading-none tracking-tight">{title}</h1>
        <p className="mt-3 text-lead leading-relaxed text-main-foreground/80">{lead}</p>
        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </BrutalCard>
  )
}
