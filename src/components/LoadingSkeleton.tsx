export function LoadingSkeleton({ label = '準備中…' }: { label?: string }) {
  return <div className="loading-skeleton" role="status" aria-live="polite"><p className="loading-skeleton-label">{label}</p><div className="loading-key-pair" aria-hidden="true"><span /><span /></div></div>
}
export function LoadingError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="loading-error" role="alert"><h1>差一步，暫時載入不到。</h1><p>{message}</p>{onRetry && <button type="button" className="button button-primary" onClick={onRetry}>再試一次</button>}</div>
}
