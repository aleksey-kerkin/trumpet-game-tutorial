import { useEffect, useId, useRef } from 'react'
import { Factory } from 'vexflow'
import type { NoteId } from '../../music/notes'
import { formatNoteCaption, noteIdsToVexString } from '../../music/notes'
import { useI18n } from '../../i18n'
import { BrutalCard } from '../ui'

interface NoteStaffProps {
  noteIds: readonly NoteId[]
  highlightIndex?: number
  width?: number
  captionNoteId?: NoteId
}

const HIGHLIGHT_STYLE = {
  fillStyle: '#c9a227',
  strokeStyle: '#0a0a0a',
} as const

export function NoteStaff({
  noteIds,
  highlightIndex,
  width = 320,
  captionNoteId,
}: NoteStaffProps) {
  const { locale, t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const elementId = useId().replace(/:/g, '')
  const noteString = noteIdsToVexString(noteIds)
  const captionId = captionNoteId ?? noteIds[highlightIndex ?? 0]

  useEffect(() => {
    const container = containerRef.current
    if (!container || noteIds.length === 0) return

    container.innerHTML = ''
    const mount = document.createElement('div')
    mount.id = elementId
    container.appendChild(mount)

    try {
      const vf = new Factory({
        renderer: { elementId, width, height: 110 },
      })
      const score = vf.EasyScore()
      const system = vf.System()
      const notes = score.notes(noteString, { stem: 'up' })
      if (highlightIndex !== undefined && notes[highlightIndex]) {
        notes[highlightIndex].setStyle(HIGHLIGHT_STYLE)
      }
      system
        .addStave({
          voices: [score.voice(notes)],
        })
        .addClef('treble')
      vf.draw()
    } catch {
      container.textContent = noteString
    }

    return () => {
      container.innerHTML = ''
    }
  }, [elementId, highlightIndex, noteIds.length, noteString, width])

  return (
    <BrutalCard className="overflow-x-auto !p-2" aria-label={t.strings.noteStaffAriaLabel}>
      <div ref={containerRef} />
      {captionId && (
        <p className="mt-2 text-center text-meta font-semibold text-main-foreground">
          {formatNoteCaption(captionId, locale)}
        </p>
      )}
    </BrutalCard>
  )
}
