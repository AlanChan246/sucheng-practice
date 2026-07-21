import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface SecondaryNavButtonProps {
  to: string
  children: ReactNode
}

export function SecondaryNavButton({ to, children }: SecondaryNavButtonProps) {
  const navigate = useNavigate()

  return (
    <button type="button" className="btn btn-secondary" onClick={() => navigate(to)}>
      {children}
    </button>
  )
}
