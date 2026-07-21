import { useEffect, useRef } from 'react'
import { useAdvanceOnKey } from '../hooks/useAdvanceOnKey'

interface FeedbackActionsProps {
  message: string
  tone: 'correct' | 'wrong'
  onNext: () => void
}

export function FeedbackActions({ message, tone, onNext }: FeedbackActionsProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useAdvanceOnKey(true, onNext)

  useEffect(() => {
    buttonRef.current?.focus()
  }, [message])

  return (
    <div className={`feedback feedback-${tone}`}>
      <p>{message}</p>
      <p className="feedback-hint">按 Enter 繼續</p>
      <button ref={buttonRef} type="button" className="btn btn-primary" onClick={onNext}>
        下一題
      </button>
    </div>
  )
}
