import type { Locale } from '../i18n/types'

export const TRUMPET_NOTES = {
  G3: { hz: 196.0, vex: 'G3/q', en: 'G', ru: 'соль' },
  C4: { hz: 261.63, vex: 'C4/q', en: 'C', ru: 'до' },
  D4: { hz: 293.66, vex: 'D4/q', en: 'D', ru: 'ре' },
  E4: { hz: 329.63, vex: 'E4/q', en: 'E', ru: 'ми' },
  F4: { hz: 349.23, vex: 'F4/q', en: 'F', ru: 'фа' },
  G4: { hz: 392.0, vex: 'G4/q', en: 'G', ru: 'соль' },
} as const

export type NoteId = keyof typeof TRUMPET_NOTES

export const NOTE_G3_HZ = TRUMPET_NOTES.G3.hz
export const NOTE_C4_HZ = TRUMPET_NOTES.C4.hz
export const NOTE_D4_HZ = TRUMPET_NOTES.D4.hz
export const NOTE_E4_HZ = TRUMPET_NOTES.E4.hz
export const NOTE_F4_HZ = TRUMPET_NOTES.F4.hz
export const NOTE_G4_HZ = TRUMPET_NOTES.G4.hz

export function getNoteHz(noteId: NoteId): number {
  return TRUMPET_NOTES[noteId].hz
}

export function formatNoteLabel(noteId: NoteId, locale: Locale): string {
  const note = TRUMPET_NOTES[noteId]
  const name = locale === 'ru' ? note.ru : note.en
  return `${name} (${noteId})`
}

export function formatNoteCaption(noteId: NoteId, locale: Locale): string {
  return formatNoteLabel(noteId, locale)
}

export function noteIdsToVexString(noteIds: readonly NoteId[]): string {
  return noteIds.map((id, index) => {
    const vex = TRUMPET_NOTES[id].vex
    return index === 0 ? vex : vex.replace('/q', '')
  }).join(', ')
}
