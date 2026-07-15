import type { Messages } from '../../i18n/messages-types'
import { about } from './about'
import { catalog } from './catalog'
import { quests } from './quests'
import { strings } from './strings'
import { weeks } from './weeks'

export const ruMessages = {
  strings,
  weeks,
  catalog,
  about,
  quests,
} satisfies Messages
