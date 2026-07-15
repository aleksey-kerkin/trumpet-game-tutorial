import type { HTMLAttributes } from 'react'
import { cn } from '../ui/cn'

interface DecorSvgProps extends HTMLAttributes<HTMLSpanElement> {
  svg: string
}

export function DecorSvg({ svg, className, ...props }: DecorSvgProps) {
  const html = svg
    .replace('role="img"', 'aria-hidden="true"')
    .replace('<svg ', '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ')

  return (
    <span
      className={cn('inline-flex', className)}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}
