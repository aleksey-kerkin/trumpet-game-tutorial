import { useEffect, useId, useRef, useState } from 'react'
import type { NoteId } from '../../music/notes'
import {
  noteIdsToVexString,
  noteIdsToVoiceTime,
  staffRenderWidth,
} from '../../music/notes'
import { useI18n } from '../../i18n'
import { BrutalCard, cn } from '../ui'
import { renderVexStaff } from './renderVexStaff'

interface NoteStaffProps {
  noteIds: readonly NoteId[]
  highlightIndex?: number
  width?: number
  captionNoteId?: NoteId
}

const RESIZE_DEBOUNCE_MS = 100

function buildRenderKey(
  renderWidth: number,
  locale: string,
  captionId: NoteId | undefined,
  noteString: string,
  highlightIndex: number | undefined,
): string {
  return [renderWidth, locale, captionId, noteString, highlightIndex ?? ''].join(':')
}

export function NoteStaff({
  noteIds,
  highlightIndex,
  width,
  captionNoteId,
}: NoteStaffProps) {
  const { locale, t } = useI18n()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const elementId = useId().replace(/:/g, '')
  const noteString = noteIdsToVexString(noteIds)
  const voiceTime = noteIdsToVoiceTime(noteIds)
  const captionId = captionNoteId ?? noteIds[highlightIndex ?? 0]
  const captionNoteIndex = highlightIndex ?? 0
  const [scrollable, setScrollable] = useState(false)
  const lastRenderKeyRef = useRef('')

  useEffect(() => {
    const wrapper = wrapperRef.current
    const container = containerRef.current
    if (!wrapper || !container || noteIds.length === 0) return

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false

    const renderStaff = () => {
      if (cancelled) return

      const containerWidth = width ?? wrapper.clientWidth
      const renderWidth = staffRenderWidth(noteIds.length, containerWidth)
      const renderKey = buildRenderKey(
        renderWidth,
        locale,
        captionId,
        noteString,
        highlightIndex,
      )

      if (renderKey === lastRenderKeyRef.current && container.childElementCount > 0) {
        return
      }
      lastRenderKeyRef.current = renderKey

      container.innerHTML = ''
      setScrollable(renderWidth > containerWidth || noteIds.length >= 4)

      try {
        renderVexStaff({
          elementId,
          noteString,
          voiceTime,
          renderWidth,
          highlightIndex,
          captionId,
          captionNoteIndex,
          locale,
        })
      } catch (error) {
        console.error('NoteStaff render failed:', error)
        container.innerHTML = ''
      }
    }

    renderStaff()

    const observer = new ResizeObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(renderStaff, RESIZE_DEBOUNCE_MS)
    })
    observer.observe(wrapper)

    return () => {
      cancelled = true
      observer.disconnect()
      if (debounceTimer) clearTimeout(debounceTimer)
      container.innerHTML = ''
      lastRenderKeyRef.current = ''
    }
  }, [
    captionId,
    captionNoteIndex,
    elementId,
    highlightIndex,
    locale,
    noteIds.length,
    noteString,
    voiceTime,
    width,
  ])

  return (
    <BrutalCard className="p-2!" aria-label={t.strings.noteStaffAriaLabel}>
      <div ref={wrapperRef} className="flex justify-center">
        <div
          ref={containerRef}
          id={elementId}
          className={cn(
            'leading-none',
            scrollable && 'max-w-full overflow-x-auto',
          )}
        />
      </div>
    </BrutalCard>
  )
}
