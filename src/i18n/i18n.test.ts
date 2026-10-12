import { describe, expect, it } from "vitest";
import { getDictionary, interpolate } from "./index";

describe("i18n", () => {
  it("kk пока пустой и полностью падает на ru", () => {
    expect(getDictionary("kk").brand.tagline).toBe(getDictionary("ru").brand.tagline);
    expect(getDictionary("kk").date.monthsGenitive).toHaveLength(12);
  });

  it("interpolate подставляет переменные и оставляет неизвестные", () => {
    expect(interpolate("{n} из {total}", { n: 2, total: 6 })).toBe("2 из 6");
    expect(interpolate("{x}", {})).toBe("{x}");
  });
});
