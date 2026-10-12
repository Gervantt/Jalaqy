import { describe, expect, it } from "vitest";
import { calculatePayroll } from "./company";
import { rates2026 as rates } from "./rates";

/** Компания из design/Payroll.dc.html: у всех есть заявление на вычет. */
const designCompany = [
  { id: "madina", gross: 550_000, hasDeduction: true },
  { id: "daniyar", gross: 320_000, hasDeduction: true },
  { id: "asel", gross: 300_000, hasDeduction: true },
  { id: "erlan", gross: 250_000, hasDeduction: true },
  { id: "aigerim", gross: 250_000, hasDeduction: true },
  { id: "timur", gross: 200_000, hasDeduction: true },
];

describe("6 сотрудников из дизайна", () => {
  const { lines, totals } = calculatePayroll(designCompany, rates);

  it("итоги совпадают с макетом до тенге", () => {
    expect(totals.gross).toBe(1_870_000);
    expect(totals.opv).toBe(187_000);
    expect(totals.vosms).toBe(37_400);
    expect(totals.ipn).toBe(86_710);
    expect(totals.net).toBe(1_558_890);
    expect(totals.withheld).toBe(311_110);
    expect(totals.employer).toBe(304_436);
    expect(totals.toBudget).toBe(615_546);
    expect(totals.cost).toBe(2_174_436);
  });

  it("строки идут в порядке входа и с теми же id", () => {
    expect(lines.map((l) => l.id)).toEqual(designCompany.map((e) => e.id));
    expect(lines[1]?.result.net).toBe(266_415);
  });

  it("итоги = сумма строк", () => {
    const sum = (f: (i: number) => number) => lines.reduce((a, _, i) => a + f(i), 0);
    expect(totals.net).toBe(sum((i) => lines[i]!.result.net));
    expect(totals.socialTax).toBe(sum((i) => lines[i]!.result.employer.socialTax));
  });
});

it("пустая компания — нули", () => {
  const { lines, totals } = calculatePayroll([], rates);
  expect(lines).toEqual([]);
  expect(totals.cost).toBe(0);
});
