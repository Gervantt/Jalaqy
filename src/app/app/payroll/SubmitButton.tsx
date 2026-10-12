"use client";

import { useState, useTransition } from "react";
import { Button, Modal, useToast } from "@/components/ui";
import { interpolate, t } from "@/i18n";
import { submitPayrollAction } from "./actions";

const p = t.app.payroll;

export interface SubmitButtonProps {
  period: string;
  net: string;
  budget: string;
  /** Уже отправлен или ещё не готов */
  state: "ready" | "submitted" | "unavailable";
}

/** «Отправить на подтверждение» → подтверждение в модалке → Server Action → тост. */
export function SubmitButton({ period, net, budget, state }: SubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  if (state !== "ready") {
    return (
      <Button
        disabled={state === "unavailable"}
        aria-disabled="true"
        variant={state === "submitted" ? "soft" : "primary"}
      >
        {state === "submitted" ? p.submitted : p.submit}
      </Button>
    );
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await submitPayrollAction(period);
      if (result.ok) {
        setOpen(false);
        toast.show({ title: p.toastSubmitted, description: p.toastSubmittedText });
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{p.submit}</Button>
      <Modal
        open={open}
        onClose={() => !pending && setOpen(false)}
        title={p.confirm.title}
        description={interpolate(p.confirm.text, { net, budget })}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
              {p.confirm.cancel}
            </Button>
            <Button onClick={confirm} loading={pending}>
              {p.confirm.ok}
            </Button>
          </>
        }
      >
        {error && (
          <p role="alert" className="text-body text-danger">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}
