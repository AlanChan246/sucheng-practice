import { useState } from 'react'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { Keyboard } from '../components/Keyboard'
import { AnswerInput } from '../components/AnswerInput'
import { useProgress } from '../hooks/useProgress'
import { nextLesson } from '../lib/lessons'
import { resumableSession, reviewCharacters } from '../lib/progress'
import { RADICAL_BY_KEY } from '../lib/cangjie'

export function HomePage() {
  const { progress, updateProgress } = useProgress()
  const [firstVisit] = useState(!progress.onboarded)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'idle'|'wrong'|'correct'>('idle')
  const lesson = nextLesson(progress.lessons)
  const resume = resumableSession(progress)
  const review = reviewCharacters(progress)
  const answer = () => {
    if (feedback !== 'idle') return
    if (input === 'ab') { setFeedback('correct'); updateProgress(p => ({ ...p, onboarded: true })) }
    else setFeedback('wrong')
  }
  if (!firstVisit) {
    const to = resume?.href ?? (review.length ? '/practice/char-to-code?source=review' : lesson ? `/learn/${lesson.id}` : '/practice/char-to-code?source=quick')
    const cta = resume ? '接住上次練習' : review.length ? '重溫這幾個字' : lesson ? '學下一小節' : '先練 5 題'
    return <div className="home-return">
      <section className="home-pair"><div className="home-copy"><h1>返嚟喇。<br />手指郁一郁，<br className="desktop-break" />記憶就返嚟。</h1><p className="lede">{resume ? `${resume.label}，上次停在第 ${resume.index + 1} 題。` : review.length ? `有 ${review.length} 個字值得再想一次。先回想，再按出來。` : lesson ? `下一小節：${lesson.title}。` : '隨時練幾題，跟住自己的節奏。'}</p><AppLink className="button button-primary" to={to}>{cta}<ArrowRight size={19} /></AppLink><AppLink className="text-link" to="/practice">今日想換個方式？</AppLink></div><div className="return-word"><span className="display-character">{review[0]?.char ?? '明'}</span><div className="return-word-caption">{review.length ? '見多一次，記得多一點。' : '學少少，試一次。'}</div><div className="decorative-keys" aria-hidden="true">{[...(review[0]?.quick ?? 'ab').toUpperCase()].map((key, i) => <span key={i}>{key}<small>{RADICAL_BY_KEY[key]?.name}</small></span>)}</div></div></section>
      <div className="home-next"><AppLink to="/levels"><span>一步一步，繼續闖關<small>沿用你的關卡進度，隨時再挑戰。</small></span><ChevronRight size={22} /></AppLink><AppLink to="/progress"><span>最近學成點？<small>看看已練過的字和下一步。</small></span><ChevronRight size={22} /></AppLink></div>
    </div>
  }
  return <div className="home-start">
    <section className="home-pair"><div className="home-copy"><h1>明，<br />就係呢兩鍵。</h1><p className="lede">左邊「日」是 A，右邊「月」是 B。<br />先按 A，再按 B，試出第一個字。</p><AppLink className="text-link" to="/practice">已經識少少？直接練 <ArrowRight size={17} /></AppLink></div>
      <div className={`first-word ${feedback === 'correct' ? 'first-word--correct' : ''}`}><div className="display-character" aria-label="明字">明</div><div className="first-root-labels"><span>日 <b>A</b></span><span>月 <b>B</b></span></div>
        {feedback === 'correct' ? <div className="first-success" role="status"><p><Check size={21} />第一個字，搞掂！</p><AppLink className="button button-primary" to="/learn/first-pair">再試一點，自己記住 <ArrowRight size={18} /></AppLink></div> : <><AnswerInput value={input} onChange={setInput} onSubmit={answer} length={2} disabled={feedback === 'wrong'} invalid={feedback === 'wrong'} feedbackId={feedback === 'wrong' ? 'first-feedback' : undefined} hint="A B" />{feedback === 'wrong' && <div id="first-feedback" className="first-retry" role="status"><p>差少少。先日 A，再月 B。</p><button type="button" className="text-button" onClick={() => { setInput(''); setFeedback('idle') }}>再按一次</button></div>}</>}
      </div>
    </section>
    <section className="first-keyboard" aria-label="試按日月鍵"><Keyboard keys={['A','B']} onKey={key => { if (feedback === 'idle') setInput(v => (v + key).slice(0, 2)) }} onDelete={() => setInput(v => v.slice(0, -1))} value={input} highlight={feedback === 'wrong' ? 'ab' : ''} disabled={feedback !== 'idle'} /><p>先學兩鍵。下一小節，再加一點。</p></section>
    <div className="home-footnote"><span>學少少</span><ArrowRight size={15} aria-hidden="true" /><span>自己試</span><ArrowRight size={15} aria-hidden="true" /><span>慢慢記得</span></div>
  </div>
}
