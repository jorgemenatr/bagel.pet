import { supabase } from './supabase'

export const CAREGIVERS = ['Jorge', 'Brenda']

/** Antes de las 12:00pm = desayuno, de ahí en adelante = cena. */
export function mealTypeFor(date) {
  return date.getHours() < 12 ? 'desayuno' : 'cena'
}

export async function fetchRecentFeedings(days = 14) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('feedings')
    .select('*')
    .gte('fed_at', since.toISOString())
    .order('fed_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createFeeding({ fedBy, note }) {
  const now = new Date()
  const { data, error } = await supabase
    .from('feedings')
    .insert({
      fed_by: fedBy,
      meal: mealTypeFor(now),
      note: note?.trim() ? note.trim() : null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export function subscribeToFeedings(onChange) {
  const channel = supabase
    .channel('feedings-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'feedings' },
      (payload) => onChange(payload)
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
