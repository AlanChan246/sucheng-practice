import type { AppProgress, CharacterProgress, DictEntry, ModeStats, PracticeMode, PracticeSession, SessionAnswer } from '../types'

export const STORAGE_KEY = 'sucheng-practice-progress'
export const DAY = 86_400_000
const MODES: PracticeMode[] = ['char-to-code', 'code-to-char', 'dictation', 'level']
const emptyModeStats = (): ModeStats => ({ sessions: 0, correct: 0, wrong: 0, bestAccuracy: 0, lastAccuracy: 0, lastDurationMs: 0 })
const object = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {}
const number = (v: unknown, fallback = 0) => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fallback
const integer = (v: unknown, fallback = 0) => Math.floor(number(v, fallback))
const percentage = (v: unknown) => Math.min(100, number(v))

export function defaultProgress(): AppProgress {
  return { version: 2, unlockedLevel: 1, levels: {}, modes: Object.fromEntries(MODES.map(m => [m, emptyModeStats()])) as AppProgress['modes'], updatedAt: new Date().toISOString(), onboarded: false, lessons: {}, characters: {}, sessions: {}, lastSessionKey: null }
}

/** v1 totals have no per-character evidence. Never infer mastery from them. */
export function migrateProgress(value: unknown): AppProgress {
  const data = object(value)
  if (data.version !== 1 && data.version !== 2) throw new Error('unsupported-progress-version')
  const result = defaultProgress()
  result.unlockedLevel = Math.max(1, integer(data.unlockedLevel, 1))
  for (const mode of MODES) {
    const row = object(object(data.modes)[mode])
    result.modes[mode] = { sessions: integer(row.sessions), correct: integer(row.correct), wrong: integer(row.wrong), bestAccuracy: percentage(row.bestAccuracy), lastAccuracy: percentage(row.lastAccuracy), lastDurationMs: number(row.lastDurationMs) }
  }
  for (const [id, raw] of Object.entries(object(data.levels))) {
    if (!/^[1-9]\d*$/.test(id)) continue
    const row = object(raw)
    result.levels[id] = { completed: row.completed === true, attempts: integer(row.attempts), bestAccuracy: percentage(row.bestAccuracy), lastAccuracy: percentage(row.lastAccuracy) }
  }
  result.onboarded = data.onboarded === true || Object.values(result.modes).some(m => m.sessions > 0)
  if (typeof data.updatedAt === 'string') result.updatedAt = data.updatedAt
  if (data.version === 1) return result
  for (const [id, raw] of Object.entries(object(data.lessons))) {
    const row = object(raw)
    result.lessons[id] = { completed: row.completed === true, attempts: integer(row.attempts), bestAccuracy: percentage(row.bestAccuracy) }
  }
  for (const [id, raw] of Object.entries(object(data.characters))) {
    const row = object(raw)
    if (!/^[1-9]\d*$/.test(id) || typeof row.char !== 'string' || typeof row.quick !== 'string') continue
    const modes: CharacterProgress['modes'] = {}
    for (const mode of MODES) {
      const m = object(object(row.modes)[mode])
      if (Object.keys(m).length) modes[mode] = { correct: integer(m.correct), wrong: integer(m.wrong) }
    }
    result.characters[id] = { id: Number(id), char: row.char, quick: row.quick, correct: integer(row.correct), wrong: integer(row.wrong), modes, wrongKeys: Object.fromEntries(Object.entries(object(row.wrongKeys)).filter(([key]) => /^[A-Z]$/.test(key)).map(([key, v]) => [key, integer(v)])), status: row.status === 'steady' || row.status === 'review' ? row.status : 'learning', successfulChecks: Array.isArray(row.successfulChecks) ? row.successfulChecks.filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0).slice(-3) : [], lastSuccessSession: typeof row.lastSuccessSession === 'string' ? row.lastSuccessSession : null, lastSeenAt: number(row.lastSeenAt), dueAt: number(row.dueAt) }
  }
  for (const [key, raw] of Object.entries(object(data.sessions))) {
    const s = object(raw)
    if (!MODES.includes(s.mode as PracticeMode) || typeof s.id !== 'string' || typeof s.href !== 'string' || !s.href.startsWith('/') || typeof s.label !== 'string' || !['all','quick','review','weak','lesson','level'].includes(String(s.source))) continue
    if (!Array.isArray(s.queue) || !s.queue.length || s.queue.length > 200 || !s.queue.every(q => Number.isInteger(object(q).entryId) && number(object(q).entryId) > 0 && typeof object(q).retry === 'boolean')) continue
    if (!Number.isInteger(s.index) || number(s.index) >= s.queue.length || !Array.isArray(s.answers) || s.answers.length < number(s.index) || s.answers.length > number(s.index) + 1) continue
    if (!s.answers.every(a => { const r = object(a); return number(r.entryId) > 0 && typeof r.input === 'string' && typeof r.correct === 'boolean' && typeof r.assisted === 'boolean' && typeof r.retry === 'boolean' && typeof r.at === 'number' && typeof r.elapsedMs === 'number' })) continue
    if (s.source === 'level' && (!Number.isInteger(s.levelId) || number(s.levelId) < 1)) continue
    if (s.source === 'lesson' && typeof s.lessonId !== 'string') continue
    const options = Object.fromEntries(Object.entries(object(s.options)).filter((pair): pair is [string, number[]] => Array.isArray(pair[1]) && pair[1].length > 0 && pair[1].every(n => Number.isInteger(n) && n > 0)))
    const indices = (raw: unknown) => Array.isArray(raw) ? raw.filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < (s.queue as unknown[]).length) : []
    result.sessions[key] = { ...(s as unknown as PracticeSession), key, initialCount: s.queue.filter(q => !object(q).retry).length, options, assistedIndices: indices(s.assistedIndices), hiddenIndices: indices(s.hiddenIndices), createdAt: number(s.createdAt), updatedAt: number(s.updatedAt), finishedAt: number(s.finishedAt) || undefined }
  }
  result.lastSessionKey = typeof data.lastSessionKey === 'string' && result.sessions[data.lastSessionKey] ? data.lastSessionKey : null
  return result
}

let cached: AppProgress | undefined
let storageIssue: string | null = null
let protectUnreadableData = false
const listeners = new Set<() => void>()
export const getStorageIssue = () => storageIssue
export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    try { return migrateProgress(JSON.parse(raw)) }
    catch {
      try { localStorage.setItem(`${STORAGE_KEY}-backup-${Date.now()}`, raw) }
      catch { protectUnreadableData = true }
      storageIssue = protectUnreadableData ? '舊進度暫時無法讀取，原資料已保留。這次練習只會暫存在目前頁面。' : '舊進度格式無法讀取，已保留原資料副本。你可以先開始新的練習。'
      return defaultProgress()
    }
  } catch { storageIssue = '瀏覽器未能讀取儲存空間。這次練習只會暫存在目前頁面。'; return defaultProgress() }
}
export function getProgress() { return cached ??= loadProgress() }
export function saveProgress(progress: AppProgress) {
  cached = { ...progress, updatedAt: new Date().toISOString() }
  if (!protectUnreadableData) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cached)) }
    catch { storageIssue = '暫時儲存不到進度。你仍可以練習，但關閉此頁可能失去這次紀錄。' }
  }
  listeners.forEach(listener => listener())
}
export function updateProgress(updater: (progress: AppProgress) => AppProgress) { saveProgress(updater(getProgress())) }
export function subscribeProgress(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY || event.key === null) { cached = loadProgress(); listeners.forEach(listener => listener()) }
})
export function resetProgress() {
  try { localStorage.removeItem(STORAGE_KEY); storageIssue = null; protectUnreadableData = false }
  catch { storageIssue = '瀏覽器未能清除已儲存的進度。請在瀏覽器設定管理此網站資料。' }
  cached = defaultProgress(); listeners.forEach(listener => listener())
}

export function recordModeSession(progress: AppProgress, mode: PracticeMode, correct: number, wrong: number, durationMs: number): AppProgress {
  const accuracy = correct + wrong ? Math.round(correct / (correct + wrong) * 100) : 0
  const current = progress.modes[mode]
  return { ...progress, modes: { ...progress.modes, [mode]: { sessions: current.sessions + 1, correct: current.correct + correct, wrong: current.wrong + wrong, bestAccuracy: Math.max(current.bestAccuracy, accuracy), lastAccuracy: accuracy, lastDurationMs: durationMs } } }
}
export function recordLevelAttempt(progress: AppProgress, levelId: number, accuracy: number, passed: boolean): AppProgress {
  const prev = progress.levels[levelId] ?? { completed: false, bestAccuracy: 0, lastAccuracy: 0, attempts: 0 }
  return { ...progress, levels: { ...progress.levels, [levelId]: { completed: prev.completed || passed, bestAccuracy: Math.max(prev.bestAccuracy, accuracy), lastAccuracy: accuracy, attempts: prev.attempts + 1 } }, unlockedLevel: passed ? Math.max(progress.unlockedLevel, levelId + 1) : progress.unlockedLevel }
}

export function recordCharacter(progress: AppProgress, entry: DictEntry, session: PracticeSession, answer: SessionAnswer): AppProgress {
  const previous = progress.characters[entry.id]
  const item: CharacterProgress = previous ? { ...previous, modes: { ...previous.modes }, wrongKeys: { ...previous.wrongKeys }, successfulChecks: [...previous.successfulChecks] } : { id: entry.id, char: entry.char, quick: entry.quick, correct: 0, wrong: 0, modes: {}, wrongKeys: {}, status: 'learning', successfulChecks: [], lastSuccessSession: null, lastSeenAt: 0, dueAt: 0 }
  const independent = answer.correct && !answer.assisted && !answer.retry
  const modeStats = item.modes[session.mode] ?? { correct: 0, wrong: 0 }
  item.modes[session.mode] = { correct: modeStats.correct + Number(independent), wrong: modeStats.wrong + Number(!independent) }
  item.correct += Number(independent)
  item.wrong += Number(!answer.correct)
  item.lastSeenAt = answer.at
  if (!answer.correct || answer.assisted) {
    item.status = 'review'; item.successfulChecks = []; item.dueAt = answer.at
    if (!answer.correct && session.mode !== 'code-to-char') [...entry.quick].forEach((key, index) => {
      if (key !== answer.input[index]) item.wrongKeys[key.toUpperCase()] = (item.wrongKeys[key.toUpperCase()] ?? 0) + 1
    })
  } else if (independent && session.mode !== 'code-to-char' && item.lastSuccessSession !== session.id && (!item.successfulChecks.length || answer.at - item.successfulChecks.at(-1)! >= DAY)) {
    item.successfulChecks = [...item.successfulChecks, answer.at].slice(-3)
    item.lastSuccessSession = session.id
    item.status = item.successfulChecks.length >= 3 ? 'steady' : 'learning'
    item.dueAt = answer.at + DAY * (item.successfulChecks.length >= 3 ? 7 : item.successfulChecks.length === 2 ? 3 : 1)
  } else if (!item.dueAt) item.dueAt = answer.at + DAY
  return { ...progress, onboarded: true, characters: { ...progress.characters, [entry.id]: item } }
}

export function reviewCharacters(progress: AppProgress, dueOnly = false, now = Date.now()) {
  return Object.values(progress.characters).filter(c => dueOnly ? c.dueAt <= now : c.status === 'review' || c.dueAt <= now).sort((a, b) => Number(b.status === 'review') - Number(a.status === 'review') || a.dueAt - b.dueAt)
}
export function weakKeys(progress: AppProgress) {
  const keys: Record<string, number> = {}
  for (const c of Object.values(progress.characters)) if (c.status !== 'steady') for (const [key, count] of Object.entries(c.wrongKeys)) keys[key] = (keys[key] ?? 0) + count
  return Object.entries(keys).filter(([, count]) => count >= 3).sort((a, b) => b[1] - a[1])
}
export function resumableSession(progress: AppProgress) {
  return Object.values(progress.sessions).filter(s => !s.finishedAt).sort((a, b) => b.updatedAt - a.updatedAt)[0]
}
