import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { useProgress } from '../hooks/useProgress'
import { reviewCharacters, resetProgress, weakKeys } from '../lib/progress'
import { nextLesson, LESSONS } from '../lib/lessons'
import { RADICAL_BY_KEY } from '../lib/cangjie'
import { formatDuration } from '../lib/stats'

const MODE_LABELS = { 'char-to-code': '看字打碼', 'code-to-char': '看碼選字', dictation: '默寫', level: '關卡' }
export function ProgressPage() {
  const { progress } = useProgress()
  const characters = Object.values(progress.characters)
  const review = reviewCharacters(progress)
  const steady = characters.filter(c => c.status === 'steady')
  const next = nextLesson(progress.lessons)
  const weak = weakKeys(progress).slice(0, 3)
  const hasHistory = Object.values(progress.modes).some(m => m.sessions > 0)
  const finishedLessons = LESSONS.filter(l => progress.lessons[l.id]?.completed)
  return <div className="page-section progress-page"><header className="page-heading"><h1>{characters.length ? '慢慢練，\n真的有記住。'.split('\n').map((line, i) => <span className="heading-line" key={i}>{line}</span>) : '每次試，都算一步。'}</h1><p className="lede">{characters.length ? `最近已練過 ${characters.length} 個字。${steady.length ? `其中 ${steady.length} 個，隔一段時間再試也能想起來。` : '多隔幾次回想，才會知道哪些字記得穩。'}` : hasHistory ? '舊成績已保留。再開始一組練習，就能逐字記下你的進步。' : '先試一組。這裡會記住你練過甚麼，再給你下一步。'}</p></header>
    <section className="progress-next"><div><h2>{review.length ? '這幾個字，再見一次。' : next ? '下一小節，試一點新的。' : '都試過了，再保持手感。'}</h2><p>{review.length ? '先想首尾，再按出來。答案不急著看。' : next ? next.title : '學會後也可以隔一段時間再回想。'}</p>{review.length > 0 && <div className="character-strip">{review.slice(0, 8).map(c => <span key={c.id}>{c.char}<small>{c.status === 'review' ? '再試' : '到期重溫'}</small></span>)}</div>}</div><AppLink className="button button-primary" to={review.length ? '/practice/char-to-code?source=review' : next ? `/learn/${next.id}` : '/practice/char-to-code?source=quick'}>{review.length ? '重溫這一組' : next ? '學少少' : '練 5 題'}<ArrowRight size={18} /></AppLink></section>
    {weak.length > 0 && <section className="weak-key-section"><h2>這幾個鍵，多碰面就熟。</h2><p>以下鍵位在作答中出現過至少三次首尾混淆。</p><div className="weak-key-list">{weak.map(([key]) => <AppLink key={key} to={`/practice/char-to-code?source=weak&key=${key}`}><span className="small-key">{key}<small>{RADICAL_BY_KEY[key]?.name}</small></span><span>練熟這個字根</span><ArrowRight size={18} /></AppLink>)}</div></section>}
    <section className="learning-footprints"><h2>小節，一步一步完成。</h2><p className="muted">{finishedLessons.length} / {LESSONS.length} 小節已完成；完成是這次會做，記得穩還要之後再試。</p><ul className="lesson-dots">{LESSONS.map((lesson, i) => <li key={lesson.id}><AppLink to={`/learn/${lesson.id}`} aria-label={`第 ${i + 1} 小節：${lesson.title}${progress.lessons[lesson.id]?.completed ? '，已完成' : ''}`} className={progress.lessons[lesson.id]?.completed ? 'is-done' : ''}><span>{progress.lessons[lesson.id]?.completed ? <Check size={19} aria-hidden="true" /> : i + 1}</span><small>{lesson.example}</small></AppLink></li>)}</ul></section>
    {steady.length > 0 && <section className="steady-section"><h2>隔幾次再試，也想得起。</h2><div className="character-strip">{steady.slice(0, 18).map(c => <span key={c.id}>{c.char}</span>)}</div><p className="muted">至少三次相隔一天的獨立回憶答對，才會列在這裡。選字、看提示和當場重打不算。</p></section>}
    <details className="plain-details"><summary>各模式與關卡的詳細紀錄</summary><div className="table-scroll" role="region" aria-label="各模式詳細成績，可左右捲動" tabIndex={0}><table><caption>次數是已完成的題組；最近是上次準確率，最佳是最高準確率。新版紀錄採首次獨立作答準確率，用時只累加作答時間。</caption><thead><tr><th scope="col">模式</th><th scope="col">次數</th><th scope="col">最近</th><th scope="col">最佳</th><th scope="col">最近用時</th></tr></thead><tbody>{Object.entries(MODE_LABELS).map(([mode, label]) => { const stats = progress.modes[mode as keyof typeof MODE_LABELS]; return <tr key={mode}><th scope="row">{label}</th><td>{stats.sessions}</td><td>{stats.sessions ? `${stats.lastAccuracy}%` : '未開始'}</td><td>{stats.sessions ? `${stats.bestAccuracy}%` : '—'}</td><td>{stats.sessions ? formatDuration(stats.lastDurationMs) : '—'}</td></tr> })}</tbody></table></div><p>已完成 {Object.values(progress.levels).filter(l => l.completed).length} 關。舊版本用時包含閱讀回饋；新版只累加每題作答時間，兩者不作速度比較。</p><AppLink className="text-link" to="/levels">回到關卡 <ArrowRight size={17} /></AppLink></details>
    <footer className="progress-settings"><p>進度只儲存在這個瀏覽器，不會跨裝置同步。</p><button className="text-button" type="button" onClick={() => { if (window.confirm('清除所有練習、短課、錯題與關卡進度？這個操作無法復原，主題設定會保留。')) resetProgress() }}><RotateCcw size={15} />重新開始，清除進度</button></footer>
  </div>
}
