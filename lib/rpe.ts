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
  const percent = percentage(reps, rpe)
  return percent > 0 ? (weight / percent) * 100 : 0
}

export function targetWeight(oneRepMax: number, reps: number, rpe: number): number {
  return (oneRepMax / 100) * percentage(reps, rpe)
}

export function isValidInput(weight: number, reps: number, rpe: number): boolean {
  return weight > 0 && Number.isInteger(reps) && reps > 0 && rpe > 0 && percentage(reps, rpe) > 0
}

export function roundToIncrement(value: number, increment: number): number {
  return Math.round(value / increment) * increment
}

export function formatNumber(value: number): string {
  return value.toFixed(1)
}

export function rpeLabel(rpe: number): string {
  return Number.isInteger(rpe) ? String(rpe) : rpe.toFixed(1)
}

export const REFERENCE_RPES = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6]
export const QUICK_PERCENTAGES = [
  ...Array.from({ length: 13 }, (_, index) => 60 + index * 2.5),
  95,
  102.5,
]
export const REFERENCE_REPS = Array.from({ length: 10 }, (_, index) => index + 1)

export function displayPercentage(value: number): string {
  return String(Math.floor(value))
}
