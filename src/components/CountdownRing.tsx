interface CountdownRingProps {
  durationMs: number
  active: boolean
}

export function CountdownRing({ durationMs, active }: CountdownRingProps) {
  const radius = 36
  const circumference = 2 * Math.PI * radius

  return (
    <div className="countdown-ring" aria-hidden="true">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle
          className="countdown-ring-track"
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth="4"
        />
        <circle
          className={`countdown-ring-progress${active ? ' countdown-ring-progress--active' : ''}`}
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset="0"
          style={{ ['--ring-duration' as string]: `${durationMs}ms` }}
        />
      </svg>
      <span className="countdown-ring-label">記住</span>
    </div>
  )
}
