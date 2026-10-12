/**
 * ИИН/БИН Казахстана: 12 цифр, последняя — контрольная.
 * Контрольная цифра: сумма цифр 1–11 с весами 1…11 по модулю 11;
 * если вышло 10 — веса 3…11, 1, 2; если снова 10 — номер недействителен.
 */
const W1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const W2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];

function weighted(digits: number[], weights: number[]): number {
  return digits.reduce((sum, d, i) => sum + d * (weights[i] ?? 0), 0) % 11;
}

/** Контрольная цифра по первым 11 цифрам; null — такой номер не бывает. */
export function iinCheckDigit(first11: string): number | null {
  if (!/^\d{11}$/.test(first11)) return null;
  const digits = [...first11].map(Number);
  let check = weighted(digits, W1);
  if (check === 10) check = weighted(digits, W2);
  return check === 10 ? null : check;
}

/** Проверка ИИН или БИН (формат и контрольная цифра). */
export function isValidIinBin(value: string): boolean {
  const v = value.replace(/\s/g, "");
  if (!/^\d{12}$/.test(v)) return false;
  return iinCheckDigit(v.slice(0, 11)) === Number(v[11]);
}

/** «900315450123» → «•••••••• 0123» — ИИН на экране не показываем целиком. */
export function maskIin(value: string): string {
  return `•••••••• ${value.slice(-4)}`;
}
