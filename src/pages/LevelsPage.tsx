import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { useDictionary } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { AppLink } from '../components/AppLink'
import { LoadingError, LoadingSkeleton } from '../components/LoadingSkeleton'
import { getChapterCount, getChapterIndex, getChapterLevelIds } from '../lib/levels'
import { PracticePage } from './PracticePage'

export function LevelsPage() {
  const { dict, loading, error } = useDictionary()
  const { progress } = useProgress()
  const [selectedChapter, setSelectedChapter] = useState(getChapterIndex(progress.unlockedLevel))
  if (loading) return <LoadingSkeleton label="關卡準備中…" />
  if (error || !dict) return <LoadingError message={error ?? '關卡暫時載入不到。'} onRetry={() => window.location.reload()} />
  const count = getChapterCount(dict.levels.length)
  const chapter = Math.min(count, Math.max(1, selectedChapter))
  const levelIds = getChapterLevelIds(chapter, dict.levels.length)
  const completed = dict.levels.filter(l => progress.levels[l.id]?.completed).length
  return <div className="page-section levels-page"><AppLink className="text-link" to="/learn"><ArrowLeft size={17} />回到學少少</AppLink><header className="page-heading"><h1>一路練落去，<br />字會越識越多。</h1><p className="lede">已完成 {completed} / {dict.levels.length} 關。每關首次準確率達 80%，就開下一關。</p><p className="muted">關卡按字表固定分組。剛開始學，可以先用短課認識字根。</p></header><div className="chapter-switch"><button type="button" className="icon-button" disabled={chapter === 1} onClick={() => setSelectedChapter(chapter - 1)} aria-label="上一章"><ArrowLeft size={20} /></button><label>選擇章節<select value={chapter} onChange={e => setSelectedChapter(Number(e.target.value))}>{Array.from({ length: count }, (_, i) => <option key={i + 1} value={i + 1}>第 {i + 1} 章</option>)}</select></label><button type="button" className="icon-button" disabled={chapter === count} onClick={() => setSelectedChapter(chapter + 1)} aria-label="下一章"><ArrowRight size={20} /></button></div><ol className="level-trail">{levelIds.map(id => {
    const level = dict.levels.find(l => l.id === id)!
    const saved = progress.levels[id]
    const locked = id > progress.unlockedLevel
    const preview = level.charIds.slice(0, 3).map(charId => dict.entries.find(e => e.id === charId)?.char).join(' ')
    const content = <><span className="level-number">{String(id).padStart(2, '0')}</span><span className="level-info"><strong>第 {id} 關 <small>{level.charIds.length} 字</small></strong><span className="level-preview">{preview}</span><small>{locked ? `完成第 ${id - 1} 關後開啟` : saved?.completed ? `已過關 · 最佳 ${saved.bestAccuracy}%` : saved ? `再試一次 · 最佳 ${saved.bestAccuracy}%` : '準備好就開始'}</small></span>{locked ? <LockKeyhole size={19} aria-label="未開啟" /> : saved?.completed ? <Check size={23} aria-label="已過關" /> : <ArrowRight size={23} aria-hidden="true" />}</>
    return <li key={id} className={saved?.completed ? 'is-done' : id === progress.unlockedLevel ? 'is-current' : ''}>{locked ? <div className="level-link is-locked">{content}</div> : <AppLink className="level-link" to={`/levels/${id}`}>{content}</AppLink>}</li>
  })}</ol></div>
}
export function LevelPlayPage() { const { levelId = '1' } = useParams(); return <PracticePage mode="level" levelId={Number(levelId)} /> }
