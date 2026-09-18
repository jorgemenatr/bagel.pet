export function hoursSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60)
}

export function formatTimeAgo(date) {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)

  if (minutes < 1) return 'justo ahora'
  if (minutes < 60) return `hace ${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remMinutes = minutes % 60
  if (hours < 24) {
    return remMinutes > 0 ? `hace ${hours}h ${remMinutes}min` : `hace ${hours}h`
  }

  const days = Math.floor(hours / 24)
  return `hace ${days} día${days === 1 ? '' : 's'}`
}

export function formatClock(date) {
  return date.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })
}

export function formatDay(date) {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return 'Hoy'
  if (isSameDay(date, yesterday)) return 'Ayer'

  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
}
