import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { createRateLimiter } = await import("./rate-limit");
const { createJsonFileRepository } = await import("./repository");
const { detectSource, validateWaitlist } = await import("./schema");

const valid = {
  name: "Асель",
  contact: "8 701 123 45 14",
  employees: "12",
  role: "owner",
  consent: true,
  utm: { utm_source: "instagram", utm_campaign: "pilot", evil: "x" } as Record<string, string>,
};

describe("validateWaitlist", () => {
  it("нормализует контакт, число и UTM", () => {
    const r = validateWaitlist(valid);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.contact).toEqual({ kind: "phone", value: "+77011234514" });
    expect(r.data.employees).toBe(12);
    expect(r.data.utm).toEqual({ utm_source: "instagram", utm_campaign: "pilot" });
    expect(r.data.source).toBe("instagram");
  });

  it("Telegram-ник тоже подходит", () => {
    const r = validateWaitlist({ ...valid, contact: "@tulpan_coffee" });
    expect(r.ok && r.data.contact).toEqual({ kind: "telegram", value: "@tulpan_coffee" });
  });

  it("ошибки по полям, согласие обязательно", () => {
    const r = validateWaitlist({
      name: "А",
      contact: "привет",
      employees: "0",
      role: "boss",
      consent: false,
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual([
      "consent",
      "contact",
      "employees",
      "name",
      "role",
    ]);
  });

  it("источник по referrer", () => {
    expect(detectSource({}, "https://l.threads.net/")).toBe("threads");
    expect(detectSource({}, "https://t.me/jalaqy")).toBe("telegram");
    expect(detectSource({}, undefined)).toBe("direct");
  });
});

describe("rate limiter", () => {
  it("скользящее окно", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("ip", 0)).toBe(true);
    expect(rl.check("ip", 10)).toBe(true);
    expect(rl.check("ip", 20)).toBe(false);
    expect(rl.check("other", 20)).toBe(true);
    expect(rl.check("ip", 1015)).toBe(true);
  });
});

describe("JSON-репозиторий", () => {
  it("параллельные записи не теряются", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "jalaqy-"));
    const repo = createJsonFileRepository(path.join(dir, "waitlist.json"));
    const entry = (i: number) =>
      ({
        id: String(i),
        createdAt: "2026-10-12T00:00:00Z",
        name: `N${i}`,
        contact: { kind: "phone", value: "+77011234514" },
        employees: 5,
        role: "owner",
        consent: { accepted: true, text: "t", version: "v", at: "2026-10-12T00:00:00Z" },
        utm: {},
        source: "direct",
      }) as const;
    await Promise.all(Array.from({ length: 20 }, (_, i) => repo.add(entry(i))));
    expect(await repo.list()).toHaveLength(20);
    const raw = JSON.parse(await readFile(path.join(dir, "waitlist.json"), "utf8"));
    expect(raw[0].consent.accepted).toBe(true);
  });
});
