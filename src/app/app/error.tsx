"use client";

import { Button, EmptyState } from "@/components/ui";
import { IconAlert } from "@/components/ui/icons";
import { t } from "@/i18n";

/** Ошибка загрузки раздела панели: понятный текст и повтор. */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      icon={<IconAlert size={26} />}
      title={t.app.errors.title}
      action={<Button onClick={reset}>{t.ui.retry}</Button>}
    >
      {t.app.errors.text}
      {error.digest && <span className="mt-2 block text-xs">#{error.digest}</span>}
    </EmptyState>
  );
}
