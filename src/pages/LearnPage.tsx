import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { Keyboard } from '../components/Keyboard'
import { CodeExplanation } from '../components/CodeExplanation'
import { LoadingError, LoadingSkeleton } from '../components/LoadingSkeleton'
import { useDictionary } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { LESSONS, nextLesson } from '../lib/lessons'
import { RADICAL_BY_KEY } from '../lib/cangjie'
import { CODING_EXAMPLES, CODING_RULES, RADICAL_VARIANTS } from '../lib/learnContent'
import { Empty } from './PracticePage'

export function LearnPage() {
  const { progress } = useProgress()
  const next = nextLesson(progress.lessons)
  const [selected, setSelected] = useState('A')
  const [example, setExample] = useState(CODING_EXAMPLES[1])
  return <div className="page-section learn-index"><header className="page-heading"><h1>一次學少少，<br />立即試得到。</h1><p className="lede">認一點字根，按幾下，再自己回想。<br />每小節只練一個概念。</p>{next && <AppLink className="button button-primary" to={`/learn/${next.id}`}>{Object.keys(progress.lessons).length ? '接住下一小節' : '由第一個字開始'}<ArrowRight size={18} /></AppLink>}</header>
    <section className="lesson-path" aria-label="短課程"><h2>先從這裡上手。</h2><ol>{LESSONS.map((lesson, index) => <li key={lesson.id}><AppLink to={`/learn/${lesson.id}`}><span className={`lesson-number ${progress.lessons[lesson.id]?.completed ? 'is-complete' : ''}`}>{progress.lessons[lesson.id]?.completed ? <Check size={24} aria-label="已完成" /> : String(index + 1).padStart(2, '0')}</span><span className="lesson-description"><strong>{lesson.title}</strong><small>{lesson.description}</small></span><span className="lesson-example" aria-hidden="true">{lesson.example}</span><ChevronRight size={20} aria-hidden="true" /></AppLink></li>)}</ol></section>
    <section className="levels-invitation"><div><h2>想一路練落去？</h2><p>到關卡練字庫；準確率達 80%，就開下一關。</p></div><AppLink className="text-link" to="/levels">看看關卡 <ArrowRight size={18} /></AppLink></section>
    <section className="root-reference" id="reference"><h2>忘記哪個鍵？這裡找。</h2><p className="muted">24 個基本字根，加上 X「難」、Z「重」特殊鍵。點一下，看常見變形。</p><Keyboard onKey={key => setSelected(key.toUpperCase())} value={selected} label="點選字根查看說明" /><div className="root-detail" aria-live="polite"><div className="root-detail-heading"><span>{RADICAL_BY_KEY[selected].name}</span><code>{selected}</code></div><div>{(RADICAL_VARIANTS[selected] ?? []).map((variant, i) => <p key={i}>{variant.form && <strong className="variant-glyph">{variant.form}</strong>}{variant.note}{variant.examples.length > 0 && <small>例：{variant.examples.join('、')}</small>}</p>)}{!RADICAL_VARIANTS[selected]?.length && <p>先記住「{RADICAL_BY_KEY[selected].name}」對應 {selected}。拆字時再按這個鍵。</p>}</div></div></section>
    <details className="plain-details reference-details"><summary>再看看取碼規則與例字</summary><ol className="coding-rules">{CODING_RULES.map(rule => <li key={rule.title}><strong>{rule.title}</strong><p>{rule.body}</p></li>)}</ol><div className="example-picker" role="group" aria-label="選一個例字">{CODING_EXAMPLES.map(item => <button type="button" key={item.char} aria-pressed={item.char === example.char} onClick={() => setExample(item)}>{item.char}</button>)}</div><CodeExplanation entry={example} /></details>
  </div>
}

export function LessonPage() {
  const { lessonId } = useParams()
  const lesson = LESSONS.find(l => l.id === lessonId)
  const { dict, loading, error } = useDictionary()
  const [pressed, setPressed] = useState('')
  if (!lesson) return <Empty title="這個小節暫時找不到" text="回到短課列表，揀一節開始。" to="/learn" action="查看短課" />
  if (loading) return <LoadingSkeleton label="準備這個小節…" />
  if (error || !dict) return <LoadingError message={error ?? '字庫載入失敗。'} onRetry={() => window.location.reload()} />
  const entry = dict.entries.find(e => e.char === lesson.example)
  if (!entry) return <LoadingError message="這個例字暫時未能載入，請先返回短課列表。" />
  return <article className="lesson-page page-section"><AppLink className="text-link" to="/learn"><ArrowLeft size={17} />所有短課</AppLink><div className="lesson-composition"><div className="lesson-copy"><h1>{lesson.title}</h1><p className="lede">{lesson.note}</p><p>按下方鍵帽，感受一下；然後收起提示，自己試 {lesson.chars.length} 題。</p><AppLink className="button button-primary" to={`/practice/char-to-code?lesson=${lesson.id}`}>收起提示，自己試 <ArrowRight size={19} /></AppLink></div><div className="lesson-specimen"><div className="display-character">{entry.char}</div><CodeExplanation entry={entry} /></div></div><div className="lesson-keyboard"><Keyboard keys={[...new Set([...lesson.keys, ...entry.quick.toUpperCase()])]} onKey={key => setPressed(v => (v.length >= entry.quick.length ? key : v + key))} onDelete={() => setPressed(v => v.slice(0, -1))} value={pressed} /><p className="lesson-press-result" aria-live="polite">{pressed ? `${pressed.toUpperCase()} · ${[...pressed.toUpperCase()].map(k => RADICAL_BY_KEY[k]?.name).join('、')}` : '點字根鍵，看看它對應的字母。'}</p></div></article>
}
