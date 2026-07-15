export type IconName =
  | 'play'
  | 'arrow-left'
  | 'check'
  | 'lock'
  | 'trumpet'
  | 'lips'
  | 'mouthpiece'
  | 'github'
  | 'telegram'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const iconSizePx: Record<IconSize, number> = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 40,
}
