"use client";

import { useId, useState } from "react";
import { t } from "@/i18n";
import { formatCount, formatTenge } from "@/lib/format";

const p = t.landing.price;

/** Цена: 5 000 ₸ за компанию + 1 000 ₸ за сотрудника. */
export const priceFor = (employees: number) => 5_000 + 1_000 * employees;

export function Pricing() {
  const [n, setN] = useState(15);
  const id = useId();
  const label = formatCount(n, t.plural.employees);
  return (
    <section
      id="price"
      className="mx-auto flex max-w-[1240px] scroll-mt-4 flex-wrap items-center gap-14 px-6 py-28"
    >
      <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-[18px]">
        <h2 className="m-0 font-display text-[clamp(34px,4.4vw,60px)] leading-[1.02] font-extrabold tracking-[-0.035em]">
          {p.title}
        </h2>
        <p className="m-0 max-w-[460px] text-lead text-muted">{p.text}</p>
      </div>
      <div className="flex w-full max-w-[540px] min-w-0 flex-[1_1_440px] flex-col gap-5 rounded-[28px] border border-sand-line bg-surface p-6 shadow-[0_20px_60px_rgba(15,42,36,0.08)] sm:p-8">
        <div className="flex flex-col gap-3.5 text-body font-semibold">
          <span className="flex justify-between gap-3">
            <label htmlFor={id}>{p.employees}</label>
            <output htmlFor={id} className="font-display text-xl font-extrabold">
              {label}
            </output>
          </span>
          <input
            id={id}
            type="range"
            min={1}
            max={50}
            value={n}
            aria-valuetext={label}
            onChange={(e) => setN(Number(e.target.value))}
            className="h-7 w-full cursor-pointer accent-primary"
          />
        </div>
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="font-display text-[clamp(48px,5vw,68px)] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
            {formatTenge(priceFor(n))}
          </span>
          <span className="text-muted">{p.perMonth}</span>
        </div>
        <p className="m-0 rounded-button-lg bg-mint px-4 py-3.5 text-body">
          {p.pilot}
          <b>{p.pilotBold}</b>.
        </p>
        <a
          href="#waitlist"
          className="flex min-h-[54px] items-center justify-center rounded-full bg-primary font-bold text-white no-underline hover:text-white is-hover:bg-primary-hover"
        >
          {p.cta}
        </a>
      </div>
    </section>
  );
}
