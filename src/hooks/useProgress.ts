import { useEffect, useState } from 'react'
import { loadProgress } from '../lib/progress'
import type { AppProgress } from '../types'

export function useProgress() {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress())

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'sucheng-practice-progress') {
        setProgress(loadProgress())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { progress, setProgress }
}
