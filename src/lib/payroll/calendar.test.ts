import { describe, expect, it } from "vitest";
import { isWorkingDay, workingDays } from "./calendar";
import { prorateSalary } from "./prorate";

describe("производственный календарь 2026", () => {
  it("октябрь: 22 будних − 26 октября (перенос Дня Республики) = 21", () => {
    expect(workingDays(2026, 9)).toBe(21);
    expect(isWorkingDay(2026, 9, 26)).toBe(false);
    expect(isWorkingDay(2026, 9, 27)).toBe(true);
  });

  it("выходные не рабочие", () => {
    expect(isWorkingDay(2026, 9, 24)).toBe(false); // суббота
    expect(isWorkingDay(2026, 9, 25)).toBe(false); // воскресенье
  });

  it("март: Наурыз и переносы", () => {
    // 22 будних в марте − 9, 23, 24, 25 марта = 18
    expect(workingDays(2026, 2)).toBe(18);
  });

  it("интервал внутри месяца", () => {
    expect(workingDays(2026, 9, 15, 31)).toBe(11);
  });

  it("нет календаря на год — ошибка", () => {
    expect(() => workingDays(2031, 0)).toThrow(RangeError);
  });
});

describe("prorateSalary — неполный месяц", () => {
  it("приём 15 октября при окладе 200 000: 11 из 21 дня → 104 762", () => {
    expect(prorateSalary(200_000, 11, 21)).toBe(104_762);
  });

  it("полный месяц — оклад без изменений", () => {
    expect(prorateSalary(320_000, 21, 21)).toBe(320_000);
  });

  it("0 дней — 0", () => {
    expect(prorateSalary(320_000, 0, 21)).toBe(0);
  });

  it("проверяет вход", () => {
    expect(() => prorateSalary(320_000, 22, 21)).toThrow(RangeError);
    expect(() => prorateSalary(320_000, 5, 0)).toThrow(RangeError);
    expect(() => prorateSalary(-1, 5, 21)).toThrow(RangeError);
  });
});
