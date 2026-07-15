import asteriskSvg from '../../assets/decor/noun/decor-asterisk.svg?raw'
import wavesSvg from '../../assets/decor/noun/decor-waves.svg?raw'
import { DecorSvg } from '../decor/DecorSvg'

export function HeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <DecorSvg
        svg={wavesSvg}
        className="absolute -right-4 top-2 h-32 w-32 rotate-[8deg] text-main/15 sm:h-40 sm:w-40"
      />
      <DecorSvg
        svg={asteriskSvg}
        className="absolute -bottom-2 -left-4 h-24 w-24 text-jazz-wine/15 sm:h-28 sm:w-28"
      />
    </div>
  )
}
