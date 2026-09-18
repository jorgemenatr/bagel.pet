import { useEffect, useState, useCallback } from 'react'
import { fetchRecentFeedings, subscribeToFeedings } from '../lib/feedings'

export function useFeedings(days = 14) {
  const [feedings, setFeedings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    try {
      const data = await fetchRecentFeedings(days)
      setFeedings(data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    const unsubscribe = subscribeToFeedings((payload) => {
      setFeedings((current) => {
        if (payload.eventType === 'INSERT') {
          if (current.some((f) => f.id === payload.new.id)) return current
          return [payload.new, ...current].sort(
            (a, b) => new Date(b.fed_at) - new Date(a.fed_at)
          )
        }
        if (payload.eventType === 'UPDATE') {
          return current.map((f) => (f.id === payload.new.id ? payload.new : f))
        }
        if (payload.eventType === 'DELETE') {
          return current.filter((f) => f.id !== payload.old.id)
        }
        return current
      })
    })

    return unsubscribe
  }, [])

  return { feedings, loading, error, reload }
}
