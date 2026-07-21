export interface DictEntry {
  id: number
  char: string
  cangjie: string
  quick: string
  rank: number
}

export interface Level {
  id: number
  title: string
  charIds: number[]
}

export interface Dictionary {
  version: number
  generatedAt: string
  totalChars: number
  missingCount: number
  charsPerLevel: number
  entries: DictEntry[]
  levels: Level[]
}

export type PracticeMode =
  | 'char-to-code'
  | 'code-to-char'
  | 'dictation'
  | 'level'

export interface ModeStats {
  sessions: number
  correct: number
  wrong: number
  bestAccuracy: number
  lastAccuracy: number
  lastDurationMs: number
}

export interface LevelProgress {
  completed: boolean
  bestAccuracy: number
  lastAccuracy: number
  attempts: number
}

export interface AppProgress {
  version: number
  unlockedLevel: number
  levels: Record<string, LevelProgress>
  modes: Record<PracticeMode, ModeStats>
  updatedAt: string
}

export interface SessionStats {
  correct: number
  wrong: number
  total: number
  accuracy: number
  elapsedMs: number
}
