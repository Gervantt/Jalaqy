import { roundTenge } from "./round";

/**
 * Оклад за неполный месяц: оклад × отработанные дни / рабочие дни по календарю.
 * Пятидневка; сменные графики и часовая оплата — отдельная задача.
 */
export function prorateSalary(monthlySalary: number, workedDays: number, normDays: number): number {
  if (!Number.isInteger(monthlySalary) || monthlySalary < 0) {
    throw new RangeError(`prorateSalary: оклад должен быть целым ≥ 0, получено ${monthlySalary}`);
  }
  if (!Number.isInteger(normDays) || normDays <= 0) {
    throw new RangeError(`prorateSalary: норма дней должна быть > 0, получено ${normDays}`);
  }
  if (!Number.isInteger(workedDays) || workedDays < 0 || workedDays > normDays) {
    throw new RangeError(`prorateSalary: отработано ${workedDays} из ${normDays}`);
  }
  if (workedDays === normDays) return monthlySalary;
  return roundTenge((monthlySalary * workedDays) / normDays);
}
