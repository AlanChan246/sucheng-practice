import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Window } from 'happy-dom'

const browser = new Window({ url: 'http://unit.test/sucheng-practice/' })
for (const key of ['window','document','navigator','HTMLElement','HTMLInputElement','HTMLSelectElement','HTMLTextAreaElement','Node','Element','Event','MouseEvent','KeyboardEvent','MutationObserver','localStorage']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: key === 'window' ? browser : (browser as unknown as Record<string, unknown>)[key] })
}
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true, writable: true })
const dict = JSON.parse(readFileSync(new URL('../public/sucheng-dict.json', import.meta.url), 'utf8'))
globalThis.fetch = (async () => ({ ok: true, json: async () => dict })) as typeof fetch
const React = await import('react')
const { render, fireEvent, screen, waitFor, cleanup, act } = await import('@testing-library/react')
const { default: App } = await import('../src/App')
const { SettingsProvider } = await import('../src/hooks/useSettings')
const { defaultProgress, getProgress, saveProgress } = await import('../src/lib/progress')
const start = (path: string) => {
  cleanup(); browser.localStorage.clear(); saveProgress(defaultProgress())
  browser.history.replaceState({ idx: 0 }, '', `/sucheng-practice${path}`)
  return render(React.createElement(SettingsProvider, null, React.createElement(App)))
}
const activeSession = () => Object.values(getProgress().sessions).find(s => !s.finishedAt)!
const typeCode = (code: string) => { fireEvent.change(screen.getByLabelText(/輸入首碼|一個字根/), { target: { value: code } }) }

test('interactive product flows with an in-memory DOM (not visual browser QA)', async t => {
  await t.test('first success uses actual touch keys and stores onboarding', async () => {
    start('/')
    fireEvent.click(screen.getByRole('button', { name: 'A 日', exact: true }))
    fireEvent.click(screen.getByRole('button', { name: 'B 月', exact: true }))
    await screen.findByText('第一個字，搞掂！')
    assert.equal(getProgress().onboarded, true)
    assert.equal(Object.keys(getProgress().characters).length, 0)
  })
  await t.test('practice autosubmits, focuses next, and resumes saved feedback after remount', async () => {
    start('/practice/char-to-code?lesson=first-pair')
    await screen.findByText('看清楚這個字，再按首尾。')
    typeCode('a')
    await screen.findByText('搞掂！')
    assert.equal(activeSession().answers.length, 1)
    assert.equal(document.activeElement?.textContent, '再嚟一題')
    cleanup()
    render(React.createElement(SettingsProvider, null, React.createElement(App)))
    await screen.findByText('搞掂！')
    fireEvent.click(screen.getByRole('button', { name: '再嚟一題' }))
    await waitFor(() => assert.equal(activeSession().index, 1))
    typeCode('b'); await screen.findByText('搞掂！'); fireEvent.click(screen.getByRole('button', { name: '再嚟一題' }))
    typeCode('ab'); await screen.findByText('搞掂！'); fireEvent.click(screen.getByRole('button', { name: '看看這次練習' }))
    await screen.findByText('搞掂，又熟咗一點。')
    assert.equal(getProgress().lessons['first-pair'].completed, true)
    assert.equal(getProgress().modes['char-to-code'].sessions, 1)
  })
  await t.test('wrong answers explain the key and highlight the correct key without hiding the input', async () => {
    start('/practice/char-to-code?lesson=first-pair')
    await screen.findByText('看清楚這個字，再按首尾。')
    typeCode('b')
    await screen.findByText('差少少，睇吓這個鍵。')
    const input = screen.getByLabelText('一個字根，按一鍵') as HTMLInputElement
    assert.equal(input.value, 'B')
    assert.equal(input.getAttribute('aria-invalid'), 'true')
    assert.equal(input.getAttribute('aria-describedby'), 'answer-hint answer-feedback')
    assert.ok(screen.getByRole('button', { name: 'A 日' }).classList.contains('is-answer'))
    assert.equal(Object.values(getProgress().characters)[0].status, 'review')
  })
  await t.test('choice questions reveal the actual correct option and support number keys', async () => {
    start('/practice/code-to-char')
    await screen.findByText('哪個字可以用這個碼打出來？')
    const s = activeSession(); const id = s.queue[0].entryId
    const correctIndex = s.options[id].indexOf(id)
    const option = document.querySelectorAll('.char-option')[correctIndex]
    fireEvent.keyDown(option, { key: String(correctIndex + 1) })
    await screen.findByText('搞掂！')
    assert.ok(option.classList.contains('char-option--correct'))
    assert.equal(activeSession().answers[0].correct, true)
  })
  await t.test('dictation defaults to learner-controlled reveal; peeking marks assistance', async () => {
    start('/practice/dictation')
    await screen.findByText('先看清楚，記住這個字。')
    assert.equal((screen.getByLabelText('顯示時間') as HTMLSelectElement).value, 'manual')
    const s = activeSession(); const entry = dict.entries.find((e: { id: number }) => e.id === s.queue[0].entryId)
    fireEvent.click(screen.getByRole('button', { name: '記住了，收起來' }))
    await screen.findByLabelText('漢字已收起')
    fireEvent.click(screen.getByRole('button', { name: '再看一次' }))
    fireEvent.click(screen.getByRole('button', { name: '記住了，收起來' }))
    typeCode(entry.quick)
    await screen.findByText('搵到方法喇，再試就更熟。')
    assert.equal(activeSession().answers[0].assisted, true)
  })
  await t.test('dictation hides on the selected timer and keeps that pace for the next question', async () => {
    start('/practice/dictation?lesson=first-pair')
    await screen.findByText('先看清楚，記住這個字。')
    fireEvent.change(screen.getByLabelText('顯示時間'), { target: { value: '1800' } })
    await screen.findByLabelText('漢字已收起', {}, { timeout: 2500 })
    typeCode('a')
    await screen.findByText('搞掂！')
    fireEvent.click(screen.getByRole('button', { name: '再嚟一題' }))
    await screen.findByText('先看清楚，記住這個字。')
    assert.equal((screen.getByLabelText('顯示時間') as HTMLSelectElement).value, '1800')
    assert.equal(activeSession().index, 1)
  })
  await t.test('lesson, levels and empty progress expose useful next actions', async () => {
    start('/learn'); assert.equal(document.querySelectorAll('.lesson-path li').length, 6)
    fireEvent.click(screen.getByRole('button', { name: 'Q 手' })); await screen.findByText(/提手旁/)
    start('/levels'); await screen.findByText('第 1 關'); assert.equal(document.querySelectorAll('.level-trail li').length, 10)
    assert.ok(document.querySelector('.level-link.is-locked'))
    start('/levels/999'); await screen.findByText('找不到這一關')
    start('/progress'); assert.equal(document.querySelector('.progress-next a')?.getAttribute('href'), '/sucheng-practice/learn/first-pair')
  })
  await t.test('storage failure does not crash practice or claim it was persisted', async () => {
    start('/')
    const original = globalThis.localStorage
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: original.getItem.bind(original), setItem: () => { throw new Error('quota') } } })
    try {
      await act(async () => { saveProgress({ ...getProgress(), onboarded: true }) })
      await screen.findByText(/暫時儲存不到進度/)
    } finally { Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: original }) }
  })
  await t.test('progress retains link semantics, names lessons, and explains the statistics', async () => {
    start('/progress')
    assert.equal(screen.getAllByRole('link', { name: /第 \d 小節：/ }).length, 6)
    assert.equal(document.querySelectorAll('.lesson-dots > li > a').length, 6)
    fireEvent.click(screen.getByText('各模式與關卡的詳細紀錄'))
    assert.match(document.querySelector('caption')?.textContent ?? '', /首次獨立作答準確率/)
    assert.equal(document.querySelector('.table-scroll')?.getAttribute('tabindex'), '0')
    assert.equal(document.querySelectorAll('thead th[scope="col"]').length, 5)
  })
  await t.test('cancelled reset preserves progress; confirmed reset retains theme settings', async () => {
    start('/progress')
    saveProgress({ ...getProgress(), onboarded: true, unlockedLevel: 4 })
    localStorage.setItem('sucheng-practice-settings', JSON.stringify({ theme: 'dark' }))
    const confirm = window.confirm
    try {
      window.confirm = () => false
      fireEvent.click(screen.getByRole('button', { name: '重新開始，清除進度' }))
      assert.equal(getProgress().unlockedLevel, 4)
      window.confirm = () => true
      fireEvent.click(screen.getByRole('button', { name: '重新開始，清除進度' }))
      assert.equal(getProgress().unlockedLevel, 1)
      assert.equal(localStorage.getItem('sucheng-practice-settings'), '{"theme":"dark"}')
    } finally { window.confirm = confirm }
  })
  cleanup()
  await browser.happyDOM.close()
})
