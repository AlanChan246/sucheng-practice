import { useEffect, useState } from 'react'
import { CodeInput } from '../components/CodeInput'
import { FeedbackActions } from '../components/FeedbackActions'
import { LoadingError, LoadingSkeleton } from '../components/LoadingSkeleton'
import { PracticeComplete, PracticeShell } from '../components/PracticeShell'
import { SecondaryNavButton } from '../components/SecondaryNavButton'
import { useDictionary } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { useTimer } from '../hooks/useTimer'
import { loadProgress, recordModeSession } from '../lib/progress'
import { getHighlightKeys, isQuickMatch } from '../lib/quick'
import { shuffle } from '../lib/shuffle'
import { createSessionStats, updateSessionStats } from '../lib/stats'
import type { DictEntry } from '../types'

const ROUND_SIZE = 10

function buildRound(entries: DictEntry[]) {
  return shuffle(entries).slice(0, ROUND_SIZE)
}

export function CharToCodePage() {
  const { dict, loading, error } = useDictionary()
  const { setProgress } = useProgress()
  const [round, setRound] = useState<DictEntry[]>([])
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [stats, setStats] = useState(createSessionStats)
  const [finished, setFinished] = useState(false)
  const active = !finished && round.length > 0
  const { elapsedMs, reset } = useTimer(active)

  const current = round[index]

  useEffect(() => {
    if (dict && !round.length) {
      setRound(buildRound(dict.entries))
      reset()
    }
  }, [dict, round.length, reset])

  if (loading) return <LoadingSkeleton label="載入字庫中…" />
  if (error || !dict) {
    return (
      <LoadingError
        message={error ?? '字庫載入失敗'}
        onRetry={() => window.location.reload()}
      />
    )
  }

  const handleSubmit = () => {
    if (!current || finished || feedback !== 'idle') return
    const correct = isQuickMatch(input, current.quick)
    setFeedback(correct ? 'correct' : 'wrong')
    setStats((prev) => updateSessionStats({ ...prev, elapsedMs }, correct))
  }

  const nextQuestion = () => {
    if (index + 1 >= round.length) {
      const finalStats = { ...stats, elapsedMs }
      setProgress(
        recordModeSession(
          loadProgress(),
          'char-to-code',
          finalStats.correct,
          finalStats.wrong,
          finalStats.elapsedMs,
        ),
      )
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setInput('')
    setFeedback('idle')
  }

  const restart = () => {
    setRound(buildRound(dict.entries))
    setIndex(0)
    setInput('')
    setFeedback('idle')
    setStats(createSessionStats())
    setFinished(false)
    reset()
  }

  if (finished) {
    return (
      <PracticeComplete
        title="本輪完成"
        stats={{ ...stats, elapsedMs }}
        onRestart={restart}
        extraActions={<SecondaryNavButton to="/practice">換模式</SecondaryNavButton>}
      />
    )
  }

  if (!current) return null

  const sessionStats = { ...stats, elapsedMs }
  const expectedLength = Math.max(current.quick.length, 1)

  return (
    <PracticeShell
      modeLabel="看字打碼"
      exitTo="/practice"
      index={index}
      total={round.length}
      stats={sessionStats}
      feedback={feedback}
      highlightKeys={feedback === 'wrong' ? getHighlightKeys(current.quick) : []}
      actions={
        feedback !== 'idle' ? (
          <FeedbackActions
            tone={feedback}
            message={
              feedback === 'correct'
                ? `答對了！速成碼 ${current.quick.toUpperCase()}`
                : `${current.char} → ${current.quick.toUpperCase()}（倉頡 ${current.cangjie.toUpperCase()}）`
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
