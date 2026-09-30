// Uses the unmodified Impeccable browser detector in an isolated test browser.
// Synthetic fixtures never read or alter the user's browser profile.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defaultProgress, DAY } from '../src/lib/progress.ts'
import { createSession, rememberSession, answerSession, advanceSession, choiceOptions } from '../src/lib/session.ts'
import { LESSONS } from '../src/lib/lessons.ts'
import type { AppProgress, PracticeMode } from '../src/types.ts'

const runtime = process.env.SLOP_QA_RUNTIME ?? '/tmp/sucheng-slop-audit'
const puppeteerRoot = resolve(runtime, 'node_modules/puppeteer')
const puppeteerPackage = JSON.parse(readFileSync(resolve(puppeteerRoot, 'package.json'), 'utf8'))
const { default: puppeteer } = await import(pathToFileURL(resolve(puppeteerRoot, puppeteerPackage.main)).href)
const { detectUrl } = await import(pathToFileURL(resolve(runtime, 'detector/engines/browser/detect-url.mjs')).href)
const round = process.argv[2] ?? 'before'
if (!['before', 'after'].includes(round)) throw new Error('Expected before or after')
const base = process.env.SLOP_QA_URL ?? 'http://127.0.0.1:4173/sucheng-practice/'
const output = resolve('docs/qa/slop', round)
mkdirSync(output, { recursive: true })
const dict = JSON.parse(readFileSync('public/sucheng-dict.json', 'utf8'))
const now = Date.now()
const lessonEntries = ['日', '月', '明'].map(char => dict.entries.find((e: { char: string }) => e.char === char))
const practiceEntries = ['明', '森', '手', '打', '困'].map(char => dict.entries.find((e: { char: string }) => e.char === char))

function fixture(mode: PracticeMode, state: string) {
  const key = `${mode}:all:`
  let progress = defaultProgress()
  let session = createSession({ key, mode, href: `/practice/${mode}`, source: 'all', label: mode === 'dictation' ? '默寫' : mode === 'code-to-char' ? '看碼選字' : '看字打碼' }, practiceEntries, now)
  if (mode === 'code-to-char') session.options = Object.fromEntries(practiceEntries.map(e => [e.id, choiceOptions(e, dict.entries).map(option => option.id)]))
  if (state === 'hidden') session.hiddenIndices = [0]
  if (state === 'assisted') { session.hiddenIndices = [0]; session.assistedIndices = [0] }
  progress = rememberSession(progress, session)
  if (['wrong', 'correct', 'assisted', 'retry'].includes(state)) {
    const choice = mode === 'code-to-char' ? (state === 'wrong' ? dict.entries.find((e: { quick: string }) => e.quick !== practiceEntries[0].quick) : practiceEntries[0]) : undefined
    progress = answerSession(progress, session, practiceEntries[0], mode === 'code-to-char' ? choice.char : state === 'wrong' || state === 'retry' ? 'zz' : practiceEntries[0].quick, state === 'assisted', 1200, now, choice)
  }
  if (state === 'retry') {
    for (let i = 0; i < 3; i++) {
      progress = advanceSession(progress, key, now + i + 1)
      if (i < 2) { const current = progress.sessions[key]; const entry = practiceEntries[current.index]; progress = answerSession(progress, current, entry, entry.quick, false, 1500, now + i + 2) }
    }
  }
  return progress
}
let complete = defaultProgress()
const completeKey = 'char-to-code:lesson:first-pair'
complete = rememberSession(complete, createSession({ key: completeKey, mode: 'char-to-code', href: '/practice/char-to-code?lesson=first-pair', source: 'lesson', lessonId: 'first-pair', label: '日、月，合成第一個字' }, lessonEntries, now))
for (const entry of lessonEntries) { complete = answerSession(complete, complete.sessions[completeKey], entry, entry.quick, false, 1000, now); complete = advanceSession(complete, completeKey, now) }
// The application starts a new session on a fresh visit to a finished session.
// Completion itself is covered by the native interaction walkthrough and DOM tests.
const partial = fixture('char-to-code', 'wrong')
const weak = structuredClone(partial)
for (const character of Object.values(weak.characters)) character.wrongKeys = { A: 3, B: 3 }
const steady = structuredClone(partial)
for (const character of Object.values(steady.characters)) { character.status = 'steady'; character.successfulChecks = [now - 2 * DAY, now - DAY, now]; character.dueAt = now + 7 * DAY; character.wrongKeys = {} }
const unlocked = structuredClone(complete)
unlocked.unlockedLevel = 2
unlocked.levels['1'] = { completed: true, bestAccuracy: 100, lastAccuracy: 100, attempts: 1 }
const scenarios: { name: string; route: string; progress?: AppProgress; fault?: string; expanded?: boolean }[] = [
  { name: 'home-first', route: '' }, { name: 'home-return', route: '', progress: partial },
  { name: 'learn', route: 'learn' }, { name: 'lesson-first', route: 'learn/first-pair' },
  ...LESSONS.slice(1).map(lesson => ({ name: `lesson-${lesson.id}`, route: `learn/${lesson.id}` })),
  { name: 'learn-expanded', route: 'learn', expanded: true },
  { name: 'lesson-missing', route: 'learn/not-a-lesson' }, { name: 'practice-hub', route: 'practice' },
  ...['input', 'wrong', 'correct', 'retry'].map(state => ({ name: `input-${state}`, route: 'practice/char-to-code', progress: fixture('char-to-code', state) })),
  ...['input', 'wrong', 'correct'].map(state => ({ name: `choice-${state}`, route: 'practice/code-to-char', progress: fixture('code-to-char', state) })),
  ...['reveal', 'hidden', 'assisted'].map(state => ({ name: `dictation-${state}`, route: 'practice/dictation', progress: fixture('dictation', state) })),
  { name: 'levels', route: 'levels' }, { name: 'levels-unlocked', route: 'levels', progress: unlocked },
  { name: 'level-active', route: 'levels/1' }, { name: 'level-locked', route: 'levels/2' }, { name: 'level-missing', route: 'levels/999' },
  { name: 'progress-empty', route: 'progress' }, { name: 'progress-partial', route: 'progress', progress: partial }, { name: 'progress-steady', route: 'progress', progress: steady },
  { name: 'progress-weak', route: 'progress', progress: weak }, { name: 'progress-expanded', route: 'progress', progress: partial, expanded: true },
  { name: 'review-empty', route: 'practice/char-to-code?source=review' },
  { name: 'dictionary-error', route: 'practice/char-to-code', fault: 'dictionary' },
  { name: 'dictionary-loading', route: 'practice/char-to-code', fault: 'loading' },
  { name: 'storage-error', route: 'practice/char-to-code', fault: 'storage' }, { name: 'storage-unavailable', route: 'practice/char-to-code', fault: 'unavailable' }, { name: 'storage-corrupt', route: 'progress', fault: 'corrupt' },
]
const selectedScenarios = process.env.SLOP_QA_SCENARIOS ? scenarios.filter(s => process.env.SLOP_QA_SCENARIOS!.split(',').includes(s.name)) : scenarios
const viewports = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 390, height: 844 }]
const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const records: unknown[] = []
try {
  // Three independent viewport batches; each scan uses a fresh, isolated context.
  await Promise.all(viewports.map(async viewport => {
    for (const theme of ['light', 'dark']) for (const scenario of selectedScenarios) {
      const context = await browser.createBrowserContext()
      const errors: string[] = [], failedRequests: string[] = []
      let measurements: unknown
      const adapter = { newPage: async () => {
        const page = await context.newPage()
        // tsx preserves callback names using this helper when serializing them.
        await page.evaluateOnNewDocument('window.__name = (target) => target;')
        page.on('pageerror', error => errors.push(String(error)))
        page.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`) })
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: theme }])
        await page.evaluateOnNewDocument(({ progress, theme, fault }) => {
          localStorage.setItem('sucheng-practice-settings', JSON.stringify({ theme }))
          localStorage.setItem('sucheng-practice-progress', fault === 'corrupt' ? '{invalid' : JSON.stringify(progress))
          if (fault === 'storage') Storage.prototype.setItem = () => { throw new DOMException('Test quota failure', 'QuotaExceededError') }
          if (fault === 'unavailable') Storage.prototype.getItem = () => { throw new DOMException('Test denied storage', 'SecurityError') }
        }, { progress: scenario.progress ?? defaultProgress(), theme, fault: scenario.fault })
        if (scenario.fault === 'dictionary' || scenario.fault === 'loading') {
          await page.setRequestInterception(true)
          page.on('request', request => {
            if (!request.url().endsWith('sucheng-dict.json')) return request.continue()
            if (scenario.fault === 'dictionary') return request.respond({ status: 503, contentType: 'text/plain', body: 'Synthetic dictionary failure' })
            // Intentionally keep the isolated fixture request pending until teardown.
          })
        }
        if (scenario.expanded) {
          const goto = page.goto.bind(page)
          page.goto = async (...args) => { const response = await goto(...args); await page.evaluate(() => { const details = document.querySelector('details'); if (details) details.open = true }); return response }
        }
        const close = page.close.bind(page)
        page.close = async () => { try {
          measurements = await page.evaluate(() => {
            const visible = (el: Element) => { const rect = el.getBoundingClientRect(); const style = getComputedStyle(el); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' }
            const identify = (el: Element) => `${el.tagName.toLowerCase()}.${el.className} ${el.textContent?.trim().slice(0, 75)}`
            const controls = [...document.querySelectorAll('button,a,input,select,summary')].filter(visible)
            return { title: document.title, theme: document.documentElement.dataset.theme, viewport: [innerWidth, innerHeight], pageWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1,
              headings: [...document.querySelectorAll('h1,h2,h3')].map(el => [el.tagName, el.textContent]),
              fontsLoaded: document.fonts.status, brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
              smallText: [...document.querySelectorAll('p,small,label,summary,button,a')].filter(visible).filter(el => parseFloat(getComputedStyle(el).fontSize) < 14).map(identify),
              smallTargets: controls.filter(el => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44 }).map(el => ({ element: identify(el), size: [el.getBoundingClientRect().width, el.getBoundingClientRect().height] })),
              unnamedControls: controls.filter(el => !el.textContent?.trim() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !(el instanceof HTMLInputElement && el.labels?.length)).map(identify),
              inlineHeadingGaps: [...document.querySelectorAll('h1,h2,h3')].filter(visible).map(el => ({ element: identify(el), before: getComputedStyle(el).marginTop, after: getComputedStyle(el).marginBottom, size: getComputedStyle(el).fontSize, weight: getComputedStyle(el).fontWeight })),
              firstKeys: [...document.querySelectorAll('.first-keyboard .keycap')].map(el => ({ name: el.getAttribute('aria-label'), top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom })),
              navTop: document.querySelector('.mobile-nav')?.getBoundingClientRect().top,
              text: document.querySelector('main')?.textContent?.slice(0, 5000),
              detectorGroups: typeof window.impeccableDetect === 'function' ? window.impeccableDetect({ decorate: false, serialize: true }) : null,
              resources: performance.getEntriesByType('resource').map(entry => ({ name: entry.name, bytes: (entry as PerformanceResourceTiming).transferSize, duration: entry.duration })),
            }
          })
          if (theme === 'light' || viewport.name === 'mobile') await page.screenshot({ path: resolve(output, `${viewport.name}-${theme}-${scenario.name}.png`), fullPage: true })
        } catch (error) { errors.push(`Evidence capture failed: ${error}`) } finally { await close() }
        }
        return page
      } }
      try {
        const findings = await detectUrl(new URL(scenario.route, base).href, { browser: adapter, viewport, waitUntil: scenario.fault === 'loading' ? 'domcontentloaded' : 'networkidle0', settleMs: 120 })
        const record = { viewport: viewport.name, theme, scenario: scenario.name, route: scenario.route, fixture: true, reducedMotion: true, findings, errors, failedRequests, measurements }
        records.push(record)
        writeFileSync(resolve(output, `${viewport.name}-${theme}-${scenario.name}.json`), JSON.stringify(record, null, 2) + '\n')
        console.log(`${viewport.name} ${theme} ${scenario.name}: ${findings.length} detector findings`)
      } catch (error) { records.push({ viewport: viewport.name, theme, scenario: scenario.name, failure: String(error) }); console.error(`${viewport.name} ${theme} ${scenario.name}: ${error}`) }
      finally { await context.close() }
    }
  }))
} finally { await browser.close(); writeFileSync(resolve(output, process.env.SLOP_QA_SCENARIOS ? 'targeted-matrix.json' : 'matrix.json'), JSON.stringify(records, null, 2) + '\n') }
console.log(`Saved ${records.length} scans to ${output}`)
