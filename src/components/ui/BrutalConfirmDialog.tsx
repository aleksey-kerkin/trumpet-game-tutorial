import { BrutalButton } from './BrutalButton'
import { BrutalCard } from './BrutalCard'

interface BrutalConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function BrutalConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: BrutalConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brutal-confirm-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={cancelLabel}
        onClick={onCancel}
      />
      <BrutalCard className="relative z-10 w-full max-w-md space-y-4">
        <div>
          <h2 id="brutal-confirm-title" className="font-display text-headline font-extrabold">
            {title}
          </h2>
          <p className="mt-2 text-body text-main-foreground/80">{message}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <BrutalButton variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </BrutalButton>
          <BrutalButton variant="primary" size="sm" onClick={onConfirm}>
            {confirmLabel}
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  )
}
