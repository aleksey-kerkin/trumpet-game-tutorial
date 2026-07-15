import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface TrumpetDB extends DBSchema {
  game: {
    key: 'state'
    value: string
  }
}

const DB_NAME = 'trumpet-quest'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<TrumpetDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<TrumpetDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('game')
      },
    })
  }
  return dbPromise
}

export async function loadPersistedState<T>(): Promise<T | null> {
  const db = await getDb()
  const raw = await db.get('game', 'state')
  if (!raw) return null
  return JSON.parse(raw) as T
}

export async function savePersistedState<T>(state: T): Promise<void> {
  const db = await getDb()
  await db.put('game', JSON.stringify(state), 'state')
}
