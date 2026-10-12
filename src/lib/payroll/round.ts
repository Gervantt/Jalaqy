/**
 * Единое правило округления для всех платежей: до целого тенге,
 * арифметически (0,5 — вверх). Меняется только здесь.
 */
export function roundTenge(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError(`roundTenge: не число (${value})`);
  // Math.round округляет −0,5 к нулю; суммы у нас неотрицательные, но держим симметрию
  return Math.sign(value) * Math.round(Math.abs(value));
}

/** Ставка в сотых долях процента (0.035 → 350), чтобы не терять точность на float. */
function toBasisPoints(rate: number): number {
  return Math.round(rate * 10_000);
}

/**
 * Точное значение «ставка × база» без ошибок плавающей точки
 * (0.1 × 320000 даёт 32000.000000000004 — здесь ровно 32000). Не округляет.
 */
export function applyRate(base: number, rate: number): number {
  return (base * toBasisPoints(rate)) / 10_000;
}

/** Процент от базы с округлением до тенге. */
export function percent(base: number, rate: number): number {
  return roundTenge(applyRate(base, rate));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
