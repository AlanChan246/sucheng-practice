import { useEffect, useState } from 'react'
import { DEMO_CHARS } from '../lib/cangjie'
import { getHighlightKeys } from '../lib/quick'
import { KeyboardHighlight } from './KeyboardHighlight'

export function DemoSteps() {
  const [demoIndex, setDemoIndex] = useState(0)
  const [step, setStep] = useState(0)
  const current = DEMO_CHARS[demoIndex]
  const keys = getHighlightKeys(current.quick)

  useEffect(() => {
    setStep(0)
    const keyList = getHighlightKeys(current.quick)
    const timers: number[] = []
    keyList.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), (i + 1) * 600))
    })
    timers.push(
      window.setTimeout(() => {
        setDemoIndex((i) => (i + 1) % DEMO_CHARS.length)
      }, (keyList.length + 1) * 600),
    )
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [demoIndex, current.quick])

  const highlight = keys.slice(0, step)

  return (
    <div className="demo-steps">
      <div className="demo-steps-char">{current.char}</div>
      <div className="demo-steps-flow">
        <span className={step >= 1 ? 'demo-steps-key demo-steps-key--on' : 'demo-steps-key'}>
          {keys[0] ?? '?'}
        </span>
        {keys.length > 1 && (
          <>
            <span className="demo-steps-plus">+</span>
            <span className={step >= 2 ? 'demo-steps-key demo-steps-key--on' : 'demo-steps-key'}>
              {keys[1] ?? '?'}
            </span>
          </>
        )}
        <span className="demo-steps-arrow">→</span>
        <span className={step >= keys.length ? 'demo-steps-key demo-steps-key--on' : 'demo-steps-key'}>
          {current.quick.toUpperCase()}
        </span>
      </div>
      <p className="demo-steps-note">{current.note}</p>
      <KeyboardHighlight highlightKeys={highlight} compact />
    </div>
  )
}
