import { useState } from 'react'
import { createFeeding, mealTypeFor } from '../lib/feedings'

export default function FeedButton({ caregiver }) {
  const [submitting, setSubmitting] = useState(false)
  const [justFed, setJustFed] = useState(false)
  const [error, setError] = useState(null)
  const [showNote, setShowNote] = useState(false)
  const [note, setNote] = useState('')

  const upcomingMeal = mealTypeFor(new Date())

  async function handleFeed() {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await createFeeding({ fedBy: caregiver, note })
      setJustFed(true)
      setNote('')
      setShowNote(false)
      setTimeout(() => setJustFed(false), 2000)
    } catch (err) {
      setError('No se pudo guardar. Revisa tu conexión e intenta de nuevo.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleFeed}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-3 rounded-3xl bg-pink-500 px-6 py-6 text-xl font-bold text-white shadow-[0_8px_30px_-6px_rgba(248,49,139,0.6)] transition active:scale-[0.98] active:bg-pink-600 disabled:opacity-60"
      >
        {justFed ? (
          <>✅ ¡Registrado!</>
        ) : submitting ? (
          <>Guardando…</>
        ) : (
          <>🍖 Ya le di de comer ({upcomingMeal})</>
        )}
      </button>

      <button
        onClick={() => setShowNote((v) => !v)}
        className="w-full text-center text-xs text-white/40 underline underline-offset-2"
      >
        {showNote ? 'Ocultar nota' : '+ agregar nota (opcional)'}
      </button>

      {showNote && (
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej. le costó comer, comió poco…"
          maxLength={200}
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-pink-500"
        />
      )}

      {error && <p className="text-center text-sm text-late">{error}</p>}
    </div>
  )
}
