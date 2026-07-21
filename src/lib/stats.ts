import type { SessionStats } from '../types'

export function createSessionStats(): SessionStats {
  return {
    correct: 0,
    wrong: 0,
    total: 0,
    accuracy: 0,
    elapsedMs: 0,
  }
}

export function updateSessionStats(
  stats: SessionStats,
  wasCorrect: boolean,
): SessionStats {
  const correct = stats.correct + (wasCorrect ? 1 : 0)
  const wrong = stats.wrong + (wasCorrect ? 0 : 1)
  const total = correct + wrong
  return {
    correct,
    wrong,
    total,
    accuracy: total ? Math.round((correct / total) * 100) : 0,
    elapsedMs: stats.elapsedMs,
  }
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes === 0) return `${rest} 秒`
  return `${minutes} 分 ${rest} 秒`
}

export function formatAccuracy(accuracy: number): string {
  return `${accuracy}%`
}
