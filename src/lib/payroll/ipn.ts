import { roundTenge } from "./round";
import type { YearRates } from "./types";

const bp = (rate: number) => Math.round(rate * 10_000);

/** Порог повышенной ставки ИПН за год, ₸ (8 500 МРП). */
export function ipnHighThreshold(rates: YearRates): number {
  return rates.ipn.highThresholdMrp * rates.mrp;
}

/**
 * ИПН на облагаемую базу с начала года (без округления):
 * 10% до порога 8 500 МРП и 15% с превышения.
 */
export function progressiveIpn(yearBase: number, rates: YearRates): number {
  const threshold = ipnHighThreshold(rates);
  const low = Math.min(yearBase, threshold);
  const high = Math.max(0, yearBase - threshold);
  return (low * bp(rates.ipn.rate) + high * bp(rates.ipn.highRate)) / 10_000;
}

/**
 * ИПН за месяц нарастающим итогом: налог на базу с начала года (с округлением)
 * минус уже удержанный. Так годовая сумма совпадает с законом до тенге,
 * а копеечные округления не накапливаются.
 */
export function monthlyIpn(
  monthBase: number,
  ytdBase: number,
  ytdIpn: number,
  rates: YearRates,
): number {
  const due = roundTenge(progressiveIpn(ytdBase + monthBase, rates));
  return Math.max(0, due - ytdIpn);
}
