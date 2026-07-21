import { KEYBOARD_ROWS, RADICAL_BY_KEY } from '../lib/cangjie'

interface KeyboardHighlightProps {
  highlightKeys?: string[]
  compact?: boolean
}

export function KeyboardHighlight({
  highlightKeys = [],
  compact = false,
}: KeyboardHighlightProps) {
  const active = new Set(highlightKeys.map((k) => k.toUpperCase()))

  return (
    <div className={`keyboard-panel${compact ? ' keyboard-panel--compact' : ''}`}>
      <p className="keyboard-label">鍵位對照</p>
      <div className="keyboard-grid" role="img" aria-label="倉頡鍵盤示意">
        {KEYBOARD_ROWS.map((row) => (
          <div key={row.join('-')} className="keyboard-row">
            {row.map((key) => {
              const radical = RADICAL_BY_KEY[key]
              const isActive = active.has(key)
              return (
                <div
                  key={key}
                  className={`keycap${isActive ? ' keycap--active' : ''}`}
                >
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
