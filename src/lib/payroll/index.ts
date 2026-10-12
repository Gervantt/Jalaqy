/**
 * Ядро расчёта зарплаты. Чистый TypeScript, без UI и без I/O.
 * Ставки — src/lib/payroll/rates/<год>.ts, календарь — calendar/<год>.ts.
 */
export { workingDays, isWorkingDay } from "./calendar";
export { calculatePayroll, sumPayroll, type CompanyPayroll } from "./company";
export { calculateEmployee, calculateYear } from "./employee";
export { ipnHighThreshold, monthlyIpn, progressiveIpn } from "./ipn";
export { prorateSalary } from "./prorate";
export { getRates, rates2026, supportedYears } from "./rates";
export { applyRate, clamp, percent, roundTenge } from "./round";
export * from "./types";
