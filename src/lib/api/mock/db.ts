import { seed, type MockDb } from "./seed";

/*
 * Состояние мока живёт в памяти процесса. Через globalThis — чтобы горячая
 * перезагрузка модулей в dev не сбрасывала данные между запросами.
 */
const KEY = Symbol.for("jalaqy.mockDb");
type Holder = { [KEY]?: MockDb };

export function getDb(): MockDb {
  const g = globalThis as Holder;
  g[KEY] ??= seed();
  return g[KEY];
}

/** Вернуть демо-данные к исходным (настройки → «Сбросить демо-данные», тесты). */
export function resetDb(): void {
  (globalThis as Holder)[KEY] = seed();
}

export function nextId(prefix: string): string {
  const db = getDb();
  db.seq += 1;
  return `${prefix}-${db.seq}`;
}
