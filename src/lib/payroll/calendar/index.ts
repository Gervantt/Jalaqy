import { nonWorkingWeekdays2026 } from "./2026";

const byYear: Record<number, ReadonlySet<string>> = {
  2026: new Set(nonWorkingWeekdays2026),
};

function holidays(year: number): ReadonlySet<string> {
  const set = byYear[year];
  if (!set) throw new RangeError(`Нет производственного календаря на ${year} год`);
  return set;
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Рабочий ли день (пн–пт и не праздник). monthIndex — 0…11. */
export function isWorkingDay(year: number, monthIndex: number, day: number): boolean {
  const weekday = new Date(year, monthIndex, day).getDay();
  if (weekday === 0 || weekday === 6) return false;
  return !holidays(year).has(iso(year, monthIndex, day));
}

/** Рабочие дни месяца между fromDay и toDay включительно (по умолчанию — весь месяц). */
export function workingDays(
  year: number,
  monthIndex: number,
  fromDay = 1,
  toDay = new Date(year, monthIndex + 1, 0).getDate(),
): number {
  let count = 0;
  for (let d = fromDay; d <= toDay; d++) {
    if (isWorkingDay(year, monthIndex, d)) count++;
  }
  return count;
}
