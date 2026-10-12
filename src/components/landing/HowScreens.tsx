import Image from "next/image";
import { interpolate, t } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatTenge } from "@/lib/format";
import { productImages } from "./images";

const s = t.landing.how.screens;
const card =
  "w-full max-w-[420px] rounded-3xl bg-surface p-6 flex flex-col shadow-[0_20px_50px_rgba(15,42,36,0.15)]";
const pill = (tone: string) =>
  cn(
    "rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
    tone === "ok" ? "bg-mint text-success-text" : "bg-warning-bg text-warning-icon",
  );

/** Мини-экраны шагов месяца — декоративные копии интерфейса (как в дизайне). */
export function HowScreen({ step, net, taxes }: { step: number; net: number; taxes: number }) {
  if (step === 0)
    return (
      <div className={cn(card, "gap-3.5")}>
        <b className="font-display text-xl">{s.invite}</b>
        <div className="flex gap-2">
          <span className="flex h-12 flex-1 items-center rounded-button border border-sand-border px-3.5 text-body text-muted">
            {s.phone}
          </span>
          <span className="flex h-12 items-center rounded-button bg-primary px-4 text-sm font-bold text-white">
            {s.whatsapp}
          </span>
        </div>
        <div className="flex flex-col">
          {s.invited.map(([who, status, tone]) => (
            <div
              key={who}
              className="flex items-center justify-between gap-2 border-t border-sand-line py-2.5 text-body"
            >
              <span>{who}</span>
              <span className={pill(tone)}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  if (step === 1)
    return (
      <div className={cn(card, "gap-3")}>
        <b className="font-display text-xl">{s.exceptions}</b>
        <span className="text-sm text-muted">{s.exceptionsSub}</span>
        {s.exceptionRows.map(([who, what, tone]) => (
          <div
            key={who}
            className="flex items-center justify-between gap-2 rounded-button-lg bg-cream px-3.5 py-3 text-body"
          >
            <span>{who}</span>
            <span className={pill(tone)}>{what}</span>
          </div>
        ))}
        <span className="flex h-11 items-center justify-center rounded-button border-[1.5px] border-dashed border-sand-dashed text-sm font-semibold text-muted">
          {s.exceptionAdd}
        </span>
      </div>
    );
  if (step === 2)
    return (
      <div className="flex w-full max-w-[360px] flex-col gap-3.5 rounded-[28px] bg-ink p-7 text-cream shadow-[0_20px_50px_rgba(15,42,36,0.25)]">
        <span className="text-sm font-semibold text-accent">{s.ready}</span>
        <b className="font-display text-[38px] leading-tight tracking-display tabular-nums">
          {formatTenge(net)}
        </b>
        <span className="text-sm text-on-ink-soft">
          {interpolate(s.readySub, { taxes: formatTenge(taxes) })}
        </span>
        <span className="flex h-[54px] items-center justify-center rounded-full bg-accent text-lead font-extrabold text-ink">
          {s.approve}
        </span>
      </div>
    );
  if (step === 3)
    return (
      <div className={cn(card, "gap-3")}>
        <b className="font-display text-xl">{s.payTitle}</b>
        {s.payRows.map(([title, sub, action]) => (
          <div
            key={title}
            className="flex items-center justify-between gap-3 rounded-button-lg bg-cream p-3.5"
          >
            <span className="flex flex-col">
              <b className="text-body">{title}</b>
              <span className="text-caption text-muted">
                {interpolate(sub, { net: formatTenge(net), taxes: formatTenge(taxes) })}
              </span>
            </span>
            <span className="text-caption font-bold text-primary">{action}</span>
          </div>
        ))}
        <span className="text-caption text-muted">{s.payNote}</span>
      </div>
    );
  const img = productImages.payslip;
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        alt={s.slipAlt}
        sizes="200px"
        className="block h-auto w-[200px] rounded-[26px] shadow-[0_20px_50px_rgba(15,42,36,0.2)]"
      />
      <div className="flex w-[200px] flex-col gap-2 rounded-[20px] bg-surface p-[18px] shadow-[0_20px_50px_rgba(15,42,36,0.12)]">
        <b className="text-body">{s.formTitle}</b>
        <span className="text-caption text-muted">{s.formSub}</span>
        <span className="text-caption font-bold text-primary">{s.formSend}</span>
      </div>
    </div>
  );
}
