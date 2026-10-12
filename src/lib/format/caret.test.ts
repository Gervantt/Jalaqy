import { describe, expect, it } from "vitest";
import { caretAfterDigits, digitsBefore } from "./caret";

const NB = " ";

describe("caret helpers", () => {
  it("digitsBefore игнорирует пробелы", () => {
    expect(digitsBefore(`1${NB}558${NB}890`, 5)).toBe(4);
    expect(digitsBefore("320000", 0)).toBe(0);
  });

  it("caretAfterDigits ставит курсор после нужной цифры", () => {
    expect(caretAfterDigits(`1${NB}558${NB}890`, 4)).toBe(5);
    expect(caretAfterDigits(`1${NB}558${NB}890`, 1)).toBe(1);
    expect(caretAfterDigits(`1${NB}558${NB}890`, 7)).toBe(9);
    expect(caretAfterDigits("", 3)).toBe(0);
  });
});
