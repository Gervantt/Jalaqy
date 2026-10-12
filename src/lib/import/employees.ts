import type { EmployeeInput } from "@/lib/api/contracts";
import { hasErrors, validateEmployeeInput } from "@/lib/validation/forms";
import { parseCsv } from "./csv";

export const EMPLOYEES_CSV_TEMPLATE =
  "﻿ФИО;Должность;Оклад;Дата приёма;ИИН;Вычет\r\n" +
  "Касымов Данияр;Бариста;320000;01.10.2026;;да\r\n";

export interface ImportResult {
  employees: EmployeeInput[];
  /** Номера строк файла (с 1) с ошибками и причина */
  errors: Array<{ line: number; message: string }>;
}

const YES = new Set(["да", "yes", "1", "+", "true", "есть", "иә"]);

/** «01.10.2026» или «2026-10-01» → «2026-10-01». */
function parseDate(value: string): string {
  const v = value.trim();
  const ru = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(v);
  if (ru) return `${ru[3]}-${ru[2]!.padStart(2, "0")}-${ru[1]!.padStart(2, "0")}`;
  return v;
}

/** «Касымов Данияр Ерланович» → фамилия, имя. */
function splitName(full: string): { lastName: string; firstName: string } {
  const [lastName = "", firstName = ""] = full.trim().split(/\s+/);
  return { lastName, firstName };
}

/**
 * Сотрудники из CSV (Excel → «Сохранить как CSV UTF-8»).
 * Колонки: ФИО; Должность; Оклад; Дата приёма; ИИН; Вычет (да/нет). Первая строка-заголовок пропускается.
 */
export function importEmployeesCsv(text: string): ImportResult {
  const rows = parseCsv(text);
  const result: ImportResult = { employees: [], errors: [] };
  rows.forEach((cells, index) => {
    const line = index + 1;
    if (index === 0 && /фио|имя|name/i.test(cells[0] ?? "")) return;
    const [fio = "", position = "", salary = "", hired = "", iin = "", deduction = ""] = cells.map(
      (c) => c.trim(),
    );
    const input: EmployeeInput = {
      ...splitName(fio),
      position,
      salary: Number.parseInt(salary.replace(/\D/g, ""), 10),
      hireDate: parseDate(hired),
      iin: iin.replace(/\D/g, ""),
      hasDeduction: YES.has(deduction.toLowerCase()),
    };
    const errors = validateEmployeeInput(input);
    if (hasErrors(errors)) {
      result.errors.push({ line, message: Object.values(errors).filter(Boolean).join("; ") });
    } else {
      result.employees.push(input);
    }
  });
  return result;
}
