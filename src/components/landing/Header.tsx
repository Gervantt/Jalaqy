import { Logo } from "@/components/brand";
import { t } from "@/i18n";

const h = t.landing.header;

const link = "text-ink no-underline is-hover:text-primary";

export function LandingHeader() {
  return (
    <header className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-5">
      <a href="#top" aria-label={h.home} className="text-ink no-underline">
        <Logo variant="ink" size={32} wordmarkSize={25} />
      </a>
      <nav
        aria-label={h.nav}
        className="flex flex-wrap items-center gap-x-[26px] gap-y-2 text-body font-medium"
      >
        <a href="#features" className={link}>
          {h.features}
        </a>
        <a href="#how" className={link}>
          {h.how}
        </a>
        <a href="#price" className={link}>
          {h.price}
        </a>
        <a href="#faq" className={link}>
          {h.faq}
        </a>
        <a
          href="#waitlist"
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-semibold text-cream no-underline hover:text-cream is-hover:bg-ink-hover"
        >
          {h.cta}
        </a>
      </nav>
    </header>
  );
}
