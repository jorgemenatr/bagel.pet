// Umbrales en horas desde la última comida. Con dos comidas al día
// (desayuno / cena) lo normal es un intervalo de ~8-12h entre ellas.
export const STATUS_THRESHOLDS = {
  ok: 6, // menos de 6h: todo tranquilo
  warn: 9, // entre 6h y 9h: se acerca la hora
  // más de 9h: ya se pasó del horario esperado
}

export function feedingStatus(hoursSinceLastFeeding) {
  if (hoursSinceLastFeeding == null) return 'unknown'
  if (hoursSinceLastFeeding < STATUS_THRESHOLDS.ok) return 'ok'
  if (hoursSinceLastFeeding < STATUS_THRESHOLDS.warn) return 'warn'
  return 'late'
}

export const STATUS_STYLES = {
  ok: {
    label: 'Recién comió',
    ring: 'ring-ok/40',
    dot: 'bg-ok',
    text: 'text-ok',
    glow: 'shadow-[0_0_60px_-15px_rgba(52,211,153,0.5)]',
  },
  warn: {
    label: 'Se acerca la hora',
    ring: 'ring-warn/40',
    dot: 'bg-warn',
    text: 'text-warn',
    glow: 'shadow-[0_0_60px_-15px_rgba(251,191,36,0.5)]',
  },
  late: {
    label: 'Ya se pasó del horario',
    ring: 'ring-late/40',
    dot: 'bg-late',
    text: 'text-late',
    glow: 'shadow-[0_0_60px_-15px_rgba(251,113,133,0.5)]',
  },
  unknown: {
    label: 'Sin registros aún',
    ring: 'ring-white/20',
    dot: 'bg-white/40',
    text: 'text-white/60',
    glow: '',
  },
}
