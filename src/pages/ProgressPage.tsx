import { Link } from 'react-router-dom'
import { useDictionary } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { getChapterIndex, getChapterTitle } from '../lib/levels'
import { defaultProgress, resetProgress } from '../lib/progress'
import { formatAccuracy, formatDuration } from '../lib/stats'

const MODE_LABELS = {
  'char-to-code': '看字打碼',
  'code-to-char': '看碼選字',
  dictation: '默寫模式',
  level: '關卡模式',
} as const

export function ProgressPage() {
  const { progress, setProgress } = useProgress()
  const { dict } = useDictionary()

  const completedLevels = Object.values(progress.levels).filter((item) => item.completed).length
  const totalLevels = dict?.levels.length ?? 0
  const levelPercent = totalLevels ? Math.round((completedLevels / totalLevels) * 100) : 0
  const currentChapter = getChapterTitle(getChapterIndex(progress.unlockedLevel))

  return (
    <div className="page-stack">
      <header className="page-header page-header--center">
        <h1>你的練習紀錄</h1>
        <p className="lede lede--center">資料只存在這台裝置。</p>
      </header>

      <section className="section-block progress-overview">
        <div className="progress-ring" style={{ ['--ring-percent' as string]: `${levelPercent}%` }}>
          <div className="progress-ring-inner">
            <strong>{completedLevels}</strong>
            <span>關已過</span>
          </div>
        </div>
        <div className="progress-overview-copy">
          <p>
            已解鎖到第 <strong>{progress.unlockedLevel}</strong> / {totalLevels || '—'} 關
          </p>
          <p>目前在 {currentChapter}</p>
          <p>字庫共 {dict?.totalChars ?? '—'} 字</p>
        </div>
      </section>

      <section className="section-block">
        <h2>各模式最近成績</h2>
        <div className="progress-bars">
          {Object.entries(MODE_LABELS).map(([mode, label]) => {
            const stats = progress.modes[mode as keyof typeof MODE_LABELS]
            const total = stats.correct + stats.wrong
            const accuracy = total ? Math.round((stats.correct / total) * 100) : stats.lastAccuracy
            return (
              <article key={mode} className="progress-bar-row">
                <div className="progress-bar-head">
                  <strong>{label}</strong>
                  <span>{formatAccuracy(stats.bestAccuracy)} 最佳</span>
                </div>
                <div className="progress-bar-track" aria-hidden="true">
                  <div className="progress-bar-fill" style={{ width: `${accuracy}%` }} />
                </div>
                <p className="progress-bar-meta">
                  {stats.sessions} 次 · 最近 {formatAccuracy(stats.lastAccuracy)} ·{' '}
                  {formatDuration(stats.lastDurationMs)} · 累計 {stats.correct} 對 / {stats.wrong}{' '}
                  錯
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <div className="hero-actions hero-actions--center">
        <Link className="btn btn-primary" to="/practice">
          繼續練習
        </Link>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm('確定要清除所有本地進度嗎？')) {
              resetProgress()
              setProgress(defaultProgress())
            }
          }}
        >
          清除進度
        </button>
      </div>
    </div>
  )
}
