import { IconPlus } from "@/components/ui/icons";
import { t } from "@/i18n";

const l = t.landing;

/** Золотой блок с цифрами. */
export function Stats() {
  return (
    <section className="px-6">
      <ul className="m-0 mx-auto grid max-w-[1240px] list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 rounded-[32px] bg-accent p-[clamp(32px,5vw,64px)]">
        {l.stats.map(([big, text]) => (
          <li key={big} className="flex flex-col gap-1.5">
            <span className="font-display text-[56px] leading-none font-extrabold tracking-[-0.04em]">
              {big}
            </span>
            <span className="text-base">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** «Начать — это три шага». */
export function StartSteps() {
  return (
    <section className="px-6">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-9 rounded-[32px] bg-mint p-[clamp(32px,5vw,64px)]">
        <h2 className="m-0 font-display text-[clamp(30px,3.6vw,48px)] leading-[1.04] font-extrabold tracking-[-0.03em]">
          {l.start.title}
        </h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
          {l.start.steps.map(([title, text], i) => (
            <li
              key={title}
              className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-[26px] transition-[transform,box-shadow] duration-200 hover:shadow-[0_18px_40px_rgba(15,42,36,0.12)] motion-safe:hover:-translate-y-1"
            >
              <span className="font-display text-[40px] leading-none font-extrabold text-primary">
                {i + 1}
              </span>
              <b className="text-[19px]">{title}</b>
              <span className="text-base text-muted">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** FAQ на нативных <details>: доступно без JS, плюсик поворачивается. */
export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto flex max-w-[900px] scroll-mt-4 flex-col gap-7 px-6 pt-28 pb-24"
    >
      <h2 className="m-0 text-center font-display text-[clamp(32px,4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.03em]">
        {l.faq.title}
      </h2>
      <div className="flex flex-col gap-3">
        {l.faq.items.map(([q, a]) => (
          <details
            key={q}
            className="group rounded-[20px] border border-sand-line bg-surface px-6 py-1"
          >
            <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 font-display text-[19px] font-bold [&::-webkit-details-marker]:hidden">
              {q}
              <span
                aria-hidden="true"
                className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-mint text-primary transition-transform duration-200 group-open:rotate-45"
              >
                <IconPlus size={18} strokeWidth={2.4} />
              </span>
            </summary>
            <p className="m-0 mb-[22px] text-lead text-text-2">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
