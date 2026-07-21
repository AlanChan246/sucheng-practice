import { useEffect, useRef } from 'react'
import { normalizeQuick } from '../lib/quick'

interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  autoFocus?: boolean
  placeholder?: string
  expectedLength?: number
  shake?: boolean
}

export function CodeInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  placeholder = '輸入速成碼',
  expectedLength = 2,
  shake = false,
}: CodeInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  const submittedRef = useRef('')

  useEffect(() => {
    if (autoFocus && !disabled) ref.current?.focus()
  }, [autoFocus, disabled])

  useEffect(() => {
    if (!value) submittedRef.current = ''
  }, [value])

  useEffect(() => {
    if (disabled || value.length < expectedLength) return
    if (submittedRef.current === value) return
    submittedRef.current = value
    onSubmit()
  }, [value, expectedLength, disabled, onSubmit])

  return (
    <input
      ref={ref}
      className={`code-input${shake ? ' code-input--shake' : ''}`}
      type="text"
      inputMode="text"
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      maxLength={expectedLength}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(event) => onChange(normalizeQuick(event.target.value))}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onSubmit()
        }
      }}
    />
  )
}
