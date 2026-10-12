/** Ставки и пределы одного года. Формулы читают только этот объект. */
export interface YearRates {
  year: number;
  /** Минимальная заработная плата, ₸ */
  mzp: number;
  /** Месячный расчётный показатель, ₸ */
  mrp: number;

  /** ОПВ — обязательные пенсионные взносы (за счёт сотрудника) */
  opv: { rate: number; maxMzp: number };
  /** ВОСМС — взносы на медстрахование (за счёт сотрудника) */
  vosms: { rate: number; maxMzp: number };
  /** ИПН — индивидуальный подоходный налог */
  ipn: {
    rate: number;
    /** Повышенная ставка для годового дохода сверх порога */
    highRate: number;
    /** Порог годового облагаемого дохода, в МРП */
    highThresholdMrp: number;
    /** Стандартный вычет по заявлению сотрудника, в МРП в месяц */
    deductionMrp: number;
  };

  /** ОПВР — пенсионные взносы работодателя */
  opvr: { rate: number; minMzp: number; maxMzp: number };
  /** СО — социальные отчисления */
  so: { rate: number; minMzp: number; maxMzp: number };
  /** ООСМС — отчисления на медстрахование */
  oosms: { rate: number; maxMzp: number };
  /** Социальный налог */
  socialTax: { rate: number; minMrp: number };
}

/** Начисления за месяц, нарастающим итогом с начала года — до текущего месяца. */
export interface YearToDate {
  /** Начислено (gross) */
  income: number;
  /** Облагаемая база ИПН (после ОПВ, ВОСМС, вычета) */
  ipnBase: number;
  /** Удержанный ИПН */
  ipn: number;
}

export const EMPTY_YTD: YearToDate = Object.freeze({ income: 0, ipnBase: 0, ipn: 0 });

export interface EmployeeMonthInput {
  /** Начислено за месяц, ₸ (оклад за отработанное время + премии) — целое, ≥ 0 */
  gross: number;
  /** Есть заявление на вычет 30 МРП */
  hasDeduction: boolean;
  /** Накопленное с начала года до этого месяца; по умолчанию — с нуля */
  ytd?: YearToDate;
}

export interface EmployeeDeductions {
  opv: number;
  vosms: number;
  ipn: number;
  /** ОПВ + ВОСМС + ИПН */
  total: number;
}

export interface EmployerContributions {
  opvr: number;
  so: number;
  oosms: number;
  socialTax: number;
  /** ОПВР + СО + ООСМС + соцналог */
  total: number;
}

/** Базы, от которых считались платежи — для пояснений в интерфейсе и проверки бухгалтером. */
export interface PayrollBases {
  opv: number;
  vosms: number;
  /** Вычет, применённый в этом месяце */
  deduction: number;
  ipn: number;
  opvr: number;
  so: number;
  oosms: number;
  socialTax: number;
}

export interface EmployeeMonthResult {
  gross: number;
  employee: EmployeeDeductions;
  employer: EmployerContributions;
  /** На руки = начислено − удержания */
  net: number;
  /** Стоимость для компании = начислено + взносы работодателя */
  cost: number;
  bases: PayrollBases;
  /** Накопленное с начала года после этого месяца — вход для следующего */
  ytdAfter: YearToDate;
}

export interface PayrollTotals {
  /** Фонд оплаты труда (начислено) */
  gross: number;
  opv: number;
  vosms: number;
  ipn: number;
  /** Удержано с сотрудников */
  withheld: number;
  /** К выплате сотрудникам */
  net: number;
  opvr: number;
  so: number;
  oosms: number;
  socialTax: number;
  /** За счёт компании */
  employer: number;
  /** В бюджет = удержано + за счёт компании */
  toBudget: number;
  /** Полная стоимость ФОТ = фонд + за счёт компании */
  cost: number;
}
