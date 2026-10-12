import type { ru } from "./ru";

/** Литеральные строки словаря → string, кортежи сохраняют длину. */
type Widen<T> = T extends string ? string : { readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof ru>;

/** Частичный словарь: массивы переводятся целиком, объекты — по ключам. */
export type PartialDictionary<T = Dictionary> = T extends string
  ? string
  : T extends readonly unknown[]
    ? T
    : { readonly [K in keyof T]?: PartialDictionary<T[K]> };

export type Locale = "ru" | "kk";
