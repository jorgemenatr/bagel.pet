import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { computeMealStats, computeDailyTimeline, computeStreak } from '../lib/stats'

export default function Stats({ feedings }) {
  const mealStats = computeMealStats(feedings)
  const timeline = computeDailyTimeline(feedings, 14)
  const streak = computeStreak(feedings)

  const desayunoPoints = timeline
    .filter((d) => d.desayuno != null)
    .map((d) => ({ x: d.date, y: d.desayuno }))
  const cenaPoints = timeline
    .filter((d) => d.cena != null)
    .map((d) => ({ x: d.date, y: d.cena }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard emoji="🌅" label="Desayuno promedio" value={mealStats.desayuno.avgLabel} />
        <MetricCard emoji="🌙" label="Cena promedio" value={mealStats.cena.avgLabel} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Racha actual</p>
          <span className="text-2xl">🔥</span>
        </div>
        <p className="mt-1 text-3xl font-extrabold text-pink-400">
          {streak} día{streak === 1 ? '' : 's'}
        </p>
        <p className="mt-1 text-xs text-white/40">
          Días consecutivos con desayuno y cena registrados
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="mb-1 text-sm font-semibold text-white">Consistencia de horarios</p>
        <p className="mb-3 text-xs text-white/40">Últimos 14 días · entre más agrupados, más consistente</p>

        {timeline.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">Aún no hay suficientes datos.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke="#2a2a38" strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="category"
                tick={{ fill: '#ffffff66', fontSize: 10 }}
                tickFormatter={(d) => d.slice(5)}
                axisLine={{ stroke: '#2a2a38' }}
                tickLine={false}
              />
              <YAxis
                dataKey="y"
                type="number"
                domain={[0, 24]}
                ticks={[0, 6, 12, 18, 24]}
                tickFormatter={(h) => `${h}h`}
                tick={{ fill: '#ffffff66', fontSize: 10 }}
                axisLine={{ stroke: '#2a2a38' }}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: '#1e1e29',
                  border: '1px solid #2a2a38',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#ffffff99' }}
                formatter={(value) => `${Math.floor(value)}:${String(Math.round((value % 1) * 60)).padStart(2, '0')}`}
              />
              <Scatter name="Desayuno" data={desayunoPoints} fill="#ff5ba3" />
              <Scatter name="Cena" data={cenaPoints} fill="#7c1344" />
            </ScatterChart>
          </ResponsiveContainer>
        )}

        <div className="mt-2 flex gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: '#ff5ba3' }} /> Desayuno
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: '#7c1344' }} /> Cena
          </span>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ emoji, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-lg">{emoji}</div>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  )
}
