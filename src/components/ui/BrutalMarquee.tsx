import { useLayoutEffect, useRef, useState } from 'react'

interface BrutalMarqueeProps {
  items: string[]
}

export function BrutalMarquee({ items }: BrutalMarqueeProps) {
  const segment = `${items.join(' • ')} • `
  const trackRef = useRef<HTMLDivElement>(null)
  const segmentRef = useRef<HTMLSpanElement>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const track = trackRef.current
    const segmentEl = segmentRef.current
    if (!track || !segmentEl) return

    setReady(false)

    const updateShift = () => {
      const width = segmentEl.offsetWidth
      if (width <= 0) return
      track.style.setProperty('--marquee-shift', `-${width}px`)
      setReady(true)
    }

    updateShift()

    const observer = new ResizeObserver(updateShift)
    observer.observe(segmentEl)

    return () => observer.disconnect()
  }, [segment])

  return (
    <div
      className="marquee-viewport border-y-[3px] border-border bg-main py-2"
      aria-hidden
    >
      <div
        ref={trackRef}
        className={`marquee-track whitespace-nowrap text-body font-bold uppercase tracking-brutal-wide text-main-foreground${ready ? ' marquee-track--ready' : ''}`}
      >
        <span ref={segmentRef} className="shrink-0">
          {segment}
        </span>
        <span className="shrink-0">{segment}</span>
      </div>
    </div>
  )
}
