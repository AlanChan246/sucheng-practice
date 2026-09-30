import { useEffect, useRef, useState } from 'react'
import { normalizeQuick } from '../lib/quick'
import { CornerDownLeft } from 'lucide-react'

export function AnswerInput({ value, onChange, onSubmit, length, disabled = false, invalid = false, feedbackId, hint }: { value: string; onChange: (v: string) => void; onSubmit: () => void; length: number; disabled?: boolean; invalid?: boolean; feedbackId?: string; hint?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const sent = useRef(false)
  const [systemKeyboard, setSystemKeyboard] = useState(false)
  useEffect(() => { if (systemKeyboard) ref.current?.focus() }, [systemKeyboard])
  useEffect(() => { if (!disabled && !window.matchMedia('(pointer: coarse)').matches) ref.current?.focus() }, [disabled])
  useEffect(() => {
    if (!value) sent.current = false
    if (!disabled && value.length === length && !sent.current) { sent.current = true; onSubmit() }
  }, [disabled, length, onSubmit, value])
  return <div className="answer-area">
    <label htmlFor="answer-code">{length === 1 ? '一個字根，按一鍵' : '輸入首碼、尾碼'}</label>
    <div className="answer-control"><input ref={ref} id="answer-code" className="answer-input" value={value.toUpperCase()} readOnly={disabled} maxLength={length}
      inputMode={systemKeyboard ? 'text' : 'none'} autoComplete="off" autoCapitalize="characters" spellCheck={false} aria-invalid={invalid || undefined} aria-describedby={['answer-hint', feedbackId].filter(Boolean).join(' ')}
      placeholder={hint ?? (length === 1 ? '—' : '— —')} onChange={e => onChange(normalizeQuick(e.target.value).slice(0, length))}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (!disabled && value) onSubmit() } }} />
      <button type="button" className="submit-key" disabled={disabled || !value} onClick={onSubmit} aria-label="送出答案"><CornerDownLeft size={22} aria-hidden="true" /></button>
    </div>
    <p id="answer-hint" className="input-hint">滿 {length} 碼即作答；Enter 亦可送出。</p>
    <button type="button" className="text-button system-keyboard-toggle" onClick={() => setSystemKeyboard(v => !v)}>{systemKeyboard ? '使用下方字根鍵盤' : '使用裝置鍵盤'}</button>
  </div>
}
