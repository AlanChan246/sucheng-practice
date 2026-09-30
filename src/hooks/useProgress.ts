import { useSyncExternalStore } from 'react'
import { getProgress, getStorageIssue, saveProgress, subscribeProgress, updateProgress } from '../lib/progress'

export function useProgress() {
  const progress = useSyncExternalStore(subscribeProgress, getProgress)
  return { progress, setProgress: saveProgress, updateProgress, storageIssue: getStorageIssue() }
}
