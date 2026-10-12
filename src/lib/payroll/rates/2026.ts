import type { YearRates } from "../types";

/**
 * Ставки 2026 года. Источник — постановка задачи и design/Landing.dc.html.
 * ВАЖНО: сверить с практикующим бухгалтером и действующей редакцией Налогового кодекса РК.
 */
export const rates2026: YearRates = {
  year: 2026,
  mzp: 85_000,
  mrp: 4_325,

  opv: { rate: 0.1, maxMzp: 50 },
  vosms: { rate: 0.02, maxMzp: 20 },
  ipn: { rate: 0.1, highRate: 0.15, highThresholdMrp: 8_500, deductionMrp: 30 },

  opvr: { rate: 0.035, minMzp: 1, maxMzp: 50 },
  so: { rate: 0.05, minMzp: 1, maxMzp: 7 },
  oosms: { rate: 0.03, maxMzp: 40 },
  socialTax: { rate: 0.06, minMrp: 14 },
};
