import { describe, expect, it } from "vitest";
import { calculateEmployee } from "./employee";
import { rates2026 as rates } from "./rates";

const calc = (gross: number, hasDeduction = true) =>
  calculateEmployee({ gross, hasDeduction }, rates);

describe("обязательные кейсы из дизайна", () => {
  it("оклад 320 000 с вычетом", () => {
    const r = calc(320_000);
    expect(r.employee).toEqual({ opv: 32_000, vosms: 6_400, ipn: 15_185, total: 53_585 });
    expect(r.net).toBe(266_415);
    expect(r.employer).toEqual({
      opvr: 11_200,
      so: 14_400,
      oosms: 9_600,
      socialTax: 16_896,
      total: 52_096,
    });
    expect(r.cost).toBe(372_096);
  });

  it("оклад 550 000 с вычетом", () => {
    const r = calc(550_000);
    expect(r.employee.opv).toBe(55_000);
    expect(r.employee.vosms).toBe(11_000);
    expect(r.employee.ipn).toBe(35_425);
    expect(r.net).toBe(448_575);
    expect(r.employer.total).toBe(89_540);
    expect(r.employer).toMatchObject({
      opvr: 19_250,
      so: 24_750,
      oosms: 16_500,
      socialTax: 29_040,
    });
  });

  it.each([
    [300_000, 30_000, 6_000, 13_425, 250_575, 48_840],
    [250_000, 25_000, 5_000, 9_025, 210_975, 40_700],
    [200_000, 20_000, 4_000, 4_625, 171_375, 32_560],
  ])(
    "оклад %d → ОПВ %d, ВОСМС %d, ИПН %d, на руки %d, работодатель %d",
    (gross, opv, vosms, ipn, net, employer) => {
      const r = calc(gross);
      expect(r.employee).toMatchObject({ opv, vosms, ipn });
      expect(r.net).toBe(net);
      expect(r.employer.total).toBe(employer);
    },
  );
});

describe("граничные случаи", () => {
  it("без заявления на вычет — ИПН с полной базы", () => {
    const r = calc(320_000, false);
    expect(r.bases.deduction).toBe(0);
    expect(r.bases.ipn).toBe(281_600);
    expect(r.employee.ipn).toBe(28_160);
    expect(r.net).toBe(253_440);
    // взносы работодателя от вычета не зависят
    expect(r.employer.total).toBe(52_096);
  });

  it("оклад ниже МЗП: ОПВР и СО — от 1 МЗП, соцналог — от 14 МРП, ИПН 0", () => {
    const r = calc(60_000);
    expect(r.employee).toEqual({ opv: 6_000, vosms: 1_200, ipn: 0, total: 7_200 });
    expect(r.net).toBe(52_800);
    // вычет не больше дохода: применён ровно на 52 800
    expect(r.bases.deduction).toBe(52_800);
    expect(r.bases.opvr).toBe(85_000);
    expect(r.bases.so).toBe(85_000);
    expect(r.bases.socialTax).toBe(60_550);
    expect(r.employer).toEqual({
      opvr: 2_975,
      so: 4_250,
      oosms: 1_800,
      socialTax: 3_633,
      total: 12_658,
    });
  });

  it("оклад выше 50 МЗП: срабатывают все пределы", () => {
    const r = calc(5_000_000);
    expect(r.bases).toMatchObject({
      opv: 4_250_000, // 50 МЗП
      vosms: 1_700_000, // 20 МЗП
      opvr: 4_250_000, // 50 МЗП
      so: 595_000, // 7 МЗП
      oosms: 3_400_000, // 40 МЗП
    });
    expect(r.employee).toEqual({ opv: 425_000, vosms: 34_000, ipn: 441_125, total: 900_125 });
    expect(r.net).toBe(4_099_875);
    expect(r.employer).toEqual({
      opvr: 148_750,
      so: 29_750,
      oosms: 102_000,
      socialTax: 272_460,
      total: 552_960,
    });
  });

  it("ровно 1 МЗП", () => {
    const r = calc(85_000);
    expect(r.employee).toEqual({ opv: 8_500, vosms: 1_700, ipn: 0, total: 10_200 });
    // соцналог: база max(85 000 − 8 500 − 1 700, 14 МРП) = 74 800 → 4 488
    expect(r.bases.socialTax).toBe(74_800);
    expect(r.employer).toEqual({
      opvr: 2_975,
      so: 4_250,
      oosms: 2_550,
      socialTax: 4_488,
      total: 14_263,
    });
  });

  it("неполный месяц: начислено 104 762 (11 из 21 дня при окладе 200 000)", () => {
    const r = calc(104_762);
    expect(r.employee).toEqual({ opv: 10_476, vosms: 2_095, ipn: 0, total: 12_571 });
    expect(r.net).toBe(92_191);
    expect(r.employer).toEqual({
      opvr: 3_667,
      so: 4_714,
      oosms: 3_143,
      socialTax: 5_531,
      total: 17_055,
    });
  });

  it("начислено 0 — все платежи 0 (минимальные базы не применяются)", () => {
    const r = calc(0);
    expect(r.employee.total).toBe(0);
    expect(r.employer.total).toBe(0);
    expect(r.net).toBe(0);
    expect(r.cost).toBe(0);
  });

  it("округление по каждому платежу отдельно: 0,5 — вверх", () => {
    // 3% × 100 017 = 3 000,51 → 3 001; 10% × 100 005 = 10 000,5 → 10 001
    expect(calc(100_017).employer.oosms).toBe(3_001);
    expect(calc(100_005).employee.opv).toBe(10_001);
  });

  it("на руки + удержания = начислено; стоимость = начислено + работодатель", () => {
    for (const gross of [85_000, 123_457, 320_000, 999_999, 5_000_000]) {
      for (const ded of [true, false]) {
        const r = calc(gross, ded);
        expect(r.net + r.employee.total).toBe(gross);
        expect(r.cost).toBe(gross + r.employer.total);
      }
    }
  });

  it("отклоняет некорректный вход", () => {
    expect(() => calc(-1)).toThrow(RangeError);
    expect(() => calc(100.5)).toThrow(RangeError);
    expect(() => calc(Number.NaN)).toThrow(RangeError);
  });
});
