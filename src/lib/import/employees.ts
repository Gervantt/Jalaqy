import type { EmployeeInput } from "@/lib/api/contracts";
import { t } from "@/i18n";
import { hasErrors, validateEmployeeInput } from "@/lib/validation/forms";
import { parseCsv } from "./csv";

const imp = t.documents.importCsv;

export const EMPLOYEES_CSV_TEMPLATE = `\uFEFF${imp.header}\r\n${imp.example}\r\n`;

export interface ImportResult {
  employees: EmployeeInput[];
  /** Номера строк файла (с 1) с ошибками и причина */
  errors: Array<{ line: number; message: string }>;
}

const YES = new Set<string>(imp.yes);

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
    const first = (cells[0] ?? "").trim().toLowerCase();
    if (index === 0 && imp.headerWords.some((w) => first.includes(w))) return;
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
