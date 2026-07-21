import { type ReactNode } from 'react'
import { hardNavigate } from '../lib/navigation'

interface SecondaryNavButtonProps {
  to: string
  children: ReactNode
}

export function SecondaryNavButton({ to, children }: SecondaryNavButtonProps) {
  return (
    <button type="button" className="btn btn-secondary" onClick={() => hardNavigate(to)}>
      {children}
    </button>
  )
}
