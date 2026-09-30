import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Eye, Lightbulb, RotateCcw } from 'lucide-react'
import { useDictionary, entriesForLevel } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { LESSONS } from '../lib/lessons'
import { advanceSession, answerSession, choiceOptions, createSession, rememberSession, sessionStats } from '../lib/session'
import { reviewCharacters } from '../lib/progress'
import { shuffle } from '../lib/shuffle'
import { formatDuration } from '../lib/stats'
import { AppLink } from '../components/AppLink'
import { AnswerInput } from '../components/AnswerInput'
import { Keyboard } from '../components/Keyboard'
import { CodeExplanation } from '../components/CodeExplanation'
import { LoadingError, LoadingSkeleton } from '../components/LoadingSkeleton'
import type { DictEntry, Dictionary, PracticeMode, PracticeSession } from '../types'

const MODE_LABELS = { 'char-to-code': '看字打碼', 'code-to-char': '看碼選字', dictation: '默寫', level: '關卡練習' }

export function PracticePage({ mode, levelId }: { mode: PracticeMode; levelId?: number }) {
  const { dict, loading, error } = useDictionary()
  const { progress } = useProgress()
  const [params] = useSearchParams()
  const location = useLocation()
  const lesson = LESSONS.find(l => l.id === params.get('lesson'))
  const requestedSource = params.get('source')
  const source: PracticeSession['source'] = levelId !== undefined ? 'level' : lesson ? 'lesson' : ['quick','review','weak'].includes(requestedSource ?? '') ? requestedSource as PracticeSession['source'] : 'all'
  const weakKey = (params.get('key') ?? '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 1)
  const key = `${mode}:${source}:${levelId ?? lesson?.id ?? weakKey}`
  if (loading) return <LoadingSkeleton label="字庫準備中…" />
  if (error || !dict) return <LoadingError message={error ?? '字庫未能載入。'} onRetry={() => window.location.reload()} />
  if (levelId !== undefined && (!Number.isInteger(levelId) || !dict.levels.some(l => l.id === levelId))) return <Empty title="找不到這一關" text="回到關卡列表，選一關再試。" to="/levels" action="查看關卡" />
  if (levelId && levelId > progress.unlockedLevel) return <Empty title="下一步，先完成前一關" text={`第 ${progress.unlockedLevel} 關完成後，就會開啟下一關。`} to={`/levels/${progress.unlockedLevel}`} action="接住挑戰" />
  let entries = dict.entries
  if (levelId) entries = entriesForLevel(dict, levelId)
  else if (lesson) entries = lesson.chars.flatMap(char => dict.entries.find(e => e.char === char) ?? [])
  else if (source === 'review') { const ids = new Set(reviewCharacters(progress).map(c => c.id)); entries = entries.filter(e => ids.has(e.id)) }
  else if (source === 'weak') entries = weakKey ? entries.filter(e => e.quick.includes(weakKey)) : []
  const config = { key, href: location.pathname + location.search, mode, source, levelId, lessonId: lesson?.id, label: levelId ? `第 ${levelId} 關` : lesson ? lesson.title : source === 'review' ? '重溫這幾個字' : source === 'weak' ? `練熟 ${weakKey.toUpperCase()} 鍵` : source === 'quick' ? '先練 5 題' : MODE_LABELS[mode] }
  return <PracticeEngine key={key} dict={dict} pool={entries} config={config} />
}

function PracticeEngine({ dict, pool, config }: { dict: Dictionary; pool: DictEntry[]; config: Pick<PracticeSession,'key'|'href'|'label'|'mode'|'source'|'levelId'|'lessonId'> }) {
  const { progress, updateProgress, storageIssue } = useProgress()
  const [revealTime, setRevealTime] = useState('manual')
  const initialized = useRef(false)
  const session = progress.sessions[config.key]
  const newSession = () => {
    if (!pool.length) {
      updateProgress(p => { const sessions = { ...p.sessions }; delete sessions[config.key]; return { ...p, sessions } })
      return
    }
    const entries = config.source === 'level' || config.source === 'lesson' ? pool : shuffle(pool).slice(0, config.source === 'quick' ? 5 : 10)
    const next = createSession(config, entries)
    if (config.mode === 'code-to-char') next.options = Object.fromEntries(entries.map(e => [e.id, choiceOptions(e, dict.entries).map(option => option.id)]))
    updateProgress(p => rememberSession(p, next))
  }
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (!session || session.finishedAt || session.queue.some(q => !dict.entries.some(e => e.id === q.entryId))) newSession()
  })
  if (!session) return pool.length ? <LoadingSkeleton label="準備這組字…" /> : <Empty title="這組暫時沒有要重溫的字" text="試試下一小節，或隨手練幾題。新的練習會繼續幫你找出值得重溫的地方。" to="/practice" action="去練幾題" />
  if (session.finishedAt) return <SessionComplete session={session} dict={dict} onRestart={pool.length ? newSession : undefined} />
  const entry = dict.entries.find(e => e.id === session.queue[session.index]?.entryId)
  if (!entry) return <Empty title="這組題目需要重新準備" text="字庫有更新，請回到練習頁開始新的一組。已完成的成績仍然保留。" to="/practice" action="回到練習" />
  const firstAnswered = session.answers.filter(a => !a.retry).length
  return <div className="practice-shell">
    <header className="practice-topbar"><AppLink className="practice-exit" to={config.levelId ? '/levels' : config.lessonId ? `/learn/${config.lessonId}` : '/practice'}><ArrowLeft size={18} />稍後繼續</AppLink><h1>{session.label}</h1><span>{session.queue[session.index].retry ? '隔題再試' : `${firstAnswered + (session.answers[session.index] ? 0 : 1)} / ${session.initialCount}`}</span></header>
    <div className="practice-progress" role="progressbar" aria-label="首次作答進度" aria-valuemin={0} aria-valuemax={session.initialCount} aria-valuenow={firstAnswered}><span style={{ transform: `scaleX(${firstAnswered / session.initialCount})` }} /></div>
    <Question key={`${session.id}-${session.index}`} session={session} entry={entry} dict={dict} revealTime={revealTime} setRevealTime={setRevealTime} />
    <p className="practice-save-note">{storageIssue ? '進度暫存於目前頁面，請留意儲存提示。' : '每答一題都會儲存。想休息，隨時再接住。'}</p>
  </div>
}

function Question({ session, entry, dict, revealTime, setRevealTime }: { session: PracticeSession; entry: DictEntry; dict: Dictionary; revealTime: string; setRevealTime: (value: string) => void }) {
  const { updateProgress } = useProgress()
  const [input, setInput] = useState('')
  const [hint, setHint] = useState(false)
  const [peek, setPeek] = useState(false)
  const startedAt = useRef(Date.now())
  const nextRef = useRef<HTMLButtonElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const answer = session.answers[session.index]
  const hidden = session.hiddenIndices?.includes(session.index)
  const isDictation = session.mode === 'dictation'
  const isChoice = session.mode === 'code-to-char'
  const reveal = isDictation && (!hidden || peek) && !answer
  const assisted = session.assistedIndices?.includes(session.index) ?? false
  const options = useMemo(() => (session.options[entry.id] ?? []).flatMap(id => dict.entries.find(e => e.id === id) ?? []), [session.options, entry.id, dict])
  const markAssisted = () => updateProgress(p => { const s = p.sessions[session.key]; return { ...p, sessions: { ...p.sessions, [session.key]: { ...s, assistedIndices: [...new Set([...(s.assistedIndices ?? []), session.index])] } } } })
  const hide = useCallback(() => {
    startedAt.current = Date.now(); setPeek(false)
    updateProgress(p => { const s = p.sessions[session.key]; return { ...p, sessions: { ...p.sessions, [session.key]: { ...s, hiddenIndices: [...new Set([...(s.hiddenIndices ?? []), session.index])] } } } })
  }, [session.key, session.index, updateProgress])
  useEffect(() => {
    if (!reveal || revealTime === 'manual') return
    const timer = window.setTimeout(hide, Number(revealTime))
    return () => window.clearTimeout(timer)
  }, [reveal, revealTime, hide])
  useEffect(() => { if (answer) nextRef.current?.focus() }, [answer])
  useEffect(() => { if (isChoice && !answer && !window.matchMedia('(pointer: coarse)').matches) optionsRef.current?.querySelector('button')?.focus() }, [isChoice, answer])
  const submit = (chosen?: DictEntry) => {
    if (answer || reveal || (!chosen && !input)) return
    updateProgress(p => answerSession(p, p.sessions[session.key], entry, chosen?.char ?? input, assisted, Date.now() - startedAt.current, Date.now(), chosen))
  }
  const next = () => updateProgress(p => advanceSession(p, session.key))
  const press = (key: string) => { if (!answer && !reveal) setInput(v => (v + key).slice(0, entry.quick.length)) }
  const wrongPosition = isChoice ? '字根對應' : answer && entry.quick.length === 2 ? (answer.input[0] === entry.quick[0] ? '尾碼' : answer.input[1] === entry.quick[1] ? '首碼' : '首尾') : '這個鍵'
  return <div className={`question ${answer?.correct ? 'question--correct' : ''}`} onKeyDown={event => {
    if (answer || reveal || event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return
    if (isChoice) { if (/^[1-4]$/.test(event.key) && options[Number(event.key) - 1]) { event.preventDefault(); submit(options[Number(event.key) - 1]) }; return }
    if (/^[a-z]$/i.test(event.key)) { event.preventDefault(); press(event.key.toLowerCase()) }
    if (event.key === 'Backspace') { event.preventDefault(); setInput(v => v.slice(0, -1)) }
  }}>
    <section className="question-stage" aria-label={isChoice ? '看碼選字題目' : '漢字題目'}>
      <p className="question-instruction">{reveal ? '先看清楚，記住這個字。' : isChoice ? '哪個字可以用這個碼打出來？' : isDictation && !answer ? '回想剛才的字，輸入速成碼。' : session.queue[session.index].retry ? '隔咗幾題，仲記唔記得？' : '看清楚這個字，再按首尾。'}</p>
      <div className={`prompt-char ${isChoice ? 'prompt-char--code' : ''} ${isDictation && !reveal && !answer ? 'prompt-char--hidden' : ''}`} aria-label={isDictation && !reveal && !answer ? '漢字已收起' : undefined}>{isChoice ? entry.quick.toUpperCase() : isDictation && !reveal && !answer ? <Eye size={58} strokeWidth={1.3} aria-hidden="true" /> : entry.char}</div>
      {reveal ? <div className="memory-controls"><button className="button button-primary" type="button" onClick={hide}>記住了，收起來 <ArrowRight size={18} /></button><label>顯示時間<select value={revealTime} onChange={e => setRevealTime(e.target.value)}><option value="manual">由我決定</option><option value="4000">4 秒</option><option value="1800">1.8 秒</option></select></label></div> : isChoice ? <div ref={optionsRef} className="char-options" role="group" aria-label="選出正確漢字">{options.map((option, i) => <button type="button" key={option.id} disabled={Boolean(answer)} className={`char-option ${answer && option.quick === entry.quick ? 'char-option--correct' : ''} ${answer?.input === option.char ? 'char-option--selected' : ''}`} onClick={() => submit(option)}><small>{i + 1}</small><span>{option.char}</span>{answer && option.quick === entry.quick && <Check size={20} aria-label="正確選項" />}{answer?.input === option.char && <span className="choice-label">你的選擇</span>}</button>)}</div> : <AnswerInput value={answer?.input ?? input} onChange={setInput} onSubmit={() => submit()} length={entry.quick.length} disabled={Boolean(answer)} invalid={Boolean(answer && !answer.correct)} feedbackId={answer ? 'answer-feedback' : undefined} />}
      {!answer && !reveal && <div className="question-help"><button type="button" className="text-button" onClick={() => { markAssisted(); setHint(v => !v) }}><Lightbulb size={17} />{hint ? '收起提示' : '想看一點提示'}</button>{isDictation && <button type="button" className="text-button" onClick={() => { markAssisted(); setPeek(true) }}><Eye size={17} />再看一次</button>}</div>}
      {hint && !answer && <div className="hint-panel"><CodeExplanation entry={entry} /><p className="muted">看過提示的題會記作有協助，不計首次答對。</p></div>}
    </section>
    {answer && <section id="answer-feedback" className={`answer-feedback ${answer.correct ? 'answer-feedback--correct' : ''}`} aria-label="答案回饋">
      <div role="status"><h2>{answer.correct ? answer.assisted ? '搵到方法喇，再試就更熟。' : '搞掂！' : `差少少，睇吓${wrongPosition}。`}</h2><p>{answer.correct ? answer.retry ? '這次想起來了，之後再確認一次。' : answer.assisted ? '這題有提示，下次試試自己回想。' : `${entry.char}，${entry.quick.toUpperCase()}。記住這一下。` : isChoice ? `你選了「${answer.input}」；這題可選的是「${entry.char}」。` : `你輸入 ${answer.input.toUpperCase()}，這個字是 ${entry.quick.toUpperCase()}。`}</p></div>
      {!answer.correct && <CodeExplanation entry={entry} />}
      {!answer.correct && <p className="feedback-later">已加入重溫。{session.queue.some(q => q.entryId === entry.id && q.retry) ? '隔幾題再試一次。' : '下一組練習再見。'}</p>}
      <button ref={nextRef} type="button" className="button button-primary" onClick={next}>{session.index + 1 === session.queue.length ? '看看這次練習' : '再嚟一題'}<ArrowRight size={19} /></button>
    </section>}
    {!isChoice && !reveal && <section className="practice-keyboard" aria-label="輸入鍵盤"><Keyboard onKey={press} onDelete={() => setInput(v => v.slice(0, -1))} value={answer?.input ?? input} highlight={answer && !answer.correct || hint ? entry.quick : ''} disabled={Boolean(answer)} /><p className="keyboard-caption">{answer && !answer.correct ? '有描邊的鍵，就是這個字的首尾。' : '實體鍵盤，或點下方字根，都得。'}</p></section>}
  </div>
}

function SessionComplete({ session, dict, onRestart }: { session: PracticeSession; dict: Dictionary; onRestart?: () => void }) {
  const stats = sessionStats(session)
  const passed = stats.correct / session.initialCount >= (session.lessonId ? 1 : 0.8)
  const mistakes = [...new Set(session.answers.filter(a => !a.correct || a.assisted).map(a => a.entryId))].flatMap(id => dict.entries.find(e => e.id === id) ?? [])
  const recovered = new Set(session.answers.filter(a => a.retry && a.correct).map(a => a.entryId)).size
  const nextLesson = session.lessonId ? LESSONS[LESSONS.findIndex(l => l.id === session.lessonId) + 1] : undefined
  return <section className="completion page-section">
    <span className="completion-mark" aria-hidden="true"><Check size={34} /></span>
    <h1>{session.levelId ? passed ? '過關，行前一步！' : '差一點，再試會更熟。' : session.lessonId && !passed ? '先記住這幾個，再試一次。' : '搞掂，又熟咗一點。'}</h1>
    <p className="lede">首次自己答對 <strong>{stats.correct} / {session.initialCount}</strong> 題。{session.levelId && (passed ? '這一關的進度已記低。' : '首次準確率達 80% 就能開下一關。')}{session.lessonId && (passed ? '這小節完成了。' : '全部自己答對後，就完成這小節。')}</p>
    {recovered > 0 && <p>隔題重試時，想起了 {recovered} 個字。之後再確認一次。</p>}
    {mistakes.length > 0 && <div className="completion-review"><h2>這幾個，值得再見一次。</h2><div className="character-strip">{mistakes.map(e => <span key={e.id}>{e.char}<small>{e.quick.toUpperCase()}</small></span>)}</div><AppLink className="text-link" to="/practice/char-to-code?source=review">重溫錯題 <ArrowRight size={18} /></AppLink></div>}
    <div className="actions">{session.levelId && passed && session.levelId < dict.levels.length ? <AppLink className="button button-primary" to={`/levels/${session.levelId + 1}`}>下一關 <ArrowRight size={18} /></AppLink> : nextLesson && passed ? <AppLink className="button button-primary" to={`/learn/${nextLesson.id}`}>下一小節 <ArrowRight size={18} /></AppLink> : <AppLink className="button button-primary" to="/learn">學少少新內容 <ArrowRight size={18} /></AppLink>}{onRestart && <button type="button" className="button button-secondary" onClick={onRestart}><RotateCcw size={17} />再試一組</button>}<AppLink className="text-link" to="/progress">看看足跡</AppLink></div>
    <details className="plain-details"><summary>這次的成績細節</summary><p>首次準確率 {stats.accuracy}% · 作答用時 {formatDuration(stats.elapsedMs)}。有提示或重新看過答案的題，不算獨立答對；隔題重試不增加通關分數。</p></details>
  </section>
}

export function Empty({ title, text, to, action }: { title: string; text: string; to: string; action: string }) { return <section className="empty-state"><div className="empty-keys" aria-hidden="true"><span>A<small>日</small></span><span>B<small>月</small></span></div><h1>{title}</h1><p className="lede">{text}</p><AppLink to={to} className="button button-primary">{action}<ArrowRight size={18} /></AppLink></section> }
