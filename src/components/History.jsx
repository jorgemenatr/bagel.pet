import { formatClock, formatDay } from '../lib/time'

export default function History({ feedings }) {
  if (feedings.length === 0) {
    return <p className="py-8 text-center text-sm text-white/40">Todavía no hay comidas registradas.</p>
  }

  const groups = groupByDay(feedings)

  return (
    <div className="space-y-6">
      {groups.map(([dayLabel, items]) => (
        <div key={dayLabel}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            {dayLabel}
          </h3>
          <ul className="space-y-2">
            {items.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{f.meal === 'desayuno' ? '🌅' : '🌙'}</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {f.meal === 'desayuno' ? 'Desayuno' : 'Cena'}
                    </p>
                    {f.note && <p className="text-xs text-white/40">{f.note}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatClock(new Date(f.fed_at))}</p>
                  <p className="text-xs text-pink-400">{f.fed_by}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function groupByDay(feedings) {
  const map = new Map()
  for (const f of feedings) {
    const label = formatDay(new Date(f.fed_at))
    if (!map.has(label)) map.set(label, [])
    map.get(label).push(f)
  }
  return Array.from(map.entries())
}
