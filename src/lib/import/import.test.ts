import { describe, expect, it } from "vitest";
import { withCheckDigit } from "@/lib/api/mock/seed";
import { parseCsv } from "./csv";
import { importEmployeesCsv } from "./employees";

describe("parseCsv", () => {
  it("точка с запятой, кавычки, BOM, CRLF", () => {
    expect(parseCsv('﻿a;b\r\n"x;y";"say ""hi"""\r\n')).toEqual([
      ["a", "b"],
      ["x;y", 'say "hi"'],
    ]);
  });

  it("запятая и табуляция определяются автоматически", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
    expect(parseCsv("a\tb\n1\t2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("пустые строки пропускаются", () => {
    expect(parseCsv("a;b\n\n;\n1;2\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("importEmployeesCsv", () => {
  const iin = withCheckDigit("98071230045");

  it("разбирает строки и пропускает заголовок", () => {
    const csv = `ФИО;Должность;Оклад;Дата приёма;ИИН;Вычет\nКасымов Данияр Ерланович;Бариста;320 000;01.10.2026;${iin};да\n`;
    const r = importEmployeesCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.employees).toEqual([
      {
        lastName: "Касымов",
        firstName: "Данияр",
        position: "Бариста",
        salary: 320_000,
        hireDate: "2026-10-01",
        iin,
        hasDeduction: true,
      },
    ]);
  });

  it("строки с ошибками — в errors с номером строки", () => {
    const csv = `ФИО;Должность;Оклад;Дата приёма;ИИН;Вычет\nАсель;;50000;2026-10-01;123;нет\n`;
    const r = importEmployeesCsv(csv);
    expect(r.employees).toEqual([]);
    expect(r.errors[0]?.line).toBe(2);
    expect(r.errors[0]?.message).toMatch(/МЗП/);
    expect(r.errors[0]?.message).toMatch(/ИИН/);
  });
});
