import { describe, expect, it } from "vitest";
import {
  isPeriod,
  parsePeriod,
  periodEnd,
  periodRange,
  periodStart,
  quarterOf,
  shiftPeriod,
} from "./period";

describe("period", () => {
  it("разбор и проверка", () => {
    expect(parsePeriod("2026-10")).toEqual({ year: 2026, monthIndex: 9 });
    expect(isPeriod("2026-13")).toBe(false);
    expect(isPeriod("2026-1")).toBe(false);
    expect(isPeriod(undefined)).toBe(false);
  });

  it("сдвиг через границу года", () => {
    expect(shiftPeriod("2026-12", 1)).toBe("2027-01");
    expect(shiftPeriod("2026-01", -1)).toBe("2025-12");
  });

  it("границы месяца", () => {
    expect(periodStart("2026-10")).toBe("2026-10-01");
    expect(periodEnd("2026-10")).toBe("2026-10-31");
    expect(periodEnd("2026-02")).toBe("2026-02-28");
  });

  it("диапазон и квартал", () => {
    expect(periodRange("2026-08", "2026-10")).toEqual(["2026-08", "2026-09", "2026-10"]);
    expect(quarterOf("2026-09")).toBe("2026-Q3");
    expect(quarterOf("2026-10")).toBe("2026-Q4");
  });
});
