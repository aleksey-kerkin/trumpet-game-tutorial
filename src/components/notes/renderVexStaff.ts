import {
  Annotation,
  AnnotationHorizontalJustify,
  AnnotationVerticalJustify,
  Factory,
} from 'vexflow'
import type { Locale } from '../../i18n/types'
import type { NoteId } from '../../music/notes'
import { formatNoteLabel } from '../../music/notes'
import { fitStaffViewport } from './staffViewport'

const HIGHLIGHT_STYLE = {
  fillStyle: '#c9a227',
  strokeStyle: '#0a0a0a',
} as const

const CAPTION_STYLE = {
  fillStyle: '#0a0a0a',
  strokeStyle: '#0a0a0a',
} as const

const RENDER_HEIGHT_ESTIMATE = 200
const CAPTION_FONT_SIZE = 12

export interface RenderVexStaffParams {
  elementId: string
  noteString: string
  voiceTime: string
  renderWidth: number
  highlightIndex?: number
  captionId?: NoteId
  captionNoteIndex: number
  locale: Locale
}

export function renderVexStaff({
  elementId,
  noteString,
  voiceTime,
  renderWidth,
  highlightIndex,
  captionId,
  captionNoteIndex,
  locale,
}: RenderVexStaffParams): SVGSVGElement | null {
  const vf = new Factory({
    renderer: { elementId, width: renderWidth, height: RENDER_HEIGHT_ESTIMATE },
  })
  const score = vf.EasyScore()
  const system = vf.System({
    width: renderWidth - 16,
    x: 8,
    y: 8,
  })
  const notes = score.notes(noteString, { stem: 'up' })

  if (highlightIndex !== undefined && notes[highlightIndex]) {
    notes[highlightIndex].setStyle(HIGHLIGHT_STYLE)
  }

  if (captionId && notes[captionNoteIndex]) {
    notes[captionNoteIndex].addModifier(
      new Annotation(formatNoteLabel(captionId, locale))
        .setVerticalJustification(AnnotationVerticalJustify.BOTTOM)
        .setJustification(AnnotationHorizontalJustify.CENTER)
        .setFontSize(CAPTION_FONT_SIZE)
        .setStyle(CAPTION_STYLE),
      0,
    )
  }

  system
    .addStave({
      voices: [score.voice(notes, { time: voiceTime })],
    })
    .addClef('treble')
  vf.draw()

  const mount = document.getElementById(elementId)
  const svg = mount?.querySelector('svg')
  if (!svg) return null

  fitStaffViewport(svg, renderWidth, Boolean(captionId))
  return svg
}
