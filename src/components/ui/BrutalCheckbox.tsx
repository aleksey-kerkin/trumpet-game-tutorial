import type { InputHTMLAttributes } from 'react'
import { BrutalIcon } from '../icons'
import { cn } from './cn'

interface BrutalCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function BrutalCheckbox({ label, className, id, ...props }: BrutalCheckboxProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <label
      htmlFor={inputId}
      className={cn('group flex cursor-pointer items-center gap-3', className)}
    >
      <input
        id={inputId}
        type="checkbox"
        className="sr-only"
        {...props}
      />
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--border-radius)] border-[3px] border-border bg-secondary-background brutal-shadow-sm transition-colors group-has-[:checked]:bg-main"
        aria-hidden
      >
        <span className="hidden text-main-foreground group-has-[:checked]:inline">
          <BrutalIcon name="check" size="xs" />
        </span>
      </span>
      {label && <span className="font-medium text-main-foreground">{label}</span>}
    </label>
  )
}