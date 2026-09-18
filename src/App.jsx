import { useState } from 'react'
import { useCaregiver } from './hooks/useCaregiver'
import { useFeedings } from './hooks/useFeedings'
import CaregiverPicker from './components/CaregiverPicker'
import StatusCard from './components/StatusCard'
import FeedButton from './components/FeedButton'
import History from './components/History'
import Stats from './components/Stats'

const TABS = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'history', label: 'Historial', icon: '📋' },
  { id: 'stats', label: 'Stats', icon: '📊' },
]

export default function App() {
  const { caregiver, setCaregiver, clearCaregiver } = useCaregiver()
  const { feedings, loading, error } = useFeedings(14)
  const [tab, setTab] = useState('home')

  if (!caregiver) {
    return <CaregiverPicker onPick={setCaregiver} />
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg pb-24">
      <header className="flex items-center justify-between px-5 pb-2 pt-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">¿Ya comió?</p>
          <h1 className="text-lg font-bold text-white">Bagel 🐶</h1>
        </div>
        <button
          onClick={clearCaregiver}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-white/60"
        >
          {caregiver}
        </button>
      </header>

      <main className="flex-1 px-5 pt-4">
        {error && (
          <p className="mb-4 rounded-xl border border-late/30 bg-late/10 px-4 py-3 text-sm text-late">
            No se pudo conectar con Supabase. Revisa tus variables de entorno.
          </p>
        )}

        {tab === 'home' && (
          <div className="space-y-5">
            <StatusCard lastFeeding={feedings[0]} />
            <FeedButton caregiver={caregiver} />
          </div>
        )}

        {tab === 'history' && (
          loading ? <LoadingState /> : <History feedings={feedings} />
        )}

        {tab === 'stats' && (
          loading ? <LoadingState /> : <Stats feedings={feedings} />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-border bg-surface/95 backdrop-blur">
        <div className="flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition ${
                tab === t.id ? 'text-pink-400' : 'text-white/40'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function LoadingState() {
  return <p className="py-12 text-center text-sm text-white/40">Cargando…</p>
}
