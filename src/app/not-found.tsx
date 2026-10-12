import { Logo } from "@/components/brand";
import { ButtonLink } from "@/components/ui";
import { t } from "@/i18n";

/** 404 для всего сайта. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-6 px-5 py-10">
      <Logo variant="onLight" size={36} wordmarkSize={28} />
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-title font-extrabold tracking-display">
          {t.ui.notFoundTitle}
        </h1>
        <p className="text-lead text-text-2">{t.ui.notFoundText}</p>
      </div>
      <ButtonLink href="/" size="xl" fullWidth>
        {t.ui.toHome}
      </ButtonLink>
    </main>
  );
}
