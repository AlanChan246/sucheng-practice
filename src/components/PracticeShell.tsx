import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { KeyboardHighlight } from './KeyboardHighlight'
import { formatAccuracy, formatDuration } from '../lib/stats'
import type { SessionStats } from '../types'

export type FeedbackState = 'idle' | 'correct' | 'wrong' | null

interface PracticeShellProps {
  modeLabel: string
  index: number
  total: number
  stats: SessionStats
  feedback?: FeedbackState
  highlightKeys?: string[]
  alwaysShowKeyboard?: boolean
  exitTo?: string
  exitLabel?: string
  children: ReactNode
  actions?: ReactNode
}

export function PracticeShell({
  modeLabel,
  index,
  total,
  stats,
  feedback = 'idle',
  highlightKeys = [],
  alwaysShowKeyboard = true,
  exitTo,
  exitLabel = '離開',
  children,
  actions,
}: PracticeShellProps) {
  const [statsOpen, setStatsOpen] = useState(false)
  const progress = total ? ((index + (feedback !== 'idle' ? 1 : 0)) / total) * 100 : 0
  const activeKeys = feedback === 'wrong' ? highlightKeys : []

  return (
    <div
      className={`practice-shell${feedback === 'correct' ? ' practice-shell--correct' : ''}${feedback === 'wrong' ? ' practice-shell--wrong' : ''}`}
    >
      <div className="practice-topbar">
        {exitTo ? (
          <Link to={exitTo} className="practice-exit">
            {exitLabel}
          </Link>
        ) : (
          <span />
        )}
        <span className="practice-mode">{modeLabel}</span>
        <span className="practice-counter">
          {index + 1} / {total}
        </span>
      </div>

      <div
        className="practice-progress"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="practice-progress-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <section className="practice-stage">{children}</section>

      {actions}

      {alwaysShowKeyboard && (
        <div className="practice-keyboard">
          <KeyboardHighlight highlightKeys={activeKeys} compact />
        </div>
      )}

      <footer className="practice-footer">
        <button
          type="button"
          className="practice-stats-toggle"
          onClick={() => setStatsOpen((open) => !open)}
          aria-expanded={statsOpen}
        >
          <span>{stats.correct} 對</span>
          <span>{stats.wrong} 錯</span>
          <span>{formatDuration(stats.elapsedMs)}</span>
          <span>{formatAccuracy(stats.accuracy)}</span>
        </button>
        {statsOpen && (
          <div className="practice-stats-detail">
            <div>
              <span>正確</span>
              <strong>{stats.correct}</strong>
            </div>
            <div>
              <span>錯誤</span>
              <strong>{stats.wrong}</strong>
            </div>
            <div>
              <span>用時</span>
              <strong>{formatDuration(stats.elapsedMs)}</strong>
            </div>
            <div>
              <span>準確率</span>
              <strong>{formatAccuracy(stats.accuracy)}</strong>
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}

interface PracticeCompleteProps {
  title: string
  subtitle?: string
  stats: SessionStats
  onRestart: () => void
  restartLabel?: string
  extraActions?: ReactNode
}

export function PracticeComplete({
  title,
  subtitle,
  stats,
  onRestart,
  restartLabel = '再練一輪',
  extraActions,
}: PracticeCompleteProps) {
  return (
    <div className="page-stack practice-complete">
      <header className="page-header page-header--center">
        <h1>{title}</h1>
        {subtitle && <p className="lede">{subtitle}</p>}
      </header>
      <div className="practice-stats-detail practice-stats-detail--open">
        <div>
          <span>正確</span>
          <strong>{stats.correct}</strong>
        </div>
        <div>
          <span>錯誤</span>
          <strong>{stats.wrong}</strong>
        </div>
        <div>
          <span>用時</span>
          <strong>{formatDuration(stats.elapsedMs)}</strong>
        </div>
        <div>
          <span>準確率</span>
          <strong>{formatAccuracy(stats.accuracy)}</strong>
        </div>
      </div>
      <div className="hero-actions hero-actions--center">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          {restartLabel}
        </button>
        {extraActions}
      </div>
    </div>
  )
}
