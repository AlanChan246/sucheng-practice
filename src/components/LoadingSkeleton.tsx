import { KEYBOARD_ROWS } from '../lib/cangjie'

export function LoadingSkeleton({ label = '載入中…' }: { label?: string }) {
  return (
    <div className="loading-skeleton" role="status" aria-live="polite">
      <p className="loading-skeleton-label">{label}</p>
      <div className="keyboard-grid keyboard-grid--skeleton" aria-hidden="true">
        {KEYBOARD_ROWS.map((row) => (
          <div key={row.join('-')} className="keyboard-row">
            {row.map((key) => (
              <div key={key} className="keycap keycap--skeleton" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoadingError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="loading-error panel" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          重試
        </button>
      )}
    </div>
  )
}
