import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../ui/cn'
import { iconSources } from './iconMap'
import type { IconName, IconSize } from './types'
import { iconSizePx } from './types'

interface BrutalIconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName
  size?: IconSize
  label?: string
}

export function BrutalIcon({
  name,
  size = 'md',
  label,
  className,
  style,
  ...props
}: BrutalIconProps) {
  const px = iconSizePx[size]
  const fillsContainer = /\b!?h-full\b/.test(className ?? '') || /\b!?w-full\b/.test(className ?? '')
  const svg = iconSources[name]
    .replace('role="img"', label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"')
    .replace('<svg ', '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ')

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      style={fillsContainer ? style : { width: px, height: px, ...style }}
      {...props}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

interface BrutalIconLabelProps {
  icon: IconName
  size?: IconSize
  iconClassName?: string
  className?: string
  children: ReactNode
}

export function BrutalIconLabel({
  icon,
  size = 'sm',
  iconClassName,
  className,
  children,
}: BrutalIconLabelProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <BrutalIcon name={icon} size={size} className={iconClassName} />
      <span>{children}</span>
    </span>
  )
}
