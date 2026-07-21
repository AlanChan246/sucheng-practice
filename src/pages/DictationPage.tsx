import { useEffect, useState } from 'react'
import { CodeInput } from '../components/CodeInput'
import { CountdownRing } from '../components/CountdownRing'
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
const REVEAL_MS = 1800

function buildRound(entries: DictEntry[]) {
  return shuffle(entries).slice(0, ROUND_SIZE)
}

export function DictationPage() {
  const { dict, loading, error } = useDictionary()
  const { setProgress } = useProgress()
  const [round, setRound] = useState<DictEntry[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'reveal' | 'input' | 'result'>('reveal')
  const [input, setInput] = useState('')
  const [wasCorrect, setWasCorrect] = useState(false)
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

  useEffect(() => {
    if (phase !== 'reveal' || !current) return
    const timer = window.setTimeout(() => setPhase('input'), REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [phase, current, index])

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
    if (!current || phase !== 'input') return
    const correct = isQuickMatch(input, current.quick)
    setWasCorrect(correct)
    setStats((prev) => updateSessionStats({ ...prev, elapsedMs }, correct))
    setPhase('result')
  }

  const nextQuestion = () => {
    if (index + 1 >= round.length) {
      const finalStats = { ...stats, elapsedMs }
      setProgress(
        recordModeSession(
          loadProgress(),
          'dictation',
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
    setWasCorrect(false)
    setPhase('reveal')
  }

  const restart = () => {
    setRound(buildRound(dict.entries))
    setIndex(0)
    setInput('')
    setWasCorrect(false)
    setPhase('reveal')
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

  const feedback = phase === 'result' ? (wasCorrect ? 'correct' : 'wrong') : 'idle'
  const expectedLength = Math.max(current.quick.length, 1)

  return (
    <PracticeShell
      modeLabel="默寫模式"
      exitTo="/practice"
      index={index}
      total={round.length}
      stats={{ ...stats, elapsedMs }}
      feedback={feedback}
      highlightKeys={phase === 'result' && !wasCorrect ? getHighlightKeys(current.quick) : []}
      actions={
        phase === 'result' ? (
          <FeedbackActions
            tone={wasCorrect ? 'correct' : 'wrong'}
            message={
              wasCorrect
                ? `答對了！速成碼 ${current.quick.toUpperCase()}`
                : `正確答案是 ${current.quick.toUpperCase()}（倉頡 ${current.cangjie.toUpperCase()}）`
            }
            onNext={nextQuestion}
          />
        ) : null
      }
    >
      {phase === 'reveal' && (
        <>
          <CountdownRing durationMs={REVEAL_MS} active />
          <div className="prompt-char prompt-char--flash">{current.char}</div>
        </>
      )}

      {phase === 'input' && (
        <>
          <div className="prompt-char prompt-char--blurred" aria-hidden="true">
            ？
          </div>
          <CodeInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            expectedLength={expectedLength}
          />
        </>
      )}

      {phase === 'result' && (
        <div className={`prompt-char${wasCorrect ? ' prompt-char--pulse' : ''}`}>
          {current.char}
        </div>
      )}
    </PracticeShell>
  )
}
