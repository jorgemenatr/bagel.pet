function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes()
}

function localDayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60) % 24
  const m = Math.round(minutes % 60)
  const period = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

function mean(values) {
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

function stdDev(values) {
  if (values.length < 2) return 0
  const m = mean(values)
  const variance = mean(values.map((v) => (v - m) ** 2))
  return Math.sqrt(variance)
}

/** Hora promedio de desayuno/cena, y qué tan dispersos han sido los horarios. */
export function computeMealStats(feedings) {
  const byMeal = { desayuno: [], cena: [] }
  for (const f of feedings) {
    byMeal[f.meal]?.push(minutesSinceMidnight(new Date(f.fed_at)))
  }

  return {
    desayuno: {
      count: byMeal.desayuno.length,
      avgLabel: byMeal.desayuno.length ? formatMinutes(mean(byMeal.desayuno)) : '—',
      stdDevMinutes: Math.round(stdDev(byMeal.desayuno)),
    },
    cena: {
      count: byMeal.cena.length,
      avgLabel: byMeal.cena.length ? formatMinutes(mean(byMeal.cena)) : '—',
      stdDevMinutes: Math.round(stdDev(byMeal.cena)),
    },
  }
}

/** Una fila por día con la hora (en horas decimales) de desayuno y cena, para graficar. */
export function computeDailyTimeline(feedings, days = 14) {
  const byDay = new Map()

  for (const f of feedings) {
    const date = new Date(f.fed_at)
    const key = localDayKey(date)
    if (!byDay.has(key)) byDay.set(key, { date: key, desayuno: null, cena: null })
    const entry = byDay.get(key)
    const hourDecimal = date.getHours() + date.getMinutes() / 60
    entry[f.meal] = hourDecimal
  }

  const sorted = Array.from(byDay.values()).sort((a, b) => (a.date < b.date ? -1 : 1))
  return sorted.slice(-days)
}

/**
 * Racha de días consecutivos (terminando hoy o ayer) en los que Bagel
 * comió tanto desayuno como cena.
 */
export function computeStreak(feedings) {
  const daysWithBothMeals = new Set()
  const byDay = new Map()

  for (const f of feedings) {
    const key = localDayKey(new Date(f.fed_at))
    if (!byDay.has(key)) byDay.set(key, new Set())
    byDay.get(key).add(f.meal)
  }

  for (const [day, meals] of byDay.entries()) {
    if (meals.has('desayuno') && meals.has('cena')) daysWithBothMeals.add(day)
  }

  let streak = 0
  const cursor = new Date()
  // Si hoy todavía no tiene ambas comidas, no rompe la racha: solo no cuenta hoy.
  if (!daysWithBothMeals.has(localDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (daysWithBothMeals.has(localDayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
