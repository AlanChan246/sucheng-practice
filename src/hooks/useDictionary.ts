import { useEffect, useState } from 'react'
import type { Dictionary } from '../types'

let cached: Dictionary | null = null

export function useDictionary() {
  const [dict, setDict] = useState<Dictionary | null>(cached)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    if (cached) return

    fetch(`${(import.meta.env?.BASE_URL ?? '/sucheng-practice/')}sucheng-dict.json`)
      .then((res) => {
        if (!res.ok) throw new Error('無法載入字庫')
        return res.json()
      })
      .then((data: Dictionary) => {
        if (!Array.isArray(data.entries) || !data.entries.length || !Array.isArray(data.levels) || data.entries.some(e => !e.char || !e.quick || !e.cangjie || !Number.isInteger(e.id))) throw new Error('字庫資料不完整，請重新載入。')
        cached = data
        setDict(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { dict, loading, error }
}

export function entryById(dict: Dictionary, id: number) {
  return dict.entries.find((entry) => entry.id === id)
}

export function entriesForLevel(dict: Dictionary, levelId: number) {
  const level = dict.levels.find((item) => item.id === levelId)
  if (!level) return []
  return level.charIds
    .map((id) => entryById(dict, id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
}
