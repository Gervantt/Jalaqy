import type {
  Absence,
  AbsenceInput,
  AbsenceStatus,
  ApiErrorBody,
  Company,
  CompanyUpdate,
  CompanyUser,
  Contract,
  ContractTemplate,
  Employee,
  EmployeeInput,
  EmployeeUpdate,
  InviteUserInput,
  OnboardingInput,
  PayrollRun,
  PayslipSummary,
  Period,
  RequestCodeInput,
  RequestCodeResult,
  Session,
  TaxPayment,
  TaxReport,
  Timesheet,
  VerifyCodeInput,
} from "./contracts";

/**
 * Интерфейс API. Мок (./mock) и HTTP-клиент к FastAPI (./http) реализуют его одинаково:
 * страницы и Server Actions не знают, откуда данные.
 */
export interface JalaqyApi {
  auth: {
    requestCode(input: RequestCodeInput): Promise<RequestCodeResult>;
    verifyCode(input: VerifyCodeInput): Promise<Session>;
  };
  company: {
    get(): Promise<Company>;
    update(patch: CompanyUpdate): Promise<Company>;
    onboard(input: OnboardingInput): Promise<Company>;
    users(): Promise<CompanyUser[]>;
    inviteUser(input: InviteUserInput): Promise<CompanyUser>;
    setUserRole(userId: string, role: CompanyUser["role"]): Promise<CompanyUser>;
  };
  employees: {
    list(): Promise<Employee[]>;
    get(id: string): Promise<Employee>;
    create(input: EmployeeInput): Promise<Employee>;
    update(id: string, patch: EmployeeUpdate): Promise<Employee>;
    payslips(id: string): Promise<PayslipSummary[]>;
  };
  payroll: {
    get(period: Period): Promise<PayrollRun>;
    /** Отправить владельцу на подтверждение */
    submit(period: Period): Promise<PayrollRun>;
    /** Владелец подтверждает выплату */
    approve(period: Period): Promise<PayrollRun>;
    /** Выгрузка для 1С (CSV) */
    export1c(period: Period): Promise<{ filename: string; content: string }>;
  };
  timesheet: {
    get(period: Period): Promise<Timesheet>;
    absences(filter?: { employeeId?: string; status?: AbsenceStatus }): Promise<Absence[]>;
    createAbsence(input: AbsenceInput): Promise<Absence>;
    decideAbsence(id: string, decision: Exclude<AbsenceStatus, "pending">): Promise<Absence>;
  };
  taxes: {
    payments(period: Period): Promise<TaxPayment[]>;
    markPaid(id: string): Promise<TaxPayment>;
    paymentOrder(id: string): Promise<{ filename: string; content: string }>;
    reports(): Promise<TaxReport[]>;
  };
  contracts: {
    list(): Promise<Contract[]>;
    templates(): Promise<ContractTemplate[]>;
  };
}

/** Ошибка, которую бросает любая реализация API. */
export class ApiError extends Error {
  constructor(
    public readonly body: ApiErrorBody,
    public readonly status = 400,
  ) {
    super(body.message);
    this.name = "ApiError";
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}
