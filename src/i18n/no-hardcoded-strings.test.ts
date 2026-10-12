import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Все строки интерфейса — в словаре (src/i18n). Тест ищет кириллицу в коде
 * (без комментариев) за пределами словаря. Исключения — данные, а не интерфейс.
 */
const ROOT = path.join(process.cwd(), "src");
const ALLOWED = [
  "src/i18n/",
  "src/lib/api/mock/seed.ts", // демо-компания: имена и должности — данные
  "src/app/styleguide/", // витрина UI-кита: примеры данных
];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return files(full);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : [];
  });
}

function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`\w])\/\/.*$/gm, "$1")
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");
}

describe("строки интерфейса только в словаре", () => {
  it("нет кириллицы в коде вне src/i18n", () => {
    const offenders: string[] = [];
    for (const file of files(ROOT)) {
      const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
      if (ALLOWED.some((a) => rel.startsWith(a))) continue;
      const lines = stripComments(readFileSync(file, "utf8")).split("\n");
      lines.forEach((line, i) => {
        // сообщения исключений — для разработчиков, а не для интерфейса
        if (/new \w*Error\(/.test(line)) return;
        if (/[А-Яа-яЁё]/.test(line))
          offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});
