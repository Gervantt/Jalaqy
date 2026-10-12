import { kk } from "./kk";
import { ru } from "./ru";
import type { Dictionary, Locale, PartialDictionary } from "./types";

export type { Dictionary, Locale } from "./types";

export const defaultLocale: Locale = "ru";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function merge<T>(base: T, override: PartialDictionary<T> | undefined): T {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = merge((base as Record<string, unknown>)[key], value as never);
  }
  return out as T;
}

const dictionaries: Record<Locale, Dictionary> = {
  ru,
  kk: merge<Dictionary>(ru, kk),
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

/** Словарь текущей локали. Пока локаль одна — ru. */
export const t: Dictionary = getDictionary();

/** Подстановка: interpolate("{n} дней", { n: 5 }) → "5 дней". */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
