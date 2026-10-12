import { ApiError, type JalaqyApi } from "./client";
import type { ApiErrorBody } from "./contracts";

/**
 * HTTP-клиент к бэкенду (FastAPI). Включается переменной JALAQY_API_URL.
 * Пути и методы — контракт для бэкенда; тела и ответы — типы из ./contracts.
 * Авторизация: cookie сессии пробрасывается сервером Next (см. lib/session).
 */
export function createHttpApi(
  baseUrl: string,
  getToken?: () => Promise<string | undefined>,
): JalaqyApi {
  async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await getToken?.();
    const res = await fetch(new URL(path, baseUrl), {
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as ApiErrorBody | null;
      throw new ApiError(err ?? { code: "server", message: res.statusText }, res.status);
    }
    return (res.status === 204 ? undefined : await res.json()) as T;
  }
  const q = (p: Record<string, string | undefined>) => {
    const s = new URLSearchParams(Object.entries(p).filter((e): e is [string, string] => !!e[1]));
    return s.size ? `?${s}` : "";
  };

  return {
    auth: {
      requestCode: (input) => call("POST", "/auth/code", input),
      verifyCode: (input) => call("POST", "/auth/verify", input),
    },
    company: {
      get: () => call("GET", "/company"),
      update: (patch) => call("PATCH", "/company", patch),
      onboard: (input) => call("POST", "/company/onboarding", input),
      users: () => call("GET", "/company/users"),
      inviteUser: (input) => call("POST", "/company/users", input),
      setUserRole: (id, role) => call("PATCH", `/company/users/${id}`, { role }),
    },
    employees: {
      list: () => call("GET", "/employees"),
      get: (id) => call("GET", `/employees/${id}`),
      create: (input) => call("POST", "/employees", input),
      update: (id, patch) => call("PATCH", `/employees/${id}`, patch),
      payslips: (id) => call("GET", `/employees/${id}/payslips`),
      payslip: (id, period) => call("GET", `/employees/${id}/payslips/${period ?? "latest"}`),
      certificates: (id) => call("GET", `/employees/${id}/certificates`),
      requestCertificate: (id, input) => call("POST", `/employees/${id}/certificates`, input),
    },
    payroll: {
      get: (period) => call("GET", `/payroll/${period}`),
      submit: (period) => call("POST", `/payroll/${period}/submit`),
      approve: (period) => call("POST", `/payroll/${period}/approve`),
      export1c: (period) => call("GET", `/payroll/${period}/export/1c`),
    },
    timesheet: {
      get: (period) => call("GET", `/timesheet/${period}`),
      absences: (f = {}) =>
        call("GET", `/absences${q({ employeeId: f.employeeId, status: f.status })}`),
      createAbsence: (input) => call("POST", "/absences", input),
      decideAbsence: (id, decision) => call("POST", `/absences/${id}/decision`, { decision }),
      requestLeave: (input) => call("POST", "/absences/requests", input),
    },
    taxes: {
      payments: (period) => call("GET", `/taxes/${period}/payments`),
      markPaid: (id) => call("POST", `/taxes/payments/${encodeURIComponent(id)}/paid`),
      paymentOrder: (id) => call("GET", `/taxes/payments/${encodeURIComponent(id)}/order`),
      reports: () => call("GET", "/taxes/reports"),
    },
    contracts: {
      list: () => call("GET", "/contracts"),
      templates: () => call("GET", "/contracts/templates"),
    },
  };
}
