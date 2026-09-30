import { Delete } from 'lucide-react'
import { KEYBOARD_ROWS, RADICAL_BY_KEY } from '../lib/cangjie'

interface Props {
  onKey: (key: string) => void
  onDelete?: () => void
  value?: string
  highlight?: string
  keys?: string[]
  disabled?: boolean
  label?: string
}
export function Keyboard({ onKey, onDelete, value = '', highlight = '', keys, disabled = false, label = '字根鍵盤' }: Props) {
  const rows = keys ? [keys] : KEYBOARD_ROWS
  return <div className={`typing-keyboard ${keys ? 'typing-keyboard--small' : ''}`} role="group" aria-label={label}>
    {rows.map((row, i) => <div className="key-row" key={i}>{row.map(key => <button
      type="button" key={key} className={`keycap ${value.toUpperCase().includes(key) ? 'is-pressed' : ''} ${highlight.toUpperCase().includes(key) ? 'is-answer' : ''}`}
      disabled={disabled} onClick={() => onKey(key.toLowerCase())} aria-label={`${key} ${RADICAL_BY_KEY[key]?.name}`}>
      <span className="key-letter">{key}</span><span className="key-root">{RADICAL_BY_KEY[key]?.name}</span>
      {highlight.toUpperCase().includes(key) && <span className="key-answer-dot" aria-hidden="true" />}
    </button>)}</div>)}
    {onDelete && <button type="button" className="key-delete" onClick={onDelete} disabled={disabled} aria-label="刪除最後一碼"><Delete size={19} aria-hidden="true" /><span>刪除</span></button>}
  </div>
}
