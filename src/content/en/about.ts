import type { AboutContent } from '../../i18n/types'

export const about: AboutContent = {
  backLink: 'Back to map',
  title: 'About',
  faq: [
    {
      q: 'What is this project?',
      a: '“Trumpeter on Horseback” is a free web tutorial for absolute trumpet beginners. The game uses your microphone for feedback on sound and pitch.',
    },
    {
      q: 'Where do the exercises come from?',
      a: 'Exercises and text are original. The course structure is inspired by V.M. Dokshitser’s method, but notes and textbook materials are not included in the app.',
    },
    {
      q: 'Where is progress saved?',
      a: 'Data (XP, completed quests) is stored locally in your browser. Microphone audio is not recorded or sent to a server.',
    },
    {
      q: 'Is this an official method?',
      a: 'No. This is an educational project and is not an official edition of Dokshitser’s method.',
    },
    {
      q: 'Icons',
      a: 'Icons by EsyaAm, Meko, Roat Studio, H Alberto Gongora, Gung Yoga, and lastspark via The Noun Project (CC BY 3.0). See CREDITS.md in the repository for links.',
    },
  ],
  footer: '© Educational project. Not an official edition of Dokshitser’s method.',
}
