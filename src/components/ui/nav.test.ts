import { describe, expect, it } from "vitest";
import { isActivePath } from "./nav";

describe("isActivePath", () => {
  it("раздел активен на своих подстраницах", () => {
    expect(isActivePath("/app/employees/42", { href: "/app/employees" })).toBe(true);
    expect(isActivePath("/app/employees", { href: "/app/employees" })).toBe(true);
  });

  it("не путает разделы с общим префиксом", () => {
    expect(isActivePath("/app/payroll-archive", { href: "/app/payroll" })).toBe(false);
  });

  it("exact — только точное совпадение", () => {
    expect(isActivePath("/me/leave", { href: "/me", exact: true })).toBe(false);
    expect(isActivePath("/me", { href: "/me", exact: true })).toBe(true);
  });
});
