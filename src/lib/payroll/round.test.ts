import { describe, expect, it } from "vitest";
import { getRates, supportedYears } from "./rates";
import { applyRate, percent, roundTenge } from "./round";

describe("roundTenge", () => {
  it.each([
    [15_184.5, 15_185],
    [15_184.49, 15_184],
    [0.5, 1],
    [-0.5, -1],
    [0, 0],
  ])("%d → %d", (v, expected) => {
    expect(roundTenge(v)).toBe(expected);
  });

  it("бросает на NaN", () => {
    expect(() => roundTenge(Number.NaN)).toThrow(RangeError);
  });
});

describe("applyRate / percent", () => {
  it("без ошибок плавающей точки", () => {
    expect(0.035 * 320_000).not.toBe(11_200); // в float получается 11200.000000000002
    expect(applyRate(320_000, 0.035)).toBe(11_200);
    expect(applyRate(550_000, 0.035)).toBe(19_250);
    expect(applyRate(320_000, 0.1)).toBe(32_000);
    expect(percent(281_600, 0.06)).toBe(16_896);
  });
});

describe("rates", () => {
  it("2026: МЗП 85 000, МРП 4 325", () => {
    const r = getRates(2026);
    expect(r.mzp).toBe(85_000);
    expect(r.mrp).toBe(4_325);
  });

  it("неизвестный год — понятная ошибка", () => {
    expect(() => getRates(2019)).toThrow(/rates\/2019\.ts/);
    expect(supportedYears()).toContain(2026);
  });
});
