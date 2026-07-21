import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { CodeInput } from '../components/CodeInput'
import { FeedbackActions } from '../components/FeedbackActions'
import { LoadingError, LoadingSkeleton } from '../components/LoadingSkeleton'
import { PracticeComplete, PracticeShell } from '../components/PracticeShell'
import { SecondaryNavButton } from '../components/SecondaryNavButton'
import { entriesForLevel, useDictionary } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { useTimer } from '../hooks/useTimer'
import {
  getChapterCount,
  getChapterIndex,
  getChapterLevelIds,
  getChapterRangeLabel,
  getChapterTitle,
} from '../lib/levels'
import { loadProgress, recordLevelAttempt, recordModeSession } from '../lib/progress'
import { getHighlightKeys, isQuickMatch } from '../lib/quick'
import { createSessionStats, formatAccuracy, updateSessionStats } from '../lib/stats'
import type { DictEntry } from '../types'

const PASS_ACCURACY = 80

export function LevelsPage() {
  const { dict, loading, error } = useDictionary()
  const { progress } = useProgress()
  const [visibleChapter, setVisibleChapter] = useState(getChapterIndex(progress.unlockedLevel))

  const chapterCount = dict ? getChapterCount(dict.levels.length) : 0

  const chapters = useMemo(() => {
    if (!dict) return []
    const start = Math.max(1, visibleChapter - 1)
    const end = Math.min(chapterCount, visibleChapter + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [dict, chapterCount, visibleChapter])

  if (loading) return <LoadingSkeleton label="載入關卡中…" />
  if (error || !dict) {
    return (
      <LoadingError
        message={error ?? '字庫載入失敗'}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="page-stack">
      <header className="page-header page-header--center">
        <h1>關卡地图</h1>
        <p className="lede lede--center">
          第 {progress.unlockedLevel} / {dict.levels.length} 關已解鎖，每關 {dict.charsPerLevel} 字，準確率 {PASS_ACCURACY}% 過關。
        </p>
      </header>

      <div className="chapter-nav">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={visibleChapter <= 1}
          onClick={() => setVisibleChapter((c) => Math.max(1, c - 1))}
        >
          上一章
        </button>
        <span className="chapter-nav-label">
          {getChapterTitle(visibleChapter)} · {getChapterRangeLabel(visibleChapter, dict.levels.length)}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={visibleChapter >= chapterCount}
          onClick={() => setVisibleChapter((c) => Math.min(chapterCount, c + 1))}
        >
          下一章
        </button>
      </div>

      {chapters.map((chapterIndex) => {
        const levelIds = getChapterLevelIds(chapterIndex, dict.levels.length)
        return (
          <section key={chapterIndex} className="section-block chapter-section">
            <h2>{getChapterTitle(chapterIndex)}</h2>
            <p className="chapter-range">{getChapterRangeLabel(chapterIndex, dict.levels.length)}</p>
            <div className="chapter-track" role="list">
              {levelIds.map((levelId) => {
                const saved = progress.levels[String(levelId)]
                const locked = levelId > progress.unlockedLevel
                const isCurrent = levelId === progress.unlockedLevel
                return (
                  <Link
                    key={levelId}
                    to={locked ? '#' : `/levels/${levelId}`}
                    role="listitem"
                    className={[
                      'level-node',
                      locked ? 'level-node--locked' : '',
                      saved?.completed ? 'level-node--done' : '',
                      isCurrent ? 'level-node--current' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-disabled={locked}
                    title={locked ? `先完成第 ${progress.unlockedLevel} 關` : `第 ${levelId} 關`}
                    onClick={(event) => {
                      if (locked) event.preventDefault()
                    }}
                  >
                    <span className="level-node-num">{levelId}</span>
                    {saved?.completed && <span className="level-node-badge">✓</span>}
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function LevelPlayPage() {
  const { levelId = '1' } = useParams()
  const numericLevel = Number(levelId)
  const { dict, loading, error } = useDictionary()
  const { progress, setProgress } = useProgress()
  const [entries, setEntries] = useState<DictEntry[]>([])
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [stats, setStats] = useState(createSessionStats)
  const [finished, setFinished] = useState(false)
  const active = !finished && entries.length > 0
  const { elapsedMs, reset } = useTimer(active)

  const current = entries[index]
  const locked = numericLevel > progress.unlockedLevel

  useEffect(() => {
    if (!dict) return
    setEntries(entriesForLevel(dict, numericLevel))
    reset()
  }, [dict, numericLevel, reset])

  if (loading) return <LoadingSkeleton label="載入關卡中…" />
  if (error || !dict) {
    return (
      <LoadingError
        message={error ?? '字庫載入失敗'}
        onRetry={() => window.location.reload()}
      />
    )
  }
  if (locked) {
    return (
      <div className="page-stack">
        <p className="status">這一關尚未解鎖，請先完成第 {progress.unlockedLevel} 關。</p>
        <SecondaryNavButton to="/levels">返回關卡地图</SecondaryNavButton>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!current || finished || feedback !== 'idle') return
    const correct = isQuickMatch(input, current.quick)
    setFeedback(correct ? 'correct' : 'wrong')
    setStats((prev) => updateSessionStats({ ...prev, elapsedMs }, correct))
  }

  const finishLevel = () => {
    const finalStats = { ...stats, elapsedMs }
    const passed = finalStats.accuracy >= PASS_ACCURACY
    let next = recordLevelAttempt(loadProgress(), numericLevel, finalStats.accuracy, passed)
    next = recordModeSession(
      next,
      'level',
      finalStats.correct,
      finalStats.wrong,
      finalStats.elapsedMs,
    )
    setProgress(next)
    setFinished(true)
  }

  const nextQuestion = () => {
    if (index + 1 >= entries.length) {
      finishLevel()
      return
    }
    setIndex((value) => value + 1)
    setInput('')
    setFeedback('idle')
  }

  const restart = () => {
    setIndex(0)
    setInput('')
    setFeedback('idle')
    setStats(createSessionStats())
    setFinished(false)
    reset()
  }

  if (finished) {
    const passed = stats.accuracy >= PASS_ACCURACY
    return (
      <PracticeComplete
        title={passed ? '過關！' : '這次還沒過關'}
        subtitle={
          passed
            ? '下一關已解鎖，可以繼續往前。'
            : `需要 ${PASS_ACCURACY}% 以上，你這次是 ${formatAccuracy(stats.accuracy)}。`
        }
        stats={{ ...stats, elapsedMs }}
        onRestart={restart}
        restartLabel="再挑戰一次"
        extraActions={
          <>
            <SecondaryNavButton to="/levels">返回關卡</SecondaryNavButton>
            {passed && numericLevel < dict.levels.length && (
              <SecondaryNavButton to={`/levels/${numericLevel + 1}`}>下一關</SecondaryNavButton>
            )}
          </>
        }
      />
    )
  }

  if (!current) return null

  const expectedLength = Math.max(current.quick.length, 1)

  return (
    <PracticeShell
      modeLabel={`第 ${numericLevel} 關`}
      exitTo="/levels"
      index={index}
      total={entries.length}
      stats={{ ...stats, elapsedMs }}
      feedback={feedback}
      highlightKeys={feedback === 'wrong' ? getHighlightKeys(current.quick) : []}
      actions={
        feedback !== 'idle' ? (
          <FeedbackActions
            tone={feedback}
            message={
              feedback === 'correct'
                ? '答對了！'
                : `正確碼 ${current.quick.toUpperCase()}（倉頡 ${current.cangjie.toUpperCase()}）`
            }
            onNext={nextQuestion}
          />
        ) : null
      }
    >
      <div
        className={`prompt-char${feedback === 'correct' ? ' prompt-char--pulse' : ''}`}
        aria-live="polite"
      >
        {current.char}
      </div>
      <CodeInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={feedback !== 'idle'}
        expectedLength={expectedLength}
        shake={feedback === 'wrong'}
      />
    </PracticeShell>
  )
}
