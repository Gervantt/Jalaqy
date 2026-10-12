import Link from "next/link";
import { Logo } from "@/components/brand";
import { t } from "@/i18n";

/** Временная главная. Лендинг по design/Landing.dc.html — в фазе 6. */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-4">
      <h1 className="sr-only">{t.home.title}</h1>
      <Logo variant="onLight" size={48} wordmarkSize={42} />
      <p className="text-lead text-text-2">{t.brand.tagline}</p>
      <p className="text-body text-muted">{t.home.soon}</p>
      <Link href="/styleguide" className="text-body font-semibold">
        {t.home.styleguideLink}
      </Link>
    </main>
  );
}
