import { useState } from 'react'
import type { StaffIntroConfig } from '../../lessons/quest-config'
import { formatNoteLabel, type NoteId } from '../../music/notes'
import { useI18n } from '../../i18n'
import { NoteStaff } from '../notes/NoteStaff'
import { BrutalButton } from '../ui'
import { questHintClass } from './quest-ui'

interface StaffIntroQuestProps {
  config: StaffIntroConfig
  onComplete: () => void
}

export function StaffIntroQuest({ config, onComplete }: StaffIntroQuestProps) {
  const { locale, t } = useI18n()
  const q = t.quests.staffIntro
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'done'>('learn')
  const [selected, setSelected] = useState<string | null>(null)
  const [quizCorrect, setQuizCorrect] = useState(false)

  const { introNoteId, quizNoteId, quizOptions } = config

  const handleQuizPick = (noteId: NoteId) => {
    setSelected(noteId)
    if (noteId === quizNoteId) {
      setQuizCorrect(true)
      setPhase('done')
    }
  }

  return (
    <div className="space-y-6">
      {phase === 'learn' && (
        <>
          <p className={questHintClass}>{q.learnHint}</p>
          <NoteStaff noteIds={[introNoteId]} highlightIndex={0} captionNoteId={introNoteId} />
          <p className="text-body leading-relaxed text-foreground">{q.learnBody}</p>
          <BrutalButton variant="primary" fullWidth onClick={() => setPhase('quiz')}>
            {q.toQuizButton}
          </BrutalButton>
        </>
      )}

      {phase === 'quiz' && !quizCorrect && (
        <>
          <p className={questHintClass}>{q.quizHint}</p>
          <NoteStaff noteIds={[quizNoteId]} highlightIndex={0} />
          <div className="grid gap-2">
            {quizOptions.map((noteId) => (
              <BrutalButton
                key={noteId}
                variant={selected === noteId ? 'ghost' : 'secondary'}
                fullWidth
                onClick={() => handleQuizPick(noteId)}
              >
                {formatNoteLabel(noteId, locale)}
              </BrutalButton>
            ))}
          </div>
          {selected && selected !== quizNoteId && (
            <p className="text-center text-body-sm text-foreground-muted">{q.quizWrong}</p>
          )}
        </>
      )}

      {phase === 'done' && (
        <>
          <p className="text-center text-lead font-bold text-main">{q.quizCorrect}</p>
          <BrutalButton variant="success" fullWidth onClick={onComplete}>
            {q.completeButton}
          </BrutalButton>
        </>
      )}
    </div>
  )
}
