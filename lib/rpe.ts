export function percentage(reps: number, rpe: number): number {
  if (rpe > 10) rpe = 10.0
  if (reps < 1 || rpe < 4) return 0.0
  if (reps === 1 && rpe === 10.0) return 100.0
  const x = 10.0 - rpe + (reps - 1)
  if (x >= 16) return 0.0
  const intersection = 2.92
  if (x <= intersection) {
    const a = 0.347619
    const b = -4.60714
    const c = 99.9667
    return a * x * x + b * x + c
  }
  const m = -2.64249
  const b2 = 97.0955
  return m * x + b2
}

export function estimatedOneRepMax(weight: number, reps: number, rpe: number): number {
  const pct = percentage(reps, rpe)
  return weight > 0 && pct > 0 ? (weight / pct) * 100 : 0
}

export function targetWeight(oneRepMax: number, reps: number, rpe: number): number {
  return oneRepMax > 0 ? (oneRepMax / 100) * percentage(reps, rpe) : 0
}

export function isValidInput(weight: number, reps: number, rpe: number): boolean {
  return weight > 0 && Number.isInteger(reps) && reps > 0 && rpe > 0 && percentage(reps, rpe) > 0
}

export function roundToIncrement(value: number, increment: number): number {
  return Math.round(value / increment) * increment
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export const RPE_VALUES = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6]
export const QUICK_PERCENTAGES = [...Array.from({ length: 13 }, (_, i) => 60 + i * 2.5), 95, 102.5]
