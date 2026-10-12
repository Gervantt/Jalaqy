"use client";

import { useTransition } from "react";
import { Button, useToast } from "@/components/ui";
import { IconCheck } from "@/components/ui/icons";
import { t } from "@/i18n";
import { markTaxPaidAction } from "./actions";

export function MarkPaidButton({ id, label }: { id: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  return (
    <Button
      size="md"
      variant="ghost"
      icon={<IconCheck size={18} />}
      loading={pending}
      aria-label={label}
      onClick={() =>
        startTransition(async () => {
          const r = await markTaxPaidAction(id);
          toast.show(r.ok ? { title: t.taxes.paidToast } : { title: r.error, tone: "error" });
        })
      }
    >
      {t.taxes.markPaid}
    </Button>
  );
}
