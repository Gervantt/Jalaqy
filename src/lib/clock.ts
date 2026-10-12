import type { ISODate, Period } from "@/lib/api/contracts";
import { MOCK_TODAY } from "@/lib/api/mock/seed";

/**
 * «Сегодня» для расчётов. В моке время заморожено (MOCK_TODAY), чтобы демо
 * всегда показывало октябрьский расчёт; с бэкендом — реальная дата.
 * Переопределяется JALAQY_TODAY=ГГГГ-ММ-ДД.
 */
export function today(): ISODate {
  if (process.env.JALAQY_TODAY) return process.env.JALAQY_TODAY;
  if (!process.env.JALAQY_API_URL) return MOCK_TODAY;
  return new Date().toISOString().slice(0, 10);
}

export function currentPeriod(): Period {
  return today().slice(0, 7);
}

/** Сколько дней от сегодня до даты (может быть отрицательным). */
export function daysUntil(date: ISODate): number {
  return Math.round((Date.parse(date) - Date.parse(today())) / 86_400_000);
}
