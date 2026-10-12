import Link from "next/link";
import { t } from "@/i18n";

const f = t.landing.footer;

export function LandingFooter() {
  return (
    <footer className="border-t border-sand-line text-sm text-muted">
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-8 px-6 pt-10 pb-14">
        <div className="flex flex-col gap-2">
          <span className="font-display text-[22px] font-extrabold tracking-logo text-ink">
            {t.brand.wordmark}
          </span>
          <span>{f.owner}</span>
          <span>{f.copyright}</span>
        </div>
        <div className="flex flex-wrap gap-12">
          <nav aria-labelledby="footer-contacts" className="flex flex-col gap-2">
            <span id="footer-contacts" className="font-semibold text-ink">
              {f.contacts}
            </span>
            <a href={`mailto:${f.email}`}>{f.email}</a>
            <a href="https://www.instagram.com/jalaqy" rel="noopener noreferrer">
              {f.social}
            </a>
            <a href="https://t.me/jalaqy" rel="noopener noreferrer">
              {f.telegram}
            </a>
          </nav>
          <nav aria-labelledby="footer-docs" className="flex flex-col gap-2">
            <span id="footer-docs" className="font-semibold text-ink">
              {f.docs}
            </span>
            <Link href="/privacy">{f.privacy}</Link>
            <Link href="/offer">{f.offer}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
