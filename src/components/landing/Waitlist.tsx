"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Button, Checkbox, Input, RadioGroup } from "@/components/ui";
import { IconCheck } from "@/components/ui/icons";
import { t } from "@/i18n";
import { UTM_KEYS, validateWaitlist, type WaitlistErrors } from "@/lib/waitlist/schema";

const w = t.landing.waitlist;

type Status = "idle" | "sending" | "done";

/** Форма листа ожидания → POST /api/waitlist (наш сервер, без сторонних сервисов). */
export function Waitlist() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      employees: String(form.get("employees") ?? ""),
      role: String(form.get("role") ?? ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
      utm: Object.fromEntries(
        UTM_KEYS.flatMap((k) => (params.get(k) ? [[k, params.get(k)!]] : [])),
      ),
      referrer: document.referrer || undefined,
    };
    const local = validateWaitlist(payload);
    setFormError(null);
    if (!local.ok) {
      setErrors(local.errors);
      // фокус на первое поле с ошибкой
      const first = Object.keys(local.errors)[0];
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        errors?: WaitlistErrors;
        error?: string;
      };
      if (res.ok) {
        setStatus("done");
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      setStatus("idle");
      if (body.errors) setErrors(body.errors);
      else setFormError(body.error ?? w.errors.server);
    } catch {
      setStatus("idle");
      setFormError(w.errors.server);
    }
  }

  return (
    <section id="waitlist" className="scroll-mt-4 px-6 pb-28">
      <div className="on-ink relative mx-auto flex max-w-[1240px] flex-wrap items-center gap-12 overflow-hidden rounded-[36px] bg-ink p-[clamp(24px,5vw,72px)] text-cream">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="absolute -top-[120px] -right-[120px] size-[200px] sm:size-[420px]"
        >
          <circle cx="200" cy="200" r="200" fill="var(--primary)" />
          <circle cx="200" cy="200" r="120" fill="var(--accent)" fillOpacity="0.9" />
        </svg>
        <div className="relative flex min-w-0 flex-[1_1_380px] flex-col gap-[18px]">
          <h2 className="m-0 font-display text-[clamp(34px,4.4vw,60px)] leading-[1.02] font-extrabold tracking-[-0.035em]">
            {w.title}
          </h2>
          <p className="m-0 max-w-[440px] text-lead text-on-ink-soft">{w.text}</p>
        </div>

        <div className="relative flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 rounded-[26px] bg-surface p-5 text-ink [--focus:var(--primary)] sm:p-7">
          {status === "done" ? (
            <div
              ref={doneRef}
              tabIndex={-1}
              role="status"
              className="flex flex-col items-start gap-3 py-6 outline-none"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-mint text-primary">
                <IconCheck size={28} strokeWidth={2.6} />
              </span>
              <h3 className="m-0 font-display text-title font-extrabold tracking-display">
                {w.successTitle}
              </h3>
              <p className="m-0 text-lead text-text-2">{w.successText}</p>
              <Button variant="ghost" size="md" onClick={() => setStatus("idle")}>
                {w.again}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-3.5 [--surface:var(--cream)]"
            >
              <Input name="name" label={w.name} autoComplete="name" required error={errors.name} />
              <Input
                name="contact"
                label={w.contact}
                placeholder={w.contactPlaceholder}
                autoComplete="tel"
                required
                error={errors.contact}
              />
              <div className="flex flex-wrap gap-3">
                <Input
                  name="employees"
                  label={w.employees}
                  inputMode="numeric"
                  required
                  error={errors.employees}

                  fieldClassName="flex-[1_1_140px]"
                />
                <RadioGroup
                  legend={w.role}
                  name="role"
                  defaultValue="owner"
                  orientation="horizontal"
                  required
                  error={errors.role}
                  className="flex-[1_1_180px]"
                  options={[
                    { value: "owner", label: w.owner },
                    { value: "accountant", label: w.accountant },
                  ]}
                />
              </div>
              {/* honeypot: скрыт от людей и скринридеров, боты заполняют */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  {w.honeypot}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <Checkbox
                name="consent"
                required
                error={errors.consent}
                label={
                  <span className="text-[13.5px] leading-[1.45] text-text-2">
                    {w.consentBefore}
                    <Link href="/privacy" target="_blank">
                      {w.consentLink}
                    </Link>
                  </span>
                }
              />
              {formError && (
                <p role="alert" className="m-0 text-body text-danger">
                  {formError}
                </p>
              )}
              <Button type="submit" size="xl" fullWidth loading={status === "sending"}>
                {w.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
