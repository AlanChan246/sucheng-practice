import { useEffect, useMemo, useState } from 'react'
import { CharOptions } from '../components/CharOptions'
import { FeedbackActions } from '../components/FeedbackActions'
import { LoadingError, LoadingSkeleton } from '../components/LoadingSkeleton'
import { PracticeComplete, PracticeShell } from '../components/PracticeShell'
import { SecondaryNavButton } from '../components/SecondaryNavButton'
import { useDictionary } from '../hooks/useDictionary'
import { useProgress } from '../hooks/useProgress'
import { useTimer } from '../hooks/useTimer'
import { loadProgress, recordModeSession } from '../lib/progress'
import { pickDistractors, shuffle } from '../lib/shuffle'
import { createSessionStats, updateSessionStats } from '../lib/stats'
import type { DictEntry } from '../types'

const ROUND_SIZE = 10
const OPTION_COUNT = 4

function buildRound(entries: DictEntry[]) {
  return shuffle(entries).slice(0, ROUND_SIZE)
}

export function CodeToCharPage() {
  const { dict, loading, error } = useDictionary()
  const { setProgress } = useProgress()
  const [round, setRound] = useState<DictEntry[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [stats, setStats] = useState(createSessionStats)
  const [finished, setFinished] = useState(false)
  const active = !finished && round.length > 0
  const { elapsedMs, reset } = useTimer(active)

  const current = round[index]

  const options = useMemo(() => {
    if (!current || !dict) return []
    const distractors = pickDistractors(
      dict.entries,
      current,
      OPTION_COUNT - 1,
      (entry) => entry.id,
    )
    return shuffle([current, ...distractors]).map((entry) => entry.char)
  }, [current, dict])

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

  const handlePick = (char: string) => {
    if (!current || selected) return
    setSelected(char)
    const correct = char === current.char
    setStats((prev) => updateSessionStats({ ...prev, elapsedMs }, correct))
  }

  const nextQuestion = () => {
    if (index + 1 >= round.length) {
      const finalStats = { ...stats, elapsedMs }
      setProgress(
        recordModeSession(
          loadProgress(),
          'code-to-char',
          finalStats.correct,
          finalStats.wrong,
          finalStats.elapsedMs,
        ),
      )
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
  }

  const restart = () => {
    setRound(buildRound(dict.entries))
    setIndex(0)
    setSelected(null)
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

  const isCorrect = selected === current.char
  const feedback = selected ? (isCorrect ? 'correct' : 'wrong') : 'idle'

  return (
    <PracticeShell
      modeLabel="看碼選字"
      exitTo="/practice"
      index={index}
      total={round.length}
      stats={{ ...stats, elapsedMs }}
      feedback={feedback}
      actions={
        selected ? (
          <FeedbackActions
            tone={isCorrect ? 'correct' : 'wrong'}
            message={
              isCorrect
                ? '答對了！'
                : `正確答案是 ${current.char}（倉頡 ${current.cangjie.toUpperCase()}）`
            }
            onNext={nextQuestion}
          />
        ) : null
      }
    >
      <div className={`prompt-code${isCorrect ? ' prompt-char--pulse' : ''}`} aria-live="polite">
        {current.quick.toUpperCase()}
      </div>
      <CharOptions
        options={options}
        selected={selected}
        reveal={Boolean(selected)}
        disabled={Boolean(selected)}
        onPick={handlePick}
      />
    </PracticeShell>
  )
}
