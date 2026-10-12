import { describe, expect, it } from "vitest";
import { calculateEmployee, calculateYear } from "./employee";
import { ipnHighThreshold, progressiveIpn } from "./ipn";
import { rates2026 as rates } from "./rates";

describe("ИПН: 15% сверх 8 500 МРП за год, нарастающим итогом", () => {
  it("порог 2026 = 8 500 × 4 325 = 36 762 500 ₸", () => {
    expect(ipnHighThreshold(rates)).toBe(36_762_500);
  });

  it("налог на годовую базу", () => {
    expect(progressiveIpn(1_000_000, rates)).toBe(100_000);
    expect(progressiveIpn(36_762_500, rates)).toBe(3_676_250);
    expect(progressiveIpn(46_762_500, rates)).toBe(3_676_250 + 1_500_000);
  });

  it("5 000 000 ₸ в месяц: 8 месяцев по 10%, в 9-м — переход, дальше 15%", () => {
    const months = calculateYear(
      Array.from({ length: 12 }, () => ({ gross: 5_000_000, hasDeduction: true })),
      rates,
    );
    const ipn = months.map((m) => m.employee.ipn);
    // база месяца 4 411 250
    expect(ipn.slice(0, 8)).toEqual(Array(8).fill(441_125));
    // 9-й: 1 472 500 × 10% + 2 938 750 × 15% = 588 062,5 → 588 063
    expect(ipn[8]).toBe(588_063);
    // дальше 15% × 4 411 250 = 661 687,5 — округления гасят друг друга
    expect(ipn.slice(9)).toEqual([661_687, 661_688, 661_687]);
    // за год ровно по закону: 10% × 36 762 500 + 15% × 16 172 500
    const total = ipn.reduce((a, b) => a + b, 0);
    expect(total).toBe(6_102_125);
    expect(months[11]?.ytdAfter).toEqual({
      income: 60_000_000,
      ipnBase: 52_935_000,
      ipn: 6_102_125,
    });
  });

  it("учитывает доход с начала года, переданный извне", () => {
    const r = calculateEmployee(
      {
        gross: 320_000,
        hasDeduction: true,
        ytd: { income: 40_000_000, ipnBase: 36_762_500, ipn: 3_676_250 },
      },
      rates,
    );
    // порог уже пройден: 15% × 151 850 = 22 777,5 → 22 778
    expect(r.employee.ipn).toBe(22_778);
  });

  it("обычная зарплата весь год остаётся на 10%", () => {
    const months = calculateYear(
      Array.from({ length: 12 }, () => ({ gross: 320_000, hasDeduction: true })),
      rates,
    );
    expect(months.every((m) => m.employee.ipn === 15_185)).toBe(true);
  });
});
