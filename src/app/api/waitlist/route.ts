import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { t } from "@/i18n";
import { createRateLimiter } from "@/lib/waitlist/rate-limit";
import { createJsonFileRepository, waitlistFile } from "@/lib/waitlist/repository";
import {
  CONSENT_TEXT,
  CONSENT_VERSION,
  validateWaitlist,
  type WaitlistInput,
} from "@/lib/waitlist/schema";

const repository = createJsonFileRepository(waitlistFile());
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

function clientIp(request: NextRequest): string {
  // за nginx: X-Real-IP или первый адрес из X-Forwarded-For
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Лист ожидания. Данные остаются на нашем сервере: ни сторонних форм, ни мессенджеров.
 * 200 { ok } · 422 { errors } · 429 · 400 — неверное тело.
 */
export async function POST(request: NextRequest) {
  let input: Partial<WaitlistInput>;
  try {
    input = (await request.json()) as Partial<WaitlistInput>;
  } catch {
    return json({ ok: false }, 400);
  }

  // honeypot: бот заполнил скрытое поле — отвечаем «успехом», но не сохраняем
  if (typeof input.website === "string" && input.website.trim() !== "") {
    return json({ ok: true });
  }

  if (!limiter.check(clientIp(request))) {
    return json({ ok: false, error: t.landing.waitlist.errors.rate }, 429);
  }

  const result = validateWaitlist(input);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 422);

  const now = new Date().toISOString();
  await repository.add({
    id: randomUUID(),
    createdAt: now,
    ...result.data,
    consent: { accepted: true, text: CONSENT_TEXT, version: CONSENT_VERSION, at: now },
  });
  return json({ ok: true });
}
