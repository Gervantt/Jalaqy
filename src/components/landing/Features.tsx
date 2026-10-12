"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { productImages, type ProductImage } from "./images";
import { rovingKeyDown } from "./roving";

const f = t.landing.features;
const h2 =
  "m-0 font-display text-[clamp(34px,4.4vw,60px)] leading-[1.02] font-extrabold tracking-[-0.035em]";

export function Features() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tab = f.tabs[active]!;
  const img = productImages[tab.image as ProductImage];
  const phone = tab.image !== "payroll";

  return (
    <section
      id="features"
      className="mx-auto flex max-w-[1240px] scroll-mt-4 flex-col gap-10 px-6 pt-28 pb-24"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className={cn(h2, "max-w-[820px]")}>{f.title}</h2>
        <p className="m-0 max-w-[560px] text-lead text-muted">{f.text}</p>
      </div>
      <div
        role="tablist"
        aria-label={f.tabsLabel}
        className="flex flex-wrap justify-center gap-2.5"
        onKeyDown={(e) => rovingKeyDown(e, f.tabs.length, active, setActive)}
      >
        {f.tabs.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              id={`${id}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "min-h-12 cursor-pointer rounded-full border-[1.5px] px-[22px] text-base transition-colors",
                selected
                  ? "border-ink bg-ink font-bold text-cream"
                  : "border-sand-border bg-surface font-semibold text-ink is-hover:border-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${tab.id}`}
        tabIndex={0}
        className="overflow-hidden rounded-[32px] bg-mint p-[clamp(24px,4vw,56px)]"
      >
        <div key={tab.id} className="flex flex-wrap items-center gap-12 motion-safe:animate-in">
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px]">
            <h3 className="m-0 font-display text-[clamp(28px,3vw,40px)] leading-[1.06] font-extrabold tracking-[-0.03em]">
              {tab.title}
            </h3>
            <p className="m-0 text-lead text-text-2">{tab.text}</p>
            {"link" in tab && (
              <a href={tab.href} className="text-lead font-bold">
                {tab.link}
              </a>
            )}
          </div>
          {phone ? (
            <div className="flex flex-[1_1_360px] justify-center">
              <Image
                src={img.src}
                width={img.width}
                height={img.height}
                alt={tab.alt}
                sizes="280px"
                className="block h-auto w-[280px] rounded-[32px] shadow-[0_20px_50px_rgba(15,42,36,0.2)]"
              />
            </div>
          ) : (
            <Image
              src={img.src}
              width={img.width}
              height={img.height}
              alt={tab.alt}
              sizes="(max-width: 900px) 100vw, 640px"
              className="block h-auto w-full min-w-0 flex-[1.4_1_460px] rounded-card shadow-[0_20px_50px_rgba(15,42,36,0.18)]"
            />
          )}
        </div>
      </div>
    </section>
  );
}
