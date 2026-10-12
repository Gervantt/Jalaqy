import Image from "next/image";
import { IconCheck } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { formatTenge } from "@/lib/format";
import { productImages } from "./images";

const h = t.landing.hero;
const f = h.float;

/** Цифры карточек — из той же компании дизайна, что и панель. */
export interface HeroNumbers {
  net: number;
  toBudget: number;
  daniyarExtra: number;
}

const floatShadow = "shadow-[0_16px_40px_rgba(15,42,36,0.18)]";

export function Hero({ numbers }: { numbers: HeroNumbers }) {
  const img = productImages.payroll;
  return (
    <section id="top" className="relative px-6 pt-14">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 520"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 block h-[520px] w-full"
      >
        <path
          d="M0 210 C 240 120, 420 300, 720 210 S 1200 90, 1440 190 L1440 520 L0 520 Z"
          fill="var(--mint)"
        />
        <path
          d="M0 330 C 300 250, 520 400, 820 320 S 1260 240, 1440 300 L1440 520 L0 520 Z"
          fill="var(--primary)"
        />
        <path
          d="M0 430 C 280 380, 560 470, 880 420 S 1280 380, 1440 410 L1440 520 L0 520 Z"
          fill="var(--ink)"
        />
      </svg>

      <div className="relative mx-auto flex max-w-[940px] flex-col items-center gap-6 text-center">
        <p className="m-0 inline-flex items-center gap-2 rounded-full border border-sand-soft bg-surface px-3.5 py-1.5 text-sm font-semibold text-primary">
          <IconCheck size={16} strokeWidth={2.4} />
          {h.badge}
        </p>
        <h1 className="m-0 font-display text-[clamp(44px,6.6vw,92px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
          {h.title}
        </h1>
        <p className="m-0 max-w-[640px] text-[clamp(17px,1.6vw,21px)] leading-normal text-text-2">
          {h.text}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#waitlist"
            className="inline-flex min-h-14 items-center rounded-full bg-primary px-[30px] text-lead font-bold text-white no-underline hover:text-white is-hover:bg-primary-hover"
          >
            {h.primary}
          </a>
          <a
            href="#calc"
            className="inline-flex min-h-14 items-center rounded-full border-[1.5px] border-ink bg-surface px-7 text-lead font-bold text-ink no-underline is-hover:bg-mint"
          >
            {h.secondary}
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1100px] pb-[72px]">
        <Image
          src={img.src}
          width={img.width}
          height={img.height}
          alt={h.imageAlt}
          priority
          sizes="(max-width: 1148px) 100vw, 1100px"
          className="relative block h-auto w-full rounded-card-lg border border-border shadow-[0_30px_80px_rgba(15,42,36,0.25)]"
        />

        {/* Плавающие карточки — декоративные, скрыты на узких экранах (как в дизайне) */}
        <div aria-hidden="true" className="max-[820px]:hidden">
          <div
            className={`absolute top-[18%] -left-9 flex w-[250px] items-center gap-3 rounded-card-lg bg-surface px-[18px] py-4 motion-safe:animate-float ${floatShadow}`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-button bg-mint text-primary">
              <IconCheck size={20} strokeWidth={2.4} />
            </span>
            <span className="flex flex-col text-left">
              <b className="text-body">{f.approved}</b>
              <span className="text-caption text-muted">
                {interpolate(f.approvedSub, { amount: formatTenge(numbers.net) })}
              </span>
            </span>
          </div>

          <div className="absolute top-[8%] -right-10 flex w-[236px] flex-col gap-1 rounded-card-lg bg-ink px-[18px] py-4 text-left text-cream shadow-[0_16px_40px_rgba(15,42,36,0.25)] motion-safe:animate-float-2">
            <span className="text-caption text-on-ink-muted">{f.extraTitle}</span>
            <b className="font-display text-2xl text-accent">{formatTenge(numbers.daniyarExtra)}</b>
            <span className="text-caption text-on-ink-muted">{f.extraSub}</span>
          </div>

          <div
            className={`absolute right-[6%] bottom-5 flex w-[260px] flex-col gap-2.5 rounded-card-lg bg-surface px-[18px] py-4 text-left motion-safe:animate-float-3 ${floatShadow}`}
          >
            <span className="flex items-center justify-between">
              <b className="text-body">{f.leaveTitle}</b>
              <span className="rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-bold text-warning-icon">
                {f.leaveNew}
              </span>
            </span>
            <span className="text-caption text-muted">{f.leaveDates}</span>
            <span className="flex gap-2">
              <span className="flex-1 rounded-nav bg-primary py-2 text-center text-caption font-bold text-white">
                {f.leaveApprove}
              </span>
              <span className="flex-1 rounded-nav border border-border py-2 text-center text-caption font-semibold">
                {f.leaveLater}
              </span>
            </span>
          </div>

          <div className="absolute bottom-2 left-[4%] flex w-[230px] flex-col gap-0.5 rounded-card-lg bg-accent px-[18px] py-3.5 text-left text-ink shadow-[0_16px_40px_rgba(15,42,36,0.2)] motion-safe:animate-float-2">
            <b className="text-body">{f.taxesTitle}</b>
            <span className="text-caption">
              {interpolate(f.taxesSub, { amount: formatTenge(numbers.toBudget) })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
