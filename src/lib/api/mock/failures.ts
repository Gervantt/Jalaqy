import { ApiError, type JalaqyApi } from "../client";

/**
 * Управляемые сбои мока — чтобы видеть и тестировать экраны ошибок.
 * Включаются переменной JALAQY_MOCK_FAIL="payroll.get,employees.list" (или "*")
 * либо в e2e через POST /api/test/fail.
 */
const KEY = Symbol.for("jalaqy.mockFailures");
type Holder = { [KEY]?: Set<string> };

function failures(): Set<string> {
  const g = globalThis as Holder;
  g[KEY] ??= new Set(
    (process.env.JALAQY_MOCK_FAIL ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return g[KEY];
}

export function setFailures(methods: string[]): void {
  (globalThis as Holder)[KEY] = new Set(methods);
}

function shouldFail(name: string): boolean {
  const set = failures();
  return set.has("*") || set.has(name);
}

/** Оборачивает каждый метод API: если он в списке сбоев — бросает ошибку сервера. */
export function withFailures(api: JalaqyApi): JalaqyApi {
  const wrapped = {} as Record<string, Record<string, unknown>>;
  for (const [group, methods] of Object.entries(api)) {
    wrapped[group] = {};
    for (const [name, fn] of Object.entries(
      methods as Record<string, (...a: unknown[]) => unknown>,
    )) {
      wrapped[group][name] = (...args: unknown[]) => {
        if (shouldFail(`${group}.${name}`)) {
          return Promise.reject(new ApiError({ code: "server", message: "mock failure" }, 503));
        }
        return fn(...args);
      };
    }
  }
  return wrapped as unknown as JalaqyApi;
}
