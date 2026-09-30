import type { AppProgress, DictEntry, PracticeSession, SessionAnswer } from '../types'
import { recordCharacter, recordLevelAttempt, recordModeSession } from './progress'
import { isQuickMatch } from './quick'
import { shuffle } from './shuffle'

export function createSession(config: Pick<PracticeSession, 'key' | 'href' | 'label' | 'mode' | 'source' | 'levelId' | 'lessonId'>, entries: DictEntry[], now = Date.now()): PracticeSession {
  return { ...config, id: `${now}-${Math.random().toString(36).slice(2)}`, queue: entries.map(e => ({ entryId: e.id, retry: false })), initialCount: entries.length, index: 0, answers: [], options: {}, createdAt: now, updatedAt: now }
}
export function choiceOptions(entry: DictEntry, pool: DictEntry[]) {
  return shuffle([entry, ...shuffle(pool.filter(e => e.quick !== entry.quick)).slice(0, 3)])
}
export function sessionStats(session: PracticeSession) {
  const originals = session.answers.filter(a => !a.retry)
  const correct = originals.filter(a => a.correct && !a.assisted).length
  const total = originals.length
  return { correct, wrong: total - correct, total, accuracy: total ? Math.round(correct / total * 100) : 0, elapsedMs: session.answers.reduce((sum, a) => sum + a.elapsedMs, 0) }
}
export function answerSession(progress: AppProgress, session: PracticeSession, entry: DictEntry, input: string, assisted: boolean, elapsedMs: number, now = Date.now(), chosen?: DictEntry): AppProgress {
  if (session.finishedAt || session.answers.length > session.index || session.queue[session.index]?.entryId !== entry.id) return progress
  const correct = session.mode === 'code-to-char' ? chosen?.quick === entry.quick : isQuickMatch(input, entry.quick)
  const answer: SessionAnswer = { entryId: entry.id, input, correct, assisted, retry: session.queue[session.index].retry, at: now, elapsedMs: Math.max(0, Math.min(elapsedMs, 30 * 60_000)) }
  const queue = [...session.queue]
  // A retry follows at least two other questions, never changes the first-attempt score.
  if (!correct && !answer.retry && queue.length - session.initialCount < 5 && session.index + 3 < queue.length && !queue.some(q => q.retry && q.entryId === entry.id)) queue.splice(session.index + 3, 0, { entryId: entry.id, retry: true })
  const next = { ...session, queue, answers: [...session.answers, answer], updatedAt: now }
  const updated = recordCharacter(progress, entry, session, answer)
  return { ...updated, sessions: { ...updated.sessions, [session.key]: next }, lastSessionKey: session.key }
}
export function advanceSession(progress: AppProgress, key: string, now = Date.now()): AppProgress {
  const session = progress.sessions[key]
  if (!session || session.finishedAt || session.answers.length <= session.index) return progress
  if (session.index + 1 < session.queue.length) return { ...progress, sessions: { ...progress.sessions, [key]: { ...session, index: session.index + 1, updatedAt: now } } }
  const stats = sessionStats(session)
  let updated = recordModeSession(progress, session.mode, stats.correct, stats.wrong, stats.elapsedMs)
  if (session.levelId) updated = recordLevelAttempt(updated, session.levelId, stats.accuracy, stats.correct / session.initialCount >= 0.8)
  if (session.lessonId) {
    const previous = updated.lessons[session.lessonId]
    updated = { ...updated, lessons: { ...updated.lessons, [session.lessonId]: { completed: (previous?.completed ?? false) || stats.correct === session.initialCount, attempts: (previous?.attempts ?? 0) + 1, bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, stats.accuracy) } } }
  }
  return { ...updated, sessions: { ...updated.sessions, [key]: { ...session, finishedAt: now, updatedAt: now } } }
}
export function rememberSession(progress: AppProgress, session: PracticeSession): AppProgress {
  const sessions = Object.fromEntries(Object.entries(progress.sessions).sort(([, a], [, b]) => b.updatedAt - a.updatedAt).slice(0, 19))
  return { ...progress, sessions: { ...sessions, [session.key]: session }, lastSessionKey: session.key }
}
