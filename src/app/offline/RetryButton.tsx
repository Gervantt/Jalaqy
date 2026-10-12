"use client";

import { Button } from "@/components/ui";
import { t } from "@/i18n";

export function RetryButton() {
  return (
    <Button size="xl" fullWidth onClick={() => window.location.reload()}>
      {t.mobile.offline.retry}
    </Button>
  );
}
