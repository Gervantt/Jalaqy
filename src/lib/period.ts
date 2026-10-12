import type { ISODate, Period } from "@/lib/api/contracts";

const PERIOD = /^(\d{4})-(\d{2})$/;

export interface PeriodParts {
  year: number;
  /** 0…11 */
  monthIndex: number;
}

export function parsePeriod(period: Period): PeriodParts {
  const m = PERIOD.exec(period);
  const month = m ? Number(m[2]) : 0;
  if (!m || month < 1 || month > 12) throw new RangeError(`Некорректный период «${period}»`);
  return { year: Number(m[1]), monthIndex: month - 1 };
}

export function isPeriod(value: string | undefined | null): value is Period {
  if (!value) return false;
  try {
    parsePeriod(value);
    return true;
  } catch {
    return false;
  }
}

export function toPeriod(year: number, monthIndex: number): Period {
  const d = new Date(year, monthIndex, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function shiftPeriod(period: Period, months: number): Period {
  const { year, monthIndex } = parsePeriod(period);
  return toPeriod(year, monthIndex + months);
}

export function daysInMonth(period: Period): number {
  const { year, monthIndex } = parsePeriod(period);
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function periodStart(period: Period): ISODate {
  return `${period}-01`;
}

export function periodEnd(period: Period): ISODate {
  return `${period}-${String(daysInMonth(period)).padStart(2, "0")}`;
}

export function periodOf(date: ISODate): Period {
  return date.slice(0, 7);
}

/** Периоды с from по to включительно. */
export function periodRange(from: Period, to: Period): Period[] {
  const out: Period[] = [];
  for (let p = from; p <= to; p = shiftPeriod(p, 1)) out.push(p);
  return out;
}

/** Сравнение ISO-дат как строк работает лексикографически. */
export function maxDate(a: ISODate, b: ISODate): ISODate {
  return a > b ? a : b;
}
export function minDate(a: ISODate, b: ISODate): ISODate {
  return a < b ? a : b;
}

/** День месяца из ISO-даты. */
export function dayOf(date: ISODate): number {
  return Number(date.slice(8, 10));
}

/** Квартал периода: «2026-Q3». */
export function quarterOf(period: Period): string {
  const { year, monthIndex } = parsePeriod(period);
  return `${year}-Q${Math.floor(monthIndex / 3) + 1}`;
}

/** Период корректен и для его года есть ставки и календарь. */
export function isSupportedPeriod(
  value: string | undefined | null,
  years: number[],
): value is Period {
  return isPeriod(value) && years.includes(parsePeriod(value).year);
}
