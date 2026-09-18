import { useCallback, useState } from 'react'

const STORAGE_KEY = 'yacomio:caregiver'

export function useCaregiver() {
  const [caregiver, setCaregiverState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  const setCaregiver = useCallback((name) => {
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      // localStorage no disponible (modo privado, etc.) — seguimos en memoria
    }
    setCaregiverState(name)
  }, [])

  const clearCaregiver = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // no-op
    }
    setCaregiverState(null)
  }, [])

  return { caregiver, setCaregiver, clearCaregiver }
}
