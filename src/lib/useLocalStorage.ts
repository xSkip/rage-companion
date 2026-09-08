import { useEffect, useState } from 'react'

/**
 * Same API as useState, but the value is persisted to localStorage under
 * `key` and restored on next load. Fails silently if storage is
 * unavailable (private browsing, quota exceeded) - the app keeps working
 * with in-memory state only in that case.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage unavailable - ignore, in-memory state still works for this session
    }
  }, [key, value])

  return [value, setValue] as const
}
