import Link from "next/link";
import { Logo } from "@/components/brand";
import { IconChevronLeft } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { formatDate } from "@/lib/format";
import { LandingFooter } from "@/components/landing/Footer";

const l = t.landing.legal;

/** Заглушка юридического документа: понятная структура разделов, текст даст юрист. */
export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <>
      <header className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="text-ink no-underline" aria-label={t.landing.header.home}>
          <Logo variant="ink" size={32} wordmarkSize={25} />
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1 font-semibold no-underline"
        >
          <IconChevronLeft size={18} />
          {l.back}
        </Link>
      </header>
      <main className="mx-auto flex max-w-[860px] flex-col gap-8 px-6 pt-8 pb-24">
        <div className="flex flex-col gap-3">
          <h1 className="m-0 font-display text-[clamp(32px,4vw,48px)] leading-tight font-extrabold tracking-[-0.03em]">
            {title}
          </h1>
          <p className="m-0 text-body text-muted">
            {interpolate(l.updated, { date: formatDate("2026-10-12") })}
          </p>
          <p className="m-0 rounded-button-lg bg-warning-bg px-4 py-3 text-body text-warning-text">
            {l.draft}
          </p>
        </div>
        <ol className="m-0 flex list-none flex-col gap-6 p-0">
          {sections.map(([heading, text], i) => (
            <li key={heading} className="flex flex-col gap-2">
              <h2 className="m-0 font-display text-xl font-bold">
                {i + 1}. {heading}
              </h2>
              <p className="m-0 text-lead text-text-2">{text}</p>
            </li>
          ))}
        </ol>
      </main>
      <LandingFooter />
    </>
  );
}
