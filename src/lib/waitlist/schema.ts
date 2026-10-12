import { t } from "@/i18n";
import { normalizeKzPhone, normalizeTelegram } from "@/lib/validation/contact";

const e = t.landing.waitlist.errors;

/** Текст согласия сохраняется вместе с заявкой — какую именно формулировку принял человек. */
export const CONSENT_TEXT = `${t.landing.waitlist.consentBefore}${t.landing.waitlist.consentLink}`;
export const CONSENT_VERSION = "2026-10-draft";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

/** То, что приходит от формы. */
export interface WaitlistInput {
  name: string;
  contact: string;
  employees: string | number;
  role: string;
  consent: boolean;
  /** honeypot: люди его не видят и не заполняют */
  website?: string;
  utm?: Partial<Record<UtmKey, string>>;
  referrer?: string;
}

/** То, что сохраняем. */
export interface WaitlistEntry {
  id: string;
  createdAt: string;
  name: string;
  contact: { kind: "phone" | "telegram"; value: string };
  employees: number;
  role: "owner" | "accountant";
  consent: { accepted: true; text: string; version: string; at: string };
  utm: Partial<Record<UtmKey, string>>;
  /** Откуда пришли: Threads / Instagram / Telegram / прочее — по UTM и referrer */
  source: string;
  referrer?: string;
}

export type WaitlistErrors = Partial<
  Record<"name" | "contact" | "employees" | "role" | "consent", string>
>;

const clip = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export function parseContact(raw: string): WaitlistEntry["contact"] | null {
  const phone = normalizeKzPhone(raw);
  if (phone) return { kind: "phone", value: phone };
  const tg = normalizeTelegram(raw);
  return tg ? { kind: "telegram", value: tg } : null;
}

/** Определяем канал по UTM и referrer. */
export function detectSource(utm: Partial<Record<UtmKey, string>>, referrer?: string): string {
  const hay = `${utm.utm_source ?? ""} ${utm.ref ?? ""} ${referrer ?? ""}`.toLowerCase();
  if (hay.includes("threads")) return "threads";
  if (hay.includes("instagram") || /(^|\W)ig(\W|$)/.test(hay)) return "instagram";
  if (hay.includes("telegram") || hay.includes("t.me")) return "telegram";
  return utm.utm_source ? clip(utm.utm_source, 40) : referrer ? "referral" : "direct";
}

export type ValidationResult =
  | { ok: true; data: Omit<WaitlistEntry, "id" | "createdAt" | "consent"> }
  | { ok: false; errors: WaitlistErrors };

/** Одна проверка для клиента и сервера. */
export function validateWaitlist(input: Partial<WaitlistInput>): ValidationResult {
  const errors: WaitlistErrors = {};
  const name = clip(input.name, 80);
  if (name.length < 2) errors.name = e.name;

  const contact = parseContact(clip(input.contact, 64));
  if (!contact) errors.contact = e.contact;

  const employees = Number(String(input.employees ?? "").replace(/\s/g, ""));
  if (!Number.isInteger(employees) || employees < 1 || employees > 1000)
    errors.employees = e.employees;

  const role = input.role === "owner" || input.role === "accountant" ? input.role : null;
  if (!role) errors.role = e.role;

  if (input.consent !== true) errors.consent = e.consent;

  if (Object.keys(errors).length) return { ok: false, errors };

  const utm: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const v = clip(input.utm?.[key], 120);
    if (v) utm[key] = v;
  }
  const referrer = clip(input.referrer, 300) || undefined;
  return {
    ok: true,
    data: {
      name,
      contact: contact!,
      employees,
      role: role!,
      utm,
      referrer,
      source: detectSource(utm, referrer),
    },
  };
}
