import { useEffect, useId, useRef } from 'react'
import { Factory } from 'vexflow'
import { useI18n } from '../../i18n'
import { BrutalCard } from '../ui'

interface NoteStaffProps {
  /** VexFlow note string, e.g. "C4/q, D4, E4, F4" */
  noteString: string
  width?: number
}

export function NoteStaff({ noteString, width = 320 }: NoteStaffProps) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const elementId = useId().replace(/:/g, '')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

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
      system
        .addStave({
          voices: [score.voice(score.notes(noteString, { stem: 'up' }))],
        })
        .addClef('treble')
      vf.draw()
    } catch {
      container.textContent = noteString
    }

    return () => {
      container.innerHTML = ''
    }
  }, [elementId, noteString, width])

  return (
    <BrutalCard className="overflow-x-auto !p-2" aria-label={t.strings.noteStaffAriaLabel}>
      <div ref={containerRef} />
    </BrutalCard>
  )
}
