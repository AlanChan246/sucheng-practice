import { useEffect, useRef, useState } from 'react'

export function useTimer(active: boolean) {
  const startRef = useRef<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (!active) return
    startRef.current = Date.now()
    const id = window.setInterval(() => {
      if (startRef.current) {
        setElapsedMs(Date.now() - startRef.current)
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [active])

  const reset = () => {
    startRef.current = Date.now()
    setElapsedMs(0)
  }

  return { elapsedMs, reset }
}
