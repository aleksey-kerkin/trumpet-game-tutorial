import { useLayoutEffect, useRef } from 'react'

const MARQUEE_DURATION_MS = 28_000

interface BrutalMarqueeProps {
  items: string[]
}

export function BrutalMarquee({ items }: BrutalMarqueeProps) {
  const segment = `${items.join(' • ')} • `
  const trackRef = useRef<HTMLDivElement>(null)
  const segmentRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const segmentEl = segmentRef.current
    if (!track || !segmentEl) return

    let cancelled = false

    const startAnimation = async () => {
      if ('fonts' in document) {
        await document.fonts.ready
      }
      if (cancelled) return

      const width = segmentEl.getBoundingClientRect().width
      if (width <= 0) return

      track.getAnimations().forEach((animation) => animation.cancel())

      track.animate(
        [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: `translate3d(-${width}px, 0, 0)` },
        ],
        { duration: MARQUEE_DURATION_MS, iterations: Infinity, easing: 'linear' },
      )
    }

    void startAnimation()

    const observer = new ResizeObserver(() => {
      void startAnimation()
    })
    observer.observe(segmentEl)

    return () => {
      cancelled = true
      observer.disconnect()
      track.getAnimations().forEach((animation) => animation.cancel())
    }
  }, [segment])

  return (
    <div
      className="marquee-viewport border-y-[3px] border-border bg-main py-2"
      aria-hidden
    >
      <div
        ref={trackRef}
        className="marquee-track whitespace-nowrap text-body font-bold uppercase tracking-brutal-wide text-main-foreground"
      >
        <span ref={segmentRef} className="shrink-0">
          {segment}
        </span>
        <span className="shrink-0">{segment}</span>
      </div>
    </div>
  )
}
