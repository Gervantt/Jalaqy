import { calculateEmployee } from "./employee";
import type { EmployeeMonthInput, EmployeeMonthResult, PayrollTotals, YearRates } from "./types";

const ZERO: PayrollTotals = {
  gross: 0,
  opv: 0,
  vosms: 0,
  ipn: 0,
  withheld: 0,
  net: 0,
  opvr: 0,
  so: 0,
  oosms: 0,
  socialTax: 0,
  employer: 0,
  toBudget: 0,
  cost: 0,
};

/** Итоги по уже посчитанным строкам: суммы округлённых платежей, как в ведомости. */
export function sumPayroll(results: EmployeeMonthResult[]): PayrollTotals {
  return results.reduce<PayrollTotals>((t, r) => {
    const withheld = t.withheld + r.employee.total;
    const employer = t.employer + r.employer.total;
    return {
      gross: t.gross + r.gross,
      opv: t.opv + r.employee.opv,
      vosms: t.vosms + r.employee.vosms,
      ipn: t.ipn + r.employee.ipn,
      withheld,
      net: t.net + r.net,
      opvr: t.opvr + r.employer.opvr,
      so: t.so + r.employer.so,
      oosms: t.oosms + r.employer.oosms,
      socialTax: t.socialTax + r.employer.socialTax,
      employer,
      toBudget: withheld + employer,
      cost: t.cost + r.cost,
    };
  }, ZERO);
}

export interface CompanyPayroll<Id extends string = string> {
  lines: Array<{ id: Id; result: EmployeeMonthResult }>;
  totals: PayrollTotals;
}

/** Расчёт компании за месяц: по строке на сотрудника + итоги. */
export function calculatePayroll<Id extends string>(
  employees: Array<EmployeeMonthInput & { id: Id }>,
  rates: YearRates,
): CompanyPayroll<Id> {
  const lines = employees.map(({ id, ...input }) => ({
    id,
    result: calculateEmployee(input, rates),
  }));
  return { lines, totals: sumPayroll(lines.map((l) => l.result)) };
}
