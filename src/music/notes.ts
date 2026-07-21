import type { Locale } from '../i18n/types'

const TRUMPET_NOTES = {
  G3: { hz: 196.0, vex: 'G3/q', en: 'G', ru: 'соль' },
  C4: { hz: 261.63, vex: 'C4/q', en: 'C', ru: 'до' },
  D4: { hz: 293.66, vex: 'D4/q', en: 'D', ru: 'ре' },
  E4: { hz: 329.63, vex: 'E4/q', en: 'E', ru: 'ми' },
  F4: { hz: 349.23, vex: 'F4/q', en: 'F', ru: 'фа' },
  G4: { hz: 392.0, vex: 'G4/q', en: 'G', ru: 'соль' },
} as const

export type NoteId = keyof typeof TRUMPET_NOTES

/** Bb trumpet: written pitch sounds 2 semitones lower in concert pitch. */
const TRUMPET_TRANSPOSITION_SEMITONES = -2
const CONCERT_RATIO = 2 ** (TRUMPET_TRANSPOSITION_SEMITONES / 12)

export function getNoteHz(noteId: NoteId): number {
  return TRUMPET_NOTES[noteId].hz
}

/** Concert frequency heard when playing a written trumpet note. */
export function getConcertHz(noteId: NoteId): number {
  return getNoteHz(noteId) * CONCERT_RATIO
}

export function formatNoteLabel(noteId: NoteId, locale: Locale): string {
  const note = TRUMPET_NOTES[noteId]
  const name = locale === 'ru' ? note.ru : note.en
  return `${name} (${noteId})`
}

export function noteIdsToVexString(noteIds: readonly NoteId[]): string {
  return noteIds.map((id, index) => {
    const vex = TRUMPET_NOTES[id].vex
    return index === 0 ? vex : vex.replace('/q', '')
  }).join(', ')
}

export function noteIdsToVoiceTime(noteIds: readonly NoteId[]): string {
  return `${Math.max(1, noteIds.length)}/4`
}

const STAFF_MAX_WIDTH = 640

export function staffRenderWidth(noteCount: number, containerWidth: number): number {
  const max = Math.min(Math.max(containerWidth, 1), STAFF_MAX_WIDTH)
  const compact = 120 + noteCount * 72
  if (noteCount <= 3) return Math.min(max, Math.max(260, compact))
  return Math.min(max, Math.max(320, 200 + noteCount * 56))
}
