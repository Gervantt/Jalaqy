import { describe, expect, it } from "vitest";
import { formatDate, formatPeriod, monthName, toDate } from "./date";

describe("formatDate", () => {
  const d = "2026-11-05";

  it.each([
    ["long", "5 ноября 2026"],
    ["dayMonth", "5 ноября"],
    ["short", "5 ноя"],
    ["monthYear", "Ноябрь 2026"],
    ["numeric", "05.11.2026"],
  ] as const)("%s → %s", (style, expected) => {
    expect(formatDate(d, style)).toBe(expected);
  });

  it("по умолчанию — long", () => {
    expect(formatDate(new Date(2026, 9, 31))).toBe("31 октября 2026");
  });

  it("май в родительном и коротком — «мая»", () => {
    expect(formatDate("2026-05-09", "dayMonth")).toBe("9 мая");
    expect(formatDate("2026-05-09", "short")).toBe("9 мая");
  });

  it("ISO-дата разбирается как локальная, без сдвига пояса", () => {
    const parsed = toDate("2026-01-01");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(0);
    expect(parsed.getDate()).toBe(1);
  });

  it("бросает на некорректной дате", () => {
    expect(() => formatDate("не дата")).toThrow(RangeError);
  });
});

describe("formatPeriod", () => {
  it("один месяц — «1–31 октября»", () => {
    expect(formatPeriod("2026-10-01", "2026-10-31")).toBe("1–31 октября");
    expect(formatPeriod("2026-11-10", "2026-11-14")).toBe("10–14 ноября");
  });

  it("разные месяцы", () => {
    expect(formatPeriod("2026-10-28", "2026-11-03")).toBe("28 октября – 3 ноября");
  });

  it("разные годы — с годами", () => {
    expect(formatPeriod("2026-12-28", "2027-01-03")).toBe("28 декабря 2026 – 3 января 2027");
  });

  it("один день", () => {
    expect(formatPeriod("2026-11-25", "2026-11-25")).toBe("25 ноября");
  });
});

describe("monthName", () => {
  it("формы", () => {
    expect(monthName(9)).toBe("октябрь");
    expect(monthName(9, "genitive")).toBe("октября");
    expect(monthName(9, "short")).toBe("окт");
  });

  it("бросает вне 0–11", () => {
    expect(() => monthName(12)).toThrow(RangeError);
  });
});
