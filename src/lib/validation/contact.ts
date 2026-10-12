/** Казахстанский мобильный: +7 7XX XXX XX XX (допускаются 8 и пробелы/скобки/дефисы). */
export function normalizeKzPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let national: string | null = null;
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    national = digits.slice(1);
  } else if (digits.length === 10) {
    national = digits;
  }
  if (!national || !national.startsWith("7")) return null;
  return `+7${national}`;
}

/** «+77011234514» → «+7 701 123 45 14». */
export function formatKzPhone(e164: string): string {
  const d = e164.replace(/\D/g, "").slice(1);
  return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(input: string): boolean {
  return EMAIL.test(input.trim());
}

/** Telegram-ник: @ + 5–32 символа латиницы, цифр, «_». */
export function normalizeTelegram(input: string): string | null {
  const v = input.trim().replace(/^https?:\/\/t\.me\//i, "");
  const nick = v.startsWith("@") ? v.slice(1) : v;
  return /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(nick) ? `@${nick}` : null;
}

export type Contact = { kind: "phone"; value: string } | { kind: "email"; value: string };

/** Телефон или email для входа. */
export function parseLoginContact(input: string): Contact | null {
  const trimmed = input.trim();
  if (trimmed.includes("@")) {
    return isEmail(trimmed) ? { kind: "email", value: trimmed.toLowerCase() } : null;
  }
  const phone = normalizeKzPhone(trimmed);
  return phone ? { kind: "phone", value: phone } : null;
}
