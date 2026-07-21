import { useEffect, useState } from 'react'
import { DEMO_CHARS, KEYBOARD_ROWS, RADICAL_BY_KEY } from '../lib/cangjie'
import { getHighlightKeys } from '../lib/quick'

const DEMO_SEQUENCE = DEMO_CHARS.slice(0, 3)

export function InteractiveKeyboard() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [step, setStep] = useState(0)
  const demo = DEMO_SEQUENCE[activeDemo]
  const keys = demo ? getHighlightKeys(demo.quick) : []
  const visibleKeys = keys.slice(0, step)

  useEffect(() => {
    if (!demo) return
    setStep(0)
    const keyList = getHighlightKeys(demo.quick)
    const timers: number[] = []
    keyList.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), (i + 1) * 450))
    })
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [activeDemo, demo])

  const active = new Set(visibleKeys.map((k) => k.toUpperCase()))

  return (
    <div className="interactive-keyboard">
      <p className="interactive-keyboard-title">點字看拆碼</p>
      <div className="interactive-demo-chars" role="tablist">
        {DEMO_SEQUENCE.map((item, i) => (
          <button
            key={item.char}
            type="button"
            role="tab"
            aria-selected={activeDemo === i}
            className={`interactive-demo-char${activeDemo === i ? ' interactive-demo-char--active' : ''}`}
            onClick={() => setActiveDemo(i)}
          >
            {item.char}
          </button>
        ))}
      </div>
      <p className="interactive-result">
        速成 <code>{visibleKeys.join('').toLowerCase() || '…'}</code>
        {step >= keys.length && demo && (
          <span className="interactive-full">（{demo.quick.toUpperCase()}）</span>
        )}
      </p>
      <div className="keyboard-grid" role="img" aria-label="互動鍵盤示意">
        {KEYBOARD_ROWS.map((row) => (
          <div key={row.join('-')} className="keyboard-row">
            {row.map((key) => {
              const radical = RADICAL_BY_KEY[key]
              const isActive = active.has(key)
              return (
                <div key={key} className={`keycap${isActive ? ' keycap--active' : ''}`}>
                  <span className="keycap-letter">{key}</span>
                  <span className="keycap-radical">{radical?.glyph ?? ''}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
