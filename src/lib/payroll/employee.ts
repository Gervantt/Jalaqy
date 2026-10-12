import { monthlyIpn } from "./ipn";
import { clamp, percent } from "./round";
import {
  EMPTY_YTD,
  type EmployeeMonthInput,
  type EmployeeMonthResult,
  type YearRates,
} from "./types";

function assertAmount(name: string, value: number) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name}: ожидалось целое число тенге ≥ 0, получено ${value}`);
  }
}

/**
 * Расчёт одного сотрудника за месяц.
 *
 * За счёт сотрудника:
 *   ОПВ    = 10% × min(начислено, 50 МЗП)
 *   ВОСМС  = 2% × min(начислено, 20 МЗП)
 *   ИПН    = 10% × max(0, начислено − ОПВ − ВОСМС − вычет), 15% сверх 8 500 МРП за год
 *   На руки = начислено − ОПВ − ВОСМС − ИПН
 * За счёт работодателя:
 *   ОПВР      = 3,5% × clamp(начислено, 1 МЗП, 50 МЗП)
 *   СО        = 5% × clamp(начислено − ОПВ, 1 МЗП, 7 МЗП)
 *   ООСМС     = 3% × min(начислено, 40 МЗП)
 *   Соцналог  = 6% × max(начислено − ОПВ − ВОСМС, 14 МРП)
 * Каждый платёж округляется до тенге отдельно (roundTenge).
 * Если начислено 0 (весь месяц без содержания) — все платежи 0.
 */
export function calculateEmployee(
  input: EmployeeMonthInput,
  rates: YearRates,
): EmployeeMonthResult {
  const { gross, hasDeduction } = input;
  const ytd = input.ytd ?? EMPTY_YTD;
  assertAmount("gross", gross);
  assertAmount("ytd.income", ytd.income);
  assertAmount("ytd.ipnBase", ytd.ipnBase);
  assertAmount("ytd.ipn", ytd.ipn);

  const { mzp, mrp } = rates;

  if (gross === 0) {
    const zero = { opv: 0, vosms: 0, deduction: 0, ipn: 0, opvr: 0, so: 0, oosms: 0, socialTax: 0 };
    return {
      gross: 0,
      employee: { opv: 0, vosms: 0, ipn: 0, total: 0 },
      employer: { opvr: 0, so: 0, oosms: 0, socialTax: 0, total: 0 },
      net: 0,
      cost: 0,
      bases: zero,
      ytdAfter: { ...ytd },
    };
  }

  // Сотрудник
  const opvBase = Math.min(gross, rates.opv.maxMzp * mzp);
  const opv = percent(opvBase, rates.opv.rate);

  const vosmsBase = Math.min(gross, rates.vosms.maxMzp * mzp);
  const vosms = percent(vosmsBase, rates.vosms.rate);

  const deductionLimit = hasDeduction ? rates.ipn.deductionMrp * mrp : 0;
  const beforeDeduction = Math.max(0, gross - opv - vosms);
  const deduction = Math.min(deductionLimit, beforeDeduction);
  const ipnBase = beforeDeduction - deduction;
  const ipn = monthlyIpn(ipnBase, ytd.ipnBase, ytd.ipn, rates);

  const withheld = opv + vosms + ipn;
  const net = gross - withheld;

  // Работодатель
  const opvrBase = clamp(gross, rates.opvr.minMzp * mzp, rates.opvr.maxMzp * mzp);
  const opvr = percent(opvrBase, rates.opvr.rate);

  const soBase = clamp(gross - opv, rates.so.minMzp * mzp, rates.so.maxMzp * mzp);
  const so = percent(soBase, rates.so.rate);

  const oosmsBase = Math.min(gross, rates.oosms.maxMzp * mzp);
  const oosms = percent(oosmsBase, rates.oosms.rate);

  const socialTaxBase = Math.max(gross - opv - vosms, rates.socialTax.minMrp * mrp);
  const socialTax = percent(socialTaxBase, rates.socialTax.rate);

  const employerTotal = opvr + so + oosms + socialTax;

  return {
    gross,
    employee: { opv, vosms, ipn, total: withheld },
    employer: { opvr, so, oosms, socialTax, total: employerTotal },
    net,
    cost: gross + employerTotal,
    bases: {
      opv: opvBase,
      vosms: vosmsBase,
      deduction,
      ipn: ipnBase,
      opvr: opvrBase,
      so: soBase,
      oosms: oosmsBase,
      socialTax: socialTaxBase,
    },
    ytdAfter: {
      income: ytd.income + gross,
      ipnBase: ytd.ipnBase + ipnBase,
      ipn: ytd.ipn + ipn,
    },
  };
}

/**
 * Год помесячно: результат каждого месяца передаёт накопленное в следующий.
 * Удобно для проверки порога 15% и для пересчёта истории.
 */
export function calculateYear(
  months: Array<Omit<EmployeeMonthInput, "ytd">>,
  rates: YearRates,
): EmployeeMonthResult[] {
  let ytd = EMPTY_YTD;
  return months.map((m) => {
    const result = calculateEmployee({ ...m, ytd }, rates);
    ytd = result.ytdAfter;
    return result;
  });
}
