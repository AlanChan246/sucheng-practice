import type { AppProgress, ModeStats, PracticeMode } from '../types'

const STORAGE_KEY = 'sucheng-practice-progress'
const PROGRESS_VERSION = 1

const emptyModeStats = (): ModeStats => ({
  sessions: 0,
  correct: 0,
  wrong: 0,
  bestAccuracy: 0,
  lastAccuracy: 0,
  lastDurationMs: 0,
})

export function defaultProgress(): AppProgress {
  return {
    version: PROGRESS_VERSION,
    unlockedLevel: 1,
    levels: {},
    modes: {
      'char-to-code': emptyModeStats(),
      'code-to-char': emptyModeStats(),
      dictation: emptyModeStats(),
      level: emptyModeStats(),
    },
    updatedAt: new Date().toISOString(),
  }
}

export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as AppProgress
    if (parsed.version !== PROGRESS_VERSION) return defaultProgress()
    return { ...defaultProgress(), ...parsed, modes: { ...defaultProgress().modes, ...parsed.modes } }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress: AppProgress): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }),
  )
}

export function recordModeSession(
  progress: AppProgress,
  mode: PracticeMode,
  correct: number,
  wrong: number,
  durationMs: number,
): AppProgress {
  const total = correct + wrong
  const accuracy = total ? Math.round((correct / total) * 100) : 0
  const current = progress.modes[mode]
  const next: AppProgress = {
    ...progress,
    modes: {
      ...progress.modes,
      [mode]: {
        sessions: current.sessions + 1,
        correct: current.correct + correct,
        wrong: current.wrong + wrong,
        bestAccuracy: Math.max(current.bestAccuracy, accuracy),
        lastAccuracy: accuracy,
        lastDurationMs: durationMs,
      },
    },
  }
  saveProgress(next)
  return next
}

export function recordLevelAttempt(
  progress: AppProgress,
  levelId: number,
  accuracy: number,
  passed: boolean,
): AppProgress {
  const key = String(levelId)
  const prev = progress.levels[key] ?? {
    completed: false,
    bestAccuracy: 0,
    lastAccuracy: 0,
    attempts: 0,
  }

  const next: AppProgress = {
    ...progress,
    levels: {
      ...progress.levels,
      [key]: {
        completed: prev.completed || passed,
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        lastAccuracy: accuracy,
        attempts: prev.attempts + 1,
      },
    },
    unlockedLevel: passed
      ? Math.max(progress.unlockedLevel, levelId + 1)
      : progress.unlockedLevel,
  }
  saveProgress(next)
  return next
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}
