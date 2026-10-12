import { describe, expect, it } from "vitest";
import { contrastRatio } from "./color";

describe("contrastRatio", () => {
  it("чёрный на белом — 21", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });

  it("симметричен", () => {
    expect(contrastRatio("#1F6B52", "#FFFFFF")).toBeCloseTo(
      contrastRatio("#FFFFFF", "#1F6B52"),
      10,
    );
  });

  // Пары текст/фон из дизайна должны проходить AA для обычного текста (4.5:1)
  it.each([
    ["#0F2A24", "#F3F5F0", "хвоя на бумаге"],
    ["#55625C", "#F3F5F0", "вторичный на бумаге"],
    ["#55625C", "#FFFFFF", "вторичный на карточке"],
    ["#55625C", "#FBF8F1", "вторичный на креме"],
    ["#FFFFFF", "#1F6B52", "белый на кнопке"],
    ["#A9BDB4", "#0F2A24", "подпись на хвое"],
    ["#C9D6D0", "#0F2A24", "текст на хвое"],
    ["#F2C14E", "#0F2A24", "золото на хвое"],
    ["#4A3600", "#FBEFC9", "текст баннера"],
    ["#174F3D", "#E2ECE6", "пилюля «Выплачено»"],
    ["#1F6B52", "#E2ECE6", "шаг степпера"],
    ["#B42318", "#FFFFFF", "ошибка на белом"],
  ])("%s на %s (%s) ≥ 4.5", (fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
