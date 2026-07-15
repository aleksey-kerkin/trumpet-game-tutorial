import { create } from 'zustand'
import { migrateCompletedQuestIds } from '../lessons/catalog'
import { loadPersistedState, savePersistedState } from './persistence'
import { computeStreak, levelFromXp, todayKey } from './progress'

export interface GameState {
  xp: number
  streak: number
  lastPlayedDate: string | null
  completedQuestIds: string[]
  hydrated: boolean
}

interface GameActions {
  hydrate: () => Promise<void>
  completeQuest: (questId: string, xpReward: number) => void
  isQuestCompleted: (questId: string) => boolean
  getLevel: () => number
  resetProgress: () => void
}

const initialState: GameState = {
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  completedQuestIds: [],
  hydrated: false,
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  hydrate: async () => {
    const saved = await loadPersistedState<GameState>()
    if (saved) {
      const completedQuestIds = migrateCompletedQuestIds(saved.completedQuestIds)
      const nextState = { ...saved, completedQuestIds, hydrated: true }
      set(nextState)
      if (completedQuestIds.join() !== saved.completedQuestIds.join()) {
        void savePersistedState(nextState)
      }
      return
    }
    set({ hydrated: true })
  },

  completeQuest: (questId, xpReward) => {
    const state = get()
    if (state.completedQuestIds.includes(questId)) return

    const today = todayKey()
    const nextStreak = computeStreak(state.lastPlayedDate, state.streak || 0)
    const nextState: GameState = {
      xp: state.xp + xpReward,
      streak: state.lastPlayedDate === today ? state.streak : nextStreak,
      lastPlayedDate: today,
      completedQuestIds: [...state.completedQuestIds, questId],
      hydrated: true,
    }

    set(nextState)
    void savePersistedState(nextState)
  },

  isQuestCompleted: (questId) => get().completedQuestIds.includes(questId),

  getLevel: () => levelFromXp(get().xp),

  resetProgress: () => {
    const nextState: GameState = { ...initialState, hydrated: true }
    set(nextState)
    void savePersistedState(nextState)
  },
}))
