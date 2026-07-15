interface BrutalMarqueeProps {
  items: string[]
}

export function BrutalMarquee({ items }: BrutalMarqueeProps) {
  const segment = `${items.join(' • ')} • `

  return (
    <div className="overflow-hidden border-y-[3px] border-border bg-main py-2" aria-hidden>
      <div className="marquee-track flex w-max whitespace-nowrap text-body font-bold uppercase tracking-brutal-wide text-main-foreground">
        <span className="shrink-0">{segment}</span>
        <span className="shrink-0">{segment}</span>
      </div>
    </div>
  )
}
