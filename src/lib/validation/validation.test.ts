import { describe, expect, it } from "vitest";
import {
  formatKzPhone,
  isEmail,
  normalizeKzPhone,
  normalizeTelegram,
  parseLoginContact,
} from "./contact";
import { iinCheckDigit, isValidIinBin, maskIin } from "./iin";

describe("ИИН/БИН", () => {
  it("контрольная цифра по первому набору весов", () => {
    // 1·1+2·2+…+11·1 и т.д. — проверяем на построенном номере
    const base = "90031545012";
    const check = iinCheckDigit(base);
    expect(check).not.toBeNull();
    expect(isValidIinBin(base + check)).toBe(true);
    expect(isValidIinBin(base + ((check! + 1) % 10))).toBe(false);
  });

  it("второй набор весов, если первый дал 10", () => {
    // подбираем номер, у которого первый проход даёт 10
    let found: string | null = null;
    for (let i = 0; i < 1000 && !found; i++) {
      const base = `0000000${String(i).padStart(4, "0")}`;
      const digits = [...base].map(Number);
      const s1 = digits.reduce((s, d, k) => s + d * (k + 1), 0) % 11;
      if (s1 === 10 && iinCheckDigit(base) !== null) found = base;
    }
    expect(found).not.toBeNull();
    expect(isValidIinBin(found! + iinCheckDigit(found!))).toBe(true);
  });

  it("формат", () => {
    expect(isValidIinBin("12345")).toBe(false);
    expect(isValidIinBin("abcdefghijkl")).toBe(false);
    expect(maskIin("900315450123")).toBe("•••••••• 0123");
  });
});

describe("контакты", () => {
  it.each([
    ["+7 701 123 45 14", "+77011234514"],
    ["87011234514", "+77011234514"],
    ["8 (701) 123-45-14", "+77011234514"],
    ["7011234514", "+77011234514"],
  ])("телефон %s → %s", (input, expected) => {
    expect(normalizeKzPhone(input)).toBe(expected);
  });

  it("не мобильный и не тот формат", () => {
    expect(normalizeKzPhone("+7 495 123 45 67")).toBeNull();
    expect(normalizeKzPhone("12345")).toBeNull();
  });

  it("формат телефона для показа", () => {
    expect(formatKzPhone("+77011234514")).toBe("+7 701 123 45 14");
  });

  it("email и telegram", () => {
    expect(isEmail("buh@tulpan.kz")).toBe(true);
    expect(isEmail("buh@tulpan")).toBe(false);
    expect(normalizeTelegram("@jalaqy")).toBe("@jalaqy");
    expect(normalizeTelegram("https://t.me/jalaqy_kz")).toBe("@jalaqy_kz");
    expect(normalizeTelegram("@ab")).toBeNull();
  });

  it("вход: телефон или email", () => {
    expect(parseLoginContact(" Buh@Tulpan.kz ")).toEqual({ kind: "email", value: "buh@tulpan.kz" });
    expect(parseLoginContact("8 701 123 45 14")).toEqual({ kind: "phone", value: "+77011234514" });
    expect(parseLoginContact("привет")).toBeNull();
  });
});
