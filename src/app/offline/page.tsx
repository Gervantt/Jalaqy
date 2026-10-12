import type { Metadata } from "next";
import { Logo } from "@/components/brand";
import { t } from "@/i18n";
import { RetryButton } from "./RetryButton";

export const metadata: Metadata = { title: t.mobile.offline.title, robots: { index: false } };

/** Офлайн-экран: его отдаёт service worker, когда нет сети. Статичный, без данных. */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-6 px-5 py-10">
      <Logo variant="onLight" size={36} wordmarkSize={28} />
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-title font-extrabold tracking-display">
          {t.mobile.offline.title}
        </h1>
        <p className="text-lead text-text-2">{t.mobile.offline.text}</p>
      </div>
      <RetryButton />
    </main>
  );
}
