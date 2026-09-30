import { ArrowRight, ChevronRight, Eye, Keyboard, ListChecks, RotateCcw } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { useProgress } from '../hooks/useProgress'
import { resumableSession, reviewCharacters, weakKeys } from '../lib/progress'
import { RADICAL_BY_KEY } from '../lib/cangjie'

const MODES = [{ path: 'char-to-code', title: '看字打碼', description: '看清一個字，自己按出首尾。', icon: Keyboard }, { path: 'code-to-char', title: '看碼選字', description: '從四個字中，認出對應的字。', icon: ListChecks }, { path: 'dictation', title: '先看，再默寫', description: '記住字形，收起來再打碼。', icon: Eye }]
export function PracticeHubPage() {
  const { progress } = useProgress()
  const resume = resumableSession(progress)
  const review = reviewCharacters(progress)
  const weak = weakKeys(progress)[0]
  return <div className="page-section practice-hub"><header className="page-heading"><h1>練幾題，<br />手感就返嚟。</h1><p className="lede">不趕時間。想練幾多，就練幾多。</p></header><section className="practice-invitation"><div><h2>{resume ? '上次未完，接住就得。' : '現在，先來 5 題。'}</h2><p>{resume ? `${resume.label} · 已完成 ${resume.answers.length} 次作答` : '看字打碼，讓手指和字根再熟一點。'}</p></div><AppLink className="button button-primary" to={resume?.href ?? '/practice/char-to-code?source=quick'}>{resume ? '接住練' : '開始 5 題'}<ArrowRight size={20} /></AppLink></section>
    <section className="mode-section"><h2>或者，換個方式。</h2><div className="mode-list">{MODES.map(({ icon: Icon, ...mode }) => <AppLink key={mode.path} to={`/practice/${mode.path}`}><Icon size={26} strokeWidth={1.6} aria-hidden="true" /><span><strong>{mode.title}</strong><small>{mode.description}</small></span><span className="mode-count">10 題</span><ChevronRight size={20} aria-hidden="true" /></AppLink>)}</div></section>
    <section className="review-invitation"><div><RotateCcw size={23} aria-hidden="true" /><h2>{review.length ? `${review.length} 個字，再見一次。` : '錯題會在這裡等你。'}</h2></div><p>{review.length ? review.slice(0, 8).map(c => c.char).join('　') : '練習中答錯的字會留下來，稍後再試。不用自己抄低。'}</p>{review.length > 0 && <AppLink className="text-link" to="/practice/char-to-code?source=review">重溫錯題 <ArrowRight size={18} /></AppLink>}{weak && <AppLink className="text-link" to={`/practice/char-to-code?source=weak&key=${weak[0]}`}>練熟 {weak[0]}「{RADICAL_BY_KEY[weak[0]]?.name}」字根 <ArrowRight size={18} /></AppLink>}</section>
  </div>
}
