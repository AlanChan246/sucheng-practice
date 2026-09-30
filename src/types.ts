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
  onboarded: boolean
  lessons: Record<string, { completed: boolean; attempts: number; bestAccuracy: number }>
  characters: Record<string, CharacterProgress>
  sessions: Record<string, PracticeSession>
  lastSessionKey: string | null
}

export interface CharacterProgress {
  id: number
  char: string
  quick: string
  correct: number
  wrong: number
  modes: Partial<Record<PracticeMode, { correct: number; wrong: number }>>
  wrongKeys: Record<string, number>
  status: 'learning' | 'review' | 'steady'
  successfulChecks: number[]
  lastSuccessSession: string | null
  lastSeenAt: number
  dueAt: number
}

export interface SessionAnswer {
  entryId: number
  input: string
  correct: boolean
  assisted: boolean
  retry: boolean
  at: number
  elapsedMs: number
}

export interface PracticeSession {
  id: string
  key: string
  href: string
  label: string
  mode: PracticeMode
  source: 'all' | 'quick' | 'review' | 'weak' | 'lesson' | 'level'
  levelId?: number
  lessonId?: string
  queue: { entryId: number; retry: boolean }[]
  initialCount: number
  index: number
  answers: SessionAnswer[]
  options: Record<string, number[]>
  createdAt: number
  updatedAt: number
  finishedAt?: number
  assistedIndices?: number[]
  hiddenIndices?: number[]
}

export interface SessionStats {
  correct: number
  wrong: number
  total: number
  accuracy: number
  elapsedMs: number
}
