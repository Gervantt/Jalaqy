"use client";

import { Button, EmptyState } from "@/components/ui";
import { IconAlert } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { MobileContent } from "./MobileShell";

/** Ошибка на мобильном экране: понятный текст, повтор, код для поддержки. */
export function MobileError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <MobileContent className="justify-center">
      <EmptyState
        icon={<IconAlert size={26} />}
        title={t.ui.errorTitle}
        headingLevel={2}
        action={
          <Button size="xl" onClick={() => retry()}>
            {t.ui.retry}
          </Button>
        }
      >
        {t.ui.errorText}
        {error.digest && (
          <span className="mt-2 block text-xs">
            {interpolate(t.ui.errorCode, { digest: error.digest })}
          </span>
        )}
      </EmptyState>
    </MobileContent>
  );
}
