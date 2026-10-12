import { interpolate, t } from "@/i18n";
import { formatDate } from "@/lib/format/date";
import { parsePeriod, periodEnd, quarterOf } from "@/lib/period";
import { workingDays } from "@/lib/payroll";
import { parseLoginContact } from "@/lib/validation/contact";
import {
  hasErrors,
  validateAbsenceInput,
  validateCompany,
  validateEmployeeInput,
} from "@/lib/validation/forms";
import { ApiError, type JalaqyApi } from "../client";
import type {
  Absence,
  Employee,
  EmployeeInput,
  Period,
  Session,
  TaxKind,
  TaxPayment,
  Timesheet,
} from "../contracts";
import { clone, findEmployee, latency, notFound, now, v, validation } from "./core";
import { getDb, nextId } from "./db";
import { buildPayrollRun, isEmployedIn, payslips, taxDueDate } from "./payroll";
import { self } from "./self";
import { CURRENT_PERIOD } from "./seed";

function makeEmployee(input: EmployeeInput): Employee {
  const errors = validateEmployeeInput(input);
  if (hasErrors(errors)) validation(errors);
  return {
    id: nextId("emp"),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    shortName: `${input.firstName.trim()} ${input.lastName.trim().charAt(0)}.`,
    position: input.position.trim(),
    salary: input.salary,
    salaryHistory: [{ from: input.hireDate, salary: input.salary }],
    hireDate: input.hireDate,
    hasDeduction: input.hasDeduction,
    iin: input.iin,
    phone: input.phone ?? "",
    status: "active",
    vacationDaysLeft: 24,
  };
}

const TAX_KINDS: Array<{ kind: TaxKind; payer: TaxPayment["payer"] }> = [
  { kind: "ipn", payer: "employee" },
  { kind: "opv", payer: "employee" },
  { kind: "vosms", payer: "employee" },
  { kind: "opvr", payer: "employer" },
  { kind: "so", payer: "employer" },
  { kind: "oosms", payer: "employer" },
  { kind: "socialTax", payer: "employer" },
];

function taxPayments(period: Period): TaxPayment[] {
  const db = getDb();
  const { totals } = buildPayrollRun(db, period);
  const closed = db.payrollStatus[period] === "closed";
  return TAX_KINDS.map(({ kind, payer }) => {
    const id = `${period}:${kind}`;
    const paidAt = db.paidTaxes[id] ?? (closed ? `${taxDueDate(period)}T09:00:00Z` : undefined);
    return {
      id,
      period,
      kind,
      payer,
      amount: totals[kind],
      dueDate: taxDueDate(period),
      status: paidAt ? "paid" : "unpaid",
      paidAt,
    };
  });
}

function csv(rows: Array<Array<string | number>>): string {
  const cell = (c: string | number) => {
    const s = String(c);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // BOM — чтобы Excel и 1С открыли UTF-8 без кракозябр
  return "﻿" + rows.map((r) => r.map(cell).join(";")).join("\r\n");
}

export const mockApi: JalaqyApi = {
  auth: {
    async requestCode({ contact }) {
      await latency();
      const parsed = parseLoginContact(contact);
      if (!parsed) validation({ contact: v.contact });
      return { channel: parsed.kind === "email" ? "email" : "sms", resendInSec: 60 };
    },
    async verifyCode({ contact, code, demoRole = "accountant" }) {
      await latency();
      const parsed = parseLoginContact(contact);
      if (!parsed) validation({ contact: v.contact });
      if (!/^\d{4}$/.test(code)) validation({ code: v.code });
      // В моке подходит любой код, кроме 0000 — им проверяем экран ошибки
      if (code === "0000") validation({ code: v.codeWrong });
      const db = getDb();
      const user =
        demoRole === "owner"
          ? db.users.find((u) => u.role === "owner")
          : db.users.find((u) => u.role === "accountant" && u.status === "active");
      const session: Session =
        demoRole === "employee"
          ? {
              userId: "u-daniyar",
              role: "employee",
              name: "Данияр К.",
              companyId: db.company.id,
              employeeId: "daniyar",
            }
          : { userId: user!.id, role: demoRole, name: user!.name, companyId: db.company.id };
      return session;
    },
  },

  company: {
    async get() {
      await latency();
      return clone(getDb().company);
    },
    async update(patch) {
      await latency();
      const errors = validateCompany(patch);
      if (hasErrors(errors)) validation(errors);
      const db = getDb();
      db.company = { ...db.company, ...patch };
      return clone(db.company);
    },
    async onboard(input) {
      await latency();
      const errors = validateCompany(input.company);
      if (hasErrors(errors)) validation(errors);
      const created = input.employees.map(makeEmployee);
      const db = getDb();
      db.company = { ...db.company, ...input.company, onboarded: true };
      db.employees.push(...created);
      return clone(db.company);
    },
    async users() {
      await latency();
      return clone(getDb().users);
    },
    async inviteUser(input) {
      await latency();
      const errors: Record<string, string> = {};
      if (!input.name.trim()) errors.name = v.name;
      if (!parseLoginContact(input.contact)) errors.contact = v.contact;
      if (Object.keys(errors).length) validation(errors);
      const user = { id: nextId("u"), ...input, status: "invited" as const };
      getDb().users.push(user);
      return clone(user);
    },
    async setUserRole(userId, role) {
      await latency();
      const user = getDb().users.find((u) => u.id === userId) ?? notFound();
      user.role = role;
      return clone(user);
    },
  },

  employees: {
    async list() {
      await latency();
      return clone(getDb().employees.filter((e) => e.status !== "dismissed"));
    },
    async get(id) {
      await latency();
      return clone(findEmployee(id));
    },
    async create(input) {
      await latency();
      const employee = makeEmployee(input);
      getDb().employees.push(employee);
      return clone(employee);
    },
    async update(id, patch) {
      await latency();
      const e = findEmployee(id);
      const errors = validateEmployeeInput({
        ...e,
        position: patch.position ?? e.position,
        salary: patch.salary ?? e.salary,
        phone: patch.phone ?? e.phone,
      });
      if (hasErrors(errors)) validation(errors);
      if (patch.salary !== undefined && patch.salary !== e.salary) {
        const from = patch.salaryFrom ?? `${CURRENT_PERIOD}-01`;
        e.salaryHistory = [
          ...e.salaryHistory.filter((h) => h.from < from),
          { from, salary: patch.salary },
        ];
        e.salary = patch.salary;
      }
      if (patch.position !== undefined) e.position = patch.position.trim();
      if (patch.hasDeduction !== undefined) e.hasDeduction = patch.hasDeduction;
      if (patch.phone !== undefined) e.phone = patch.phone;
      return clone(e);
    },
    async payslips(id) {
      await latency();
      return payslips(getDb(), findEmployee(id), CURRENT_PERIOD);
    },
    payslip: self.payslip,
    certificates: self.certificates,
    requestCertificate: self.requestCertificate,
  },

  payroll: {
    async get(period) {
      await latency();
      parsePeriod(period);
      return buildPayrollRun(getDb(), period);
    },
    async submit(period) {
      await latency();
      const db = getDb();
      if (db.payrollStatus[period] !== "calculated") {
        throw new ApiError({ code: "conflict", message: t.ui.conflict }, 409);
      }
      db.payrollStatus[period] = "awaiting_approval";
      db.payrollTimestamps[period] = { ...db.payrollTimestamps[period], submittedAt: now() };
      return buildPayrollRun(db, period);
    },
    async approve(period) {
      await latency();
      const db = getDb();
      const status = db.payrollStatus[period];
      if (status !== "awaiting_approval" && status !== "calculated") {
        throw new ApiError({ code: "conflict", message: t.ui.conflict }, 409);
      }
      db.payrollStatus[period] = "approved";
      db.payrollTimestamps[period] = { ...db.payrollTimestamps[period], approvedAt: now() };
      return buildPayrollRun(db, period);
    },
    async export1c(period) {
      await latency();
      const db = getDb();
      const run = buildPayrollRun(db, period);
      const iin = new Map(db.employees.map((e) => [e.id, e.iin]));
      const rows: Array<Array<string | number>> = [
        [
          "ИИН",
          "Сотрудник",
          "Должность",
          "Начислено",
          "ОПВ",
          "ВОСМС",
          "ИПН",
          "К выплате",
          "ОПВР",
          "СО",
          "ООСМС",
          "Соцналог",
        ],
        ...run.lines.map((l) => [
          iin.get(l.employeeId) ?? "",
          l.shortName,
          l.position,
          l.gross,
          l.employee.opv,
          l.employee.vosms,
          l.employee.ipn,
          l.net,
          l.employer.opvr,
          l.employer.so,
          l.employer.oosms,
          l.employer.socialTax,
        ]),
      ];
      return { filename: `jalaqy-${period}-1c.csv`, content: csv(rows) };
    },
  },

  timesheet: {
    async get(period) {
      await latency();
      const db = getDb();
      const { year, monthIndex } = parsePeriod(period);
      const last = Number(periodEnd(period).slice(8));
      const days = Array.from({ length: last }, (_, i) => {
        const date = `${period}-${String(i + 1).padStart(2, "0")}`;
        const weekday = new Date(year, monthIndex, i + 1).getDay();
        const working = workingDays(year, monthIndex, i + 1, i + 1) === 1;
        return { date, working, holiday: !working && weekday !== 0 && weekday !== 6 };
      });
      const run = buildPayrollRun(db, period);
      const start = `${period}-01`;
      const end = periodEnd(period);
      const timesheet: Timesheet = {
        period,
        normDays: workingDays(year, monthIndex),
        days,
        absences: clone(
          db.absences.filter((a) => a.from <= end && a.to >= start && a.status !== "rejected"),
        ),
        worked: run.lines.map((l) => ({ employeeId: l.employeeId, workedDays: l.workedDays })),
      };
      return timesheet;
    },
    requestLeave: self.requestLeave,
    async absences(filter = {}) {
      await latency();
      return clone(
        getDb()
          .absences.filter(
            (a) =>
              (!filter.employeeId || a.employeeId === filter.employeeId) &&
              (!filter.status || a.status === filter.status),
          )
          .sort((a, b) => b.from.localeCompare(a.from)),
      );
    },
    async createAbsence(input) {
      await latency();
      const errors = validateAbsenceInput(input);
      if (hasErrors(errors)) validation(errors);
      const employee = findEmployee(input.employeeId);
      if (!isEmployedIn(employee, input.from.slice(0, 7))) validation({ from: v.date });
      const absence: Absence = {
        id: nextId("abs"),
        ...input,
        // бухгалтер отмечает факт — сразу одобрено
        status: "approved",
        requestedAt: now(),
      };
      getDb().absences.push(absence);
      return clone(absence);
    },
    async decideAbsence(id, decision) {
      await latency();
      const db = getDb();
      const absence = db.absences.find((a) => a.id === id) ?? notFound();
      if (absence.status !== "pending") {
        throw new ApiError({ code: "conflict", message: t.ui.conflict }, 409);
      }
      if (decision === "approved" && absence.type === "vacation") {
        const employee = findEmployee(absence.employeeId);
        // отпуск в РК считается в календарных днях
        const days =
          Math.round((Date.parse(absence.to) - Date.parse(absence.from)) / 86_400_000) + 1;
        if (days > employee.vacationDaysLeft) {
          validation({
            decision: interpolate(v.vacationLimit, { days: employee.vacationDaysLeft }),
          });
        }
        employee.vacationDaysLeft -= days;
      }
      absence.status = decision;
      return clone(absence);
    },
  },

  taxes: {
    async payments(period) {
      await latency();
      parsePeriod(period);
      return taxPayments(period);
    },
    async markPaid(id) {
      await latency();
      const [period = "", kind] = id.split(":");
      const payment = taxPayments(period).find((p) => p.kind === kind) ?? notFound();
      const db = getDb();
      db.paidTaxes[id] = now();
      if (
        taxPayments(period).every((p) => p.status === "paid") &&
        db.payrollStatus[period] === "paid"
      ) {
        db.payrollStatus[period] = "closed";
      }
      return { ...payment, status: "paid", paidAt: db.paidTaxes[id] };
    },
    async paymentOrder(id) {
      await latency();
      const [period = "", kind = ""] = id.split(":");
      const payment = taxPayments(period).find((p) => p.kind === kind) ?? notFound();
      const db = getDb();
      const [short, long] = t.domain.taxKinds[payment.kind];
      const content = [
        "ПЛАТЁЖНОЕ ПОРУЧЕНИЕ — ЧЕРНОВИК (демо)",
        `Плательщик: ${db.company.name}, БИН ${db.company.bin}`,
        `Платёж: ${short} — ${long}`,
        `Период: ${formatDate(`${period}-01`, "monthYear")}`,
        `Сумма: ${payment.amount} ₸`,
        `Срок уплаты: ${formatDate(payment.dueDate)}`,
        `Квартал отчётности: ${quarterOf(period)}`,
      ].join("\r\n");
      return { filename: `jalaqy-${period}-${kind}.txt`, content };
    },
    async reports() {
      await latency();
      return clone(getDb().reports);
    },
  },

  contracts: {
    async list() {
      await latency();
      return clone(getDb().contracts);
    },
    async templates() {
      await latency();
      return [
        { id: "tpl-employment", kind: "employment", available: false },
        { id: "tpl-salary", kind: "salary_change", available: false },
        { id: "tpl-vacation", kind: "vacation_order", available: false },
      ];
    },
  },
};
