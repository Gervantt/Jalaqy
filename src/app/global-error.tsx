"use client";

import { t } from "@/i18n";
import "./globals.css";

/** Последний рубеж: упал корневой layout. Без шрифтов и провайдеров — только системное. */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ru">
      <body className="flex min-h-dvh items-center justify-center bg-paper p-5 font-sans">
        <main className="flex max-w-md flex-col gap-4">
          <h1 className="text-2xl font-bold">{t.ui.errorTitle}</h1>
          <p className="text-body text-muted">{t.ui.errorText}</p>
          <button
            type="button"
            onClick={() => retry()}
            className="h-12 rounded-button bg-primary px-5 font-bold text-white"
          >
            {t.ui.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
