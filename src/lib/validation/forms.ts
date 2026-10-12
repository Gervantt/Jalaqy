import type { AbsenceInput, CompanyUpdate, EmployeeInput } from "@/lib/api/contracts";
import { interpolate, t } from "@/i18n";
import { formatTenge } from "@/lib/format/tenge";
import { getRates } from "@/lib/payroll";
import { normalizeKzPhone } from "./contact";
import { isValidIinBin } from "./iin";

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

const v = t.domain.validation;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MAX_SALARY = 100_000_000;

const blank = (s: string | undefined) => !s || s.trim() === "";

export function validateEmployeeInput(
  input: Partial<EmployeeInput>,
): FieldErrors<keyof EmployeeInput> {
  const errors: FieldErrors<keyof EmployeeInput> = {};
  if (blank(input.firstName)) errors.firstName = v.required;
  if (blank(input.lastName)) errors.lastName = v.required;
  if (blank(input.position)) errors.position = v.required;
  if (!input.hireDate || !ISO.test(input.hireDate)) errors.hireDate = v.date;
  if (!input.iin || !isValidIinBin(input.iin)) errors.iin = v.iin;
  if (input.phone && !normalizeKzPhone(input.phone)) errors.phone = v.phone;

  const year =
    input.hireDate && ISO.test(input.hireDate) ? Number(input.hireDate.slice(0, 4)) : 2026;
  const mzp = getRates(Math.max(2026, year)).mzp;
  if (input.salary === undefined || input.salary === null || Number.isNaN(input.salary)) {
    errors.salary = v.required;
  } else if (input.salary < mzp) {
    errors.salary = interpolate(v.salaryMin, { mzp: formatTenge(mzp) });
  } else if (input.salary > MAX_SALARY) {
    errors.salary = v.salaryMax;
  }
  return errors;
}

export function validateAbsenceInput(
  input: Partial<AbsenceInput>,
): FieldErrors<keyof AbsenceInput> {
  const errors: FieldErrors<keyof AbsenceInput> = {};
  if (blank(input.employeeId)) errors.employeeId = v.required;
  if (!input.type) errors.type = v.required;
  if (!input.from || !ISO.test(input.from)) errors.from = v.date;
  if (!input.to || !ISO.test(input.to)) errors.to = v.date;
  if (!errors.from && !errors.to && input.to! < input.from!) errors.to = v.dateOrder;
  return errors;
}

export function validateCompany(input: CompanyUpdate): FieldErrors<keyof CompanyUpdate> {
  const errors: FieldErrors<keyof CompanyUpdate> = {};
  if (input.name !== undefined && blank(input.name)) errors.name = v.required;
  if (input.bin !== undefined && !isValidIinBin(input.bin)) errors.bin = v.bin;
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
