"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { t } from "@/i18n";
import { approvePayrollAction } from "./actions";

const o = t.mobile.owner;

/** «Подтвердить выплату»: одна кнопка, без лишних вопросов — итог уже на экране. */
export function ApproveButton({ period }: { period: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      {error && (
        <p role="alert" className="text-center text-body text-danger">
          {error}
        </p>
      )}
      <Button
        size="xl"
        fullWidth
        loading={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await approvePayrollAction(period);
            if (result && !result.ok) setError(result.error || o.approveFailed);
          })
        }
      >
        {o.approve}
      </Button>
    </>
  );
}
