"use client";

import { useId, useState } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { HowScreen } from "./HowScreens";
import { rovingKeyDown } from "./roving";

const h = t.landing.how;

export function How({ net, taxes }: { net: number; taxes: number }) {
  const [step, setStep] = useState(0);
  const id = useId();
  return (
    <section
      id="how"
      className="mx-auto flex max-w-[1240px] scroll-mt-4 flex-col gap-10 px-6 py-28"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="m-0 max-w-[860px] font-display text-[clamp(34px,4.4vw,60px)] leading-[1.02] font-extrabold tracking-[-0.035em]">
          {h.title}
        </h2>
        <p className="m-0 max-w-[560px] text-lead text-muted">{h.text}</p>
      </div>
      <div className="flex flex-wrap items-stretch gap-8">
        <div
          role="tablist"
          aria-label={h.stepsLabel}
          aria-orientation="vertical"
          className="flex min-w-0 flex-[1_1_360px] flex-col gap-2"
          onKeyDown={(e) => rovingKeyDown(e, h.steps.length, step, setStep, "vertical")}
        >
          {h.steps.map((s, i) => {
            const active = i === step;
            return (
              <button
                key={s.title}
                id={`${id}-step-${i}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${id}-screen`}
                tabIndex={active ? 0 : -1}
                onClick={() => setStep(i)}
                className={cn(
                  "flex w-full cursor-pointer gap-4 rounded-[20px] border-[1.5px] px-5 text-left transition-colors",
                  active
                    ? "items-start border-ink bg-ink py-[18px] text-cream"
                    : "items-center border-sand-line bg-surface py-4 text-ink is-hover:border-ink",
                )}
              >
                <span
                  className={cn(
                    "flex size-[34px] shrink-0 items-center justify-center rounded-full font-display font-extrabold",
                    active ? "bg-accent text-ink" : "bg-sand",
                  )}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <b className={active ? "text-lg" : "text-lead"}>{s.title}</b>
                  <span
                    className={active ? "text-body text-on-ink-soft" : "text-caption text-muted"}
                  >
                    {active ? s.text : s.who}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          id={`${id}-screen`}
          role="tabpanel"
          aria-labelledby={`${id}-step-${step}`}
          className="flex min-h-[420px] min-w-0 flex-[1.2_1_440px] items-center justify-center rounded-[32px] bg-mint p-[clamp(24px,4vw,48px)]"
        >
          <div key={step} className="flex w-full justify-center motion-safe:animate-in">
            <HowScreen step={step} net={net} taxes={taxes} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sand-line bg-surface px-7 py-[22px]">
        <span className="flex flex-col gap-0.5">
          <b className="text-lead">{h.accountant}</b>
          <span className="text-body text-muted">{h.accountantText}</span>
        </span>
        <a
          href="#waitlist"
          className="inline-flex min-h-[46px] items-center rounded-full border-[1.5px] border-ink px-5 font-bold text-ink no-underline is-hover:bg-mint"
        >
          {h.accountantCta}
        </a>
      </div>
    </section>
  );
}
