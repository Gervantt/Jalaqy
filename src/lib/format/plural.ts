/** Формы слова: [1 сотрудник, 2 сотрудника, 5 сотрудников]. */
export type PluralForms = readonly [one: string, few: string, many: string];

/** Русское склонение по числу: 1, 21 → one; 2–4, 22–24 → few; остальное → many. */
export function pluralize(n: number, forms: PluralForms): string {
  const abs = Math.abs(Math.trunc(n));
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/** «6 сотрудников». */
export function formatCount(n: number, forms: PluralForms): string {
  return `${n} ${pluralize(n, forms)}`;
}
