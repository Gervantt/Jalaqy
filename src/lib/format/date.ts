import { t } from "@/i18n";

export type DateInput = Date | string;

export type DateStyle =
  /** 5 ноября 2026 */
  | "long"
  /** 5 ноября */
  | "dayMonth"
  /** 5 ноя */
  | "short"
  /** Октябрь 2026 */
  | "monthYear"
  /** 05.11.2026 */
  | "numeric";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * «2026-11-05» разбирается как локальная дата (без сдвига часового пояса),
 * остальные строки — через конструктор Date.
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) throw new RangeError("toDate: некорректная дата");
    return input;
  }
  const iso = ISO_DATE.exec(input);
  const date = iso ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])) : new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`toDate: некорректная дата «${input}»`);
  }
  return date;
}

export type MonthForm = "nominative" | "genitive" | "short";

/** Название месяца по индексу 0–11. */
export function monthName(monthIndex: number, form: MonthForm = "nominative"): string {
  const list =
    form === "genitive"
      ? t.date.monthsGenitive
      : form === "short"
        ? t.date.monthsShort
        : t.date.monthsNominative;
  const name = list[monthIndex];
  if (name === undefined) throw new RangeError(`monthName: нет месяца ${monthIndex}`);
  return name;
}

function capitalize(s: string): string {
  return s.charAt(0).toLocaleUpperCase("ru") + s.slice(1);
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatDate(input: DateInput, style: DateStyle = "long"): string {
  const d = toDate(input);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  switch (style) {
    case "long":
      return `${day} ${monthName(month, "genitive")} ${year}`;
    case "dayMonth":
      return `${day} ${monthName(month, "genitive")}`;
    case "short":
      return `${day} ${monthName(month, "short")}`;
    case "monthYear":
      return `${capitalize(monthName(month))} ${year}`;
    case "numeric":
      return `${pad2(day)}.${pad2(month + 1)}.${year}`;
  }
}

/**
 * Период: «1–31 октября», «28 октября – 3 ноября»,
 * «28 декабря 2026 – 3 января 2027». Год у одинаковых годов не пишем.
 */
export function formatPeriod(startInput: DateInput, endInput: DateInput): string {
  const start = toDate(startInput);
  const end = toDate(endInput);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  if (sameMonth && start.getDate() === end.getDate()) {
    return formatDate(start, "dayMonth");
  }
  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${monthName(end.getMonth(), "genitive")}`;
  }
  if (sameYear) {
    return `${formatDate(start, "dayMonth")} – ${formatDate(end, "dayMonth")}`;
  }
  return `${formatDate(start, "long")} – ${formatDate(end, "long")}`;
}
