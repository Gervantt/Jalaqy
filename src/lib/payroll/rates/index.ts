import type { YearRates } from "../types";
import { rates2026 } from "./2026";

/** Новый год — новый файл rates/<год>.ts и строка здесь. */
const byYear: Record<number, YearRates> = {
  2026: rates2026,
};

export function getRates(year: number): YearRates {
  const rates = byYear[year];
  if (!rates) {
    throw new RangeError(`Нет ставок на ${year} год: добавьте src/lib/payroll/rates/${year}.ts`);
  }
  return rates;
}

export function supportedYears(): number[] {
  return Object.keys(byYear).map(Number);
}

export { rates2026 };
