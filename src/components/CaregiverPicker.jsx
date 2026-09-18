import { CAREGIVERS } from '../lib/feedings'

export default function CaregiverPicker({ onPick }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg px-6 text-center">
      <div className="space-y-2">
        <div className="text-5xl">🐾</div>
        <h1 className="text-2xl font-bold text-white">¿Ya comió?</h1>
        <p className="text-sm text-white/60">¿Quién eres tú?</p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-4">
        {CAREGIVERS.map((name) => (
          <button
            key={name}
            onClick={() => onPick(name)}
            className="rounded-2xl border border-border bg-surface px-6 py-5 text-xl font-semibold text-white shadow-lg transition active:scale-95 active:bg-pink-500/20"
          >
            {name}
          </button>
        ))}
      </div>

      <p className="max-w-xs text-xs text-white/40">
        Solo lo elegirás una vez, se guarda en este dispositivo.
      </p>
    </div>
  )
}
