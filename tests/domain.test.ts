import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { defaultProgress, migrateProgress, recordCharacter, recordLevelAttempt, reviewCharacters, DAY } from '../src/lib/progress'
import { answerSession, advanceSession, choiceOptions, createSession, rememberSession, sessionStats } from '../src/lib/session'
import { normalizeQuick, toQuickFromCangjie } from '../src/lib/quick'
import { LESSONS } from '../src/lib/lessons'
import { CODING_EXAMPLES } from '../src/lib/learnContent'
import type { Dictionary, PracticeSession } from '../src/types'

const dict: Dictionary = JSON.parse(readFileSync(new URL('../public/sucheng-dict.json', import.meta.url), 'utf8'))
const find = (char: string) => dict.entries.find(e => e.char === char)!
const config = { key: 'test', href: '/practice/char-to-code', label: '測試', mode: 'char-to-code', source: 'all' } as const
const session = (chars = ['明','日','月','木','林'], now = 1_000) => createSession(config, chars.map(find), now)

test('v1 migration preserves totals, unlocks and best level scores without inventing mastery', () => {
  const old = { version: 1, unlockedLevel: 12, levels: { '11': { completed: true, bestAccuracy: 88, lastAccuracy: 72, attempts: 3 } }, modes: { 'char-to-code': { sessions: 5, correct: 42, wrong: 8, bestAccuracy: 100, lastAccuracy: 90, lastDurationMs: 6500 } } }
  const p = migrateProgress(old)
  assert.equal(p.version, 2); assert.equal(p.unlockedLevel, 12); assert.deepEqual(p.levels, old.levels)
  assert.deepEqual(p.modes['char-to-code'], old.modes['char-to-code']); assert.deepEqual(p.characters, {}); assert.deepEqual(p.lessons, {})
  assert.equal(p.onboarded, true)
})
test('malformed statistics are normalized and unknown versions are rejected', () => {
  assert.throws(() => migrateProgress({ version: 77 }))
  const p = migrateProgress({ version: 1, unlockedLevel: -1, modes: { level: { sessions: -3, correct: 'no', bestAccuracy: 400 } } })
  assert.equal(p.unlockedLevel, 1); assert.equal(p.modes.level.sessions, 0); assert.equal(p.modes.level.correct, 0); assert.equal(p.modes.level.bestAccuracy, 100)
})
test('session snapshots preserve feedback, options and assisted questions across reload', () => {
  let s = session(); s.assistedIndices = [0]; s.options = { [find('明').id]: [find('明').id, find('月').id] }
  let p = rememberSession(defaultProgress(), s)
  p = answerSession(p, s, find('明'), 'ab', true, 700, 2000)
  const reloaded = migrateProgress(JSON.parse(JSON.stringify(p)))
  assert.equal(reloaded.sessions.test.answers[0].assisted, true)
  assert.deepEqual(reloaded.sessions.test.options, s.options)
  assert.deepEqual(reloaded.sessions.test.assistedIndices, [0])
  assert.equal(sessionStats(reloaded.sessions.test).correct, 0)
})
test('every same-code group has exactly one valid choice in generated options', () => {
  for (const entry of dict.entries) {
    const choices = choiceOptions(entry, dict.entries)
    assert.equal(choices.length, 4)
    assert.equal(choices.filter(e => e.quick === entry.quick).length, 1, `${entry.char}/${entry.quick}`)
    assert.equal(new Set(choices.map(e => e.id)).size, 4)
  }
})
test('first incorrect answer is saved immediately and retry waits behind two questions', () => {
  const s = session()
  let p = rememberSession(defaultProgress(), s)
  p = answerSession(p, s, find('明'), 'aa', false, 1200, 2000)
  assert.equal(p.characters[find('明').id].status, 'review')
  assert.equal(p.characters[find('明').id].wrongKeys.B, 1)
  assert.equal(p.sessions.test.queue[3].entryId, find('明').id)
  assert.equal(p.sessions.test.queue[3].retry, true)
  assert.equal(p.sessions.test.initialCount, 5)
  assert.equal(p.sessions.test.answers.length, 1)
  assert.equal(p.modes['char-to-code'].sessions, 0)
})
test('retry success does not inflate original scores; finish is idempotent', () => {
  let p = rememberSession(defaultProgress(), session())
  while (!p.sessions.test.finishedAt) {
    const s = p.sessions.test
    const e = dict.entries.find(e => e.id === s.queue[s.index].entryId)!
    p = answerSession(p, s, e, s.index === 0 ? 'aa' : e.quick, false, 1000, 2000 + s.index * 1000)
    p = advanceSession(p, 'test', 9000)
  }
  assert.equal(sessionStats(p.sessions.test).correct, 4)
  assert.equal(sessionStats(p.sessions.test).total, 5)
  assert.equal(p.modes['char-to-code'].correct, 4)
  assert.equal(p.modes['char-to-code'].wrong, 1)
  const again = advanceSession(p, 'test', 10000)
  assert.equal(again.modes['char-to-code'].sessions, 1)
})
test('late mistakes remain in review without an immediate back-to-back retry', () => {
  const s = session(['明'])
  const p = answerSession(rememberSession(defaultProgress(), s), s, find('明'), 'aa', false, 500)
  assert.equal(p.sessions.test.queue.length, 1)
  assert.equal(reviewCharacters(p).length, 1)
})
test('three independent recalls on separate days are needed for steady status', () => {
  let p = defaultProgress()
  const e = find('明')
  const answer = (at: number, id: string, assisted = false, retry = false, mode: PracticeSession['mode'] = 'char-to-code') => {
    p = recordCharacter(p, e, { ...session(), id, mode }, { entryId: e.id, input: 'ab', correct: true, assisted, retry, at, elapsedMs: 1000 })
  }
  answer(1000, 'one'); answer(2000, 'two'); answer(DAY + 1000, 'assisted', true); answer(DAY + 1000, 'choice', false, false, 'code-to-char'); answer(DAY + 1000, 'retry', false, true)
  assert.equal(p.characters[e.id].successfulChecks.length, 0)
  assert.equal(p.characters[e.id].status, 'review')
  answer(DAY + 1000, 'three'); assert.equal(p.characters[e.id].status, 'learning')
  answer(2 * DAY + 1000, 'four'); assert.equal(p.characters[e.id].status, 'learning')
  answer(3 * DAY + 1000, 'five'); assert.equal(p.characters[e.id].status, 'steady')
  assert.equal(p.characters[e.id].dueAt, 10 * DAY + 1000)
})
test('level 80% boundary and repeated attempts preserve unlocked progress', () => {
  const makeLevel = (correctCount: number) => {
    let p = defaultProgress()
    const s = createSession({ ...config, mode: 'level', source: 'level', levelId: 1 }, dict.entries.slice(0, 25))
    p = rememberSession(p, s)
    for (let i = 0; i < 25; i++) {
      // Disable adaptive extras here to isolate the first-attempt pass threshold.
      const current = p.sessions.test
      const e = dict.entries[i]
      p = answerSession(p, current, e, i < correctCount ? e.quick : 'zz', false, 500)
      p.sessions.test.queue = p.sessions.test.queue.filter(q => !q.retry)
      p = advanceSession(p, 'test')
    }
    return p
  }
  assert.equal(makeLevel(19).unlockedLevel, 1)
  const p = makeLevel(20); assert.equal(p.unlockedLevel, 2); assert.equal(p.levels[1].bestAccuracy, 80)
  const worse = recordLevelAttempt(p, 1, 20, false)
  assert.equal(worse.levels[1].completed, true); assert.equal(worse.levels[1].bestAccuracy, 80); assert.equal(worse.unlockedLevel, 2)
})
test('all lesson examples and teaching codes match the shipped dictionary', () => {
  for (const lesson of LESSONS) for (const char of lesson.chars) assert.ok(find(char), `${lesson.id}: ${char}`)
  for (const e of CODING_EXAMPLES) { assert.equal(e.quick, find(e.char).quick); assert.equal(e.cangjie, find(e.char).cangjie) }
  assert.deepEqual(CODING_EXAMPLES.find(e => e.char === '好')?.parts, ['女','弓','木'])
  assert.equal(toQuickFromCangjie(' VND '), 'vd'); assert.equal(normalizeQuick('A b!'), 'ab'); assert.equal(toQuickFromCangjie('A'), 'a')
  assert.equal(dict.entries.length, 4159); assert.equal(dict.levels.length, 167); assert.equal(dict.levels.at(-1)?.charIds.length, 9)
})
