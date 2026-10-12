import { describe, expect, it } from "vitest";
import { formatNumber, formatTenge, parseTenge } from "./tenge";

/** В тестах пишем обычные пробелы — так читаемее; в выводе они неразрывные. */
const plain = (s: string) => s.replace(/ /g, " ");

describe("formatTenge", () => {
  it.each([
    [0, "0 ₸"],
    [5, "5 ₸"],
    [999, "999 ₸"],
    [1000, "1 000 ₸"],
    [52096, "52 096 ₸"],
    [266415, "266 415 ₸"],
    [1558890, "1 558 890 ₸"],
    [100000000, "100 000 000 ₸"],
  ])("%d → %s", (value, expected) => {
    expect(plain(formatTenge(value))).toBe(expected);
  });

  it("использует неразрывные пробелы, чтобы сумма не переносилась", () => {
    expect(formatTenge(1558890)).toBe("1 558 890 ₸");
  });

  it("отрицательные — с типографским минусом", () => {
    expect(plain(formatTenge(-32000))).toBe("−32 000 ₸");
  });

  it("sign: always добавляет плюс к положительным", () => {
    expect(plain(formatTenge(40000, { sign: "always" }))).toBe("+40 000 ₸");
    expect(plain(formatTenge(0, { sign: "always" }))).toBe("0 ₸");
  });

  it("sign: never убирает знак", () => {
    expect(plain(formatTenge(-6400, { sign: "never" }))).toBe("6 400 ₸");
  });

  it("currency: false — только число", () => {
    expect(plain(formatTenge(1870000, { currency: false }))).toBe("1 870 000");
  });

  it("дробное округляет до тенге, −0 не показывает минус", () => {
    expect(plain(formatNumber(15184.5))).toBe("15 185");
    expect(formatNumber(-0.2)).toBe("0");
  });

  it("бросает на NaN и бесконечности", () => {
    expect(() => formatTenge(Number.NaN)).toThrow(RangeError);
    expect(() => formatTenge(Infinity)).toThrow(RangeError);
  });
});

describe("parseTenge", () => {
  it.each([
    ["1 558 890 ₸", 1558890],
    ["1 558 890", 1558890],
    ["320000", 320000],
    ["  0 ", 0],
  ])("%s → %d", (input, expected) => {
    expect(parseTenge(input)).toBe(expected);
  });

  it("пусто → null", () => {
    expect(parseTenge("")).toBeNull();
    expect(parseTenge("₸")).toBeNull();
  });
});
