import type { Role, Session } from "@/lib/api/contracts";

export const SESSION_COOKIE = "jalaqy_session";

const ROLES: Role[] = ["accountant", "owner", "employee"];

/**
 * Мок-сессия: JSON в base64url без подписи. На бэкенде её заменит
 * подписанный токен (httpOnly cookie), а этот модуль — проверка подписи.
 */
export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    const s = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<Session>;
    if (!s.userId || !s.companyId || !s.name || !s.role || !ROLES.includes(s.role)) return null;
    return s as Session;
  } catch {
    return null;
  }
}

/** Куда вести после входа. */
export function homeFor(role: Role): string {
  if (role === "owner") return "/owner";
  if (role === "employee") return "/me";
  return "/app/payroll";
}

/** Кому какие разделы доступны. */
export function canAccess(role: Role, pathname: string): boolean {
  if (pathname.startsWith("/app")) {
    return role === "accountant" || role === "owner";
  }
  if (pathname.startsWith("/owner")) return role === "owner";
  if (pathname.startsWith("/me")) return role === "employee";
  return true;
}

/** Безопасный внутренний путь для ?next= (никаких //evil.com). */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\"))
    return null;
  return next;
}
