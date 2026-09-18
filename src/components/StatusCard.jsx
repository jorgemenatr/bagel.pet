import { useEffect, useState } from 'react'
import { feedingStatus, STATUS_STYLES } from '../lib/status'
import { hoursSince, formatTimeAgo, formatClock } from '../lib/time'

export default function StatusCard({ lastFeeding }) {
  const [, forceTick] = useState(0)

  // Re-renderiza cada minuto para que "hace X" se mantenga actualizado.
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const lastDate = lastFeeding ? new Date(lastFeeding.fed_at) : null
  const hours = lastDate ? hoursSince(lastDate) : null
  const status = feedingStatus(hours)
  const style = STATUS_STYLES[status]

  return (
    <div
      className={`rounded-3xl border border-border bg-surface p-6 ring-1 transition-shadow ${style.ring} ${style.glow}`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${style.dot} animate-pulse`} />
        <span className={`text-sm font-medium ${style.text}`}>{style.label}</span>
      </div>

      {lastDate ? (
        <>
          <p className="mt-3 text-4xl font-extrabold tracking-tight text-white">
            {formatTimeAgo(lastDate)}
          </p>
          <p className="mt-1 text-sm text-white/50">
            {lastFeeding.meal === 'desayuno' ? 'Desayuno' : 'Cena'} · {formatClock(lastDate)} ·
            registró {lastFeeding.fed_by}
          </p>
        </>
      ) : (
        <p className="mt-3 text-2xl font-bold text-white">Aún no hay registros</p>
      )}
    </div>
  )
}
