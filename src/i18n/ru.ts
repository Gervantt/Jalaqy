/**
 * Русский словарь — единственный источник строк интерфейса.
 * Разбит по разделам в ./ru/*. Казахский (kk.ts) переопределяет ключи частично;
 * недостающие берутся отсюда.
 */
import { core } from "./ru/core";
import { styleguide } from "./ru/styleguide";

export const ru = {
  ...core,
  styleguide,
} as const;
