import { describe, expect, it } from "vitest";
import { t } from "@/i18n";
import { formatCount, pluralize } from "./plural";

describe("pluralize", () => {
  it.each([
    [1, "сотрудник"],
    [2, "сотрудника"],
    [4, "сотрудника"],
    [5, "сотрудников"],
    [6, "сотрудников"],
    [11, "сотрудников"],
    [12, "сотрудников"],
    [14, "сотрудников"],
    [21, "сотрудник"],
    [22, "сотрудника"],
    [25, "сотрудников"],
    [101, "сотрудник"],
    [111, "сотрудников"],
    [0, "сотрудников"],
  ])("%d → %s", (n, expected) => {
    expect(pluralize(n, t.plural.employees)).toBe(expected);
  });

  it("formatCount", () => {
    expect(formatCount(6, t.plural.employees)).toBe("6 сотрудников");
    expect(formatCount(5, t.plural.days)).toBe("5 дней");
  });
});
