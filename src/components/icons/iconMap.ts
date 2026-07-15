import playSvg from '../../assets/icons/noun/play.svg?raw'
import arrowLeftSvg from '../../assets/icons/noun/arrow-left.svg?raw'
import checkSvg from '../../assets/icons/noun/check.svg?raw'
import lockSvg from '../../assets/icons/noun/lock.svg?raw'
import trumpetSvg from '../../assets/icons/noun/trumpet.svg?raw'
import lipsSvg from '../../assets/icons/noun/lips.svg?raw'
import mouthpieceSvg from '../../assets/icons/noun/mouthpiece.svg?raw'
import type { IconName } from './types'

export const iconSources: Record<IconName, string> = {
  play: playSvg,
  'arrow-left': arrowLeftSvg,
  check: checkSvg,
  lock: lockSvg,
  trumpet: trumpetSvg,
  lips: lipsSvg,
  mouthpiece: mouthpieceSvg,
}
