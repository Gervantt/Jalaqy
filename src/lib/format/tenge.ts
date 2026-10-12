import { t } from "@/i18n";

/** Неразрывный пробел: разделитель тысяч и пробел перед ₸, чтобы сумма не переносилась. */
export const NBSP = " ";
/** Типографский минус, а не дефис. */
export const MINUS = "−";

export type SignDisplay = "auto" | "always" | "never";

export interface FormatTengeOptions {
  /** auto — минус у отрицательных; always — ещё и плюс у положительных; never — без знака. */
  sign?: SignDisplay;
  /** Добавлять ли « ₸». По умолчанию да. */
  currency?: boolean;
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/**
 * Целое число с разделителями: 1558890 → «1 558 890».
 * Суммы в Jalaqy целые; дробное значение округляется до тенге для показа.
 */
export function formatNumber(value: number, sign: SignDisplay = "auto"): string {
  if (!Number.isFinite(value)) {
    throw new RangeError(`formatNumber: ожидалось конечное число, получено ${value}`);
  }
  const rounded = Math.round(value);
  const abs = groupThousands(String(Math.abs(rounded)));
  if (rounded === 0 || sign === "never") return abs;
  if (rounded < 0) return MINUS + abs;
  return sign === "always" ? "+" + abs : abs;
}

/** 1558890 → «1 558 890 ₸»; −32000 → «−32 000 ₸». */
export function formatTenge(value: number, options: FormatTengeOptions = {}): string {
  const { sign = "auto", currency = true } = options;
  const n = formatNumber(value, sign);
  return currency ? `${n}${NBSP}${t.common.currency}` : n;
}

/** Разбор ввода пользователя: «1 558 890 ₸» → 1558890. Пусто или нет цифр → null. */
export function parseTenge(input: string): number | null {
  const digits = input.replace(/\D/g, "");
  if (digits === "") return null;
  return Number.parseInt(digits, 10);
}
