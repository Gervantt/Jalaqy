"use client";

import { Button, EmptyState } from "@/components/ui";
import { IconAlert } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";

/** Ошибка загрузки раздела панели: понятный текст и повтор. */
export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <EmptyState
      icon={<IconAlert size={26} />}
      title={t.ui.errorTitle}
      action={<Button onClick={() => retry()}>{t.ui.retry}</Button>}
    >
      {t.ui.errorText}
      {error.digest && (
        <span className="mt-2 block text-xs">
          {interpolate(t.ui.errorCode, { digest: error.digest })}
        </span>
      )}
    </EmptyState>
  );
}
