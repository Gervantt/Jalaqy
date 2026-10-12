"use client";

import { useState } from "react";
import { MoneyInput } from "@/components/ui";
import { interpolate, t } from "@/i18n";
import { formatTenge } from "@/lib/format";
import { calculateEmployee, rates2026 } from "@/lib/payroll";

const c = t.landing.calc;
const PRESETS = [150_000, 320_000, 550_000, 1_000_000];
const minus = (n: number) => formatTenge(-n);

/** Калькулятор: та же формула, что и в сервисе (lib/payroll), один полный месяц. */
export function Calculator() {
  const [salary, setSalary] = useState<number | null>(320_000);
  const [deduction, setDeduction] = useState(true);
  const r = calculateEmployee({ gross: salary ?? 0, hasDeduction: deduction }, rates2026);

  const row = (label: string, value: string) => (
    <div className="flex justify-between gap-3 border-t border-sand-line py-2.5 text-body">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );

  return (
    <section id="calc" className="on-ink scroll-mt-4 bg-ink text-cream">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-14 px-6 py-[104px]">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[22px]">
          <p className="m-0 text-sm font-bold tracking-[0.08em] text-accent uppercase">
            {c.eyebrow}
          </p>
          <h2 className="m-0 font-display text-[clamp(34px,4.4vw,60px)] leading-[1.02] font-extrabold tracking-[-0.035em]">
            {c.title}
          </h2>
          <p className="m-0 max-w-[480px] text-lead text-on-ink-soft">{c.text}</p>
        </div>

        <div className="flex w-full max-w-[520px] min-w-0 flex-[1_1_440px] flex-col gap-[18px] rounded-[28px] bg-surface p-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.3)] [--focus:var(--primary)] sm:p-8">
          <MoneyInput label={c.salary} size="lg" value={salary} onValueChange={setSalary} />
          <div role="group" aria-label={c.presets} className="flex flex-wrap gap-2">
            {PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={salary === v}
                onClick={() => setSalary(v)}
                className="min-h-11 cursor-pointer rounded-full border border-sand-border bg-surface px-3.5 text-sm font-semibold text-ink aria-pressed:border-ink aria-pressed:bg-mint is-hover:border-ink"
              >
                {formatTenge(v)}
              </button>
            ))}
          </div>
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-body">
            <input
              type="checkbox"
              checked={deduction}
              onChange={(e) => setDeduction(e.target.checked)}
              className="size-[18px] accent-primary"
            />
            {c.deduction}
          </label>
          <div className="flex flex-col" aria-live="polite">
            {row(c.opv, minus(r.employee.opv))}
            {row(c.vosms, minus(r.employee.vosms))}
            {row(c.ipn, minus(r.employee.ipn))}
            <div className="flex items-baseline justify-between gap-3 border-t border-sand-line pt-3.5 pb-1">
              <span className="font-bold">{c.net}</span>
              <span className="font-display text-amount font-extrabold tracking-display tabular-nums">
                {formatTenge(r.net)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 rounded-card-lg bg-mint px-[18px] py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{c.employer}</span>
              <span className="font-display text-title-sm font-extrabold text-primary tabular-nums">
                {formatTenge(r.employer.total)}
              </span>
            </div>
            <div className="text-caption text-text-2 tabular-nums">
              {interpolate(c.breakdown, {
                opvr: formatTenge(r.employer.opvr),
                so: formatTenge(r.employer.so),
                oosms: formatTenge(r.employer.oosms),
                sn: formatTenge(r.employer.socialTax),
              })}
            </div>
            <div className="flex justify-between gap-3 border-t border-mint-line pt-2 text-body">
              <span>{c.total}</span>
              <b className="tabular-nums">{formatTenge(r.cost)}</b>
            </div>
          </div>
          <p className="m-0 text-[12.5px] leading-normal text-muted">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
