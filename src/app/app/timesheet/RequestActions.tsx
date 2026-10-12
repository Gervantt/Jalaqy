"use client";

import { useState, useTransition } from "react";
import { Button, useToast } from "@/components/ui";
import { t } from "@/i18n";
import { decideAbsenceAction } from "./actions";

const ts = t.timesheet;

/** «Отклонить / Одобрить» для заявки на отпуск. */
export function RequestActions({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [choice, setChoice] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  function decide(decision: "approved" | "rejected") {
    setChoice(decision);
    setError(null);
    startTransition(async () => {
      const result = await decideAbsenceAction(id, decision);
      if (result.ok) {
        toast.show({
          title: decision === "approved" ? ts.approved : ts.rejected,
          tone: decision === "approved" ? "success" : "info",
        });
      } else {
        setError(result.fields ? Object.values(result.fields).join(" ") : result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="md"
          variant="secondary"
          className="flex-1"
          loading={pending && choice === "rejected"}
          disabled={pending}
          aria-label={`${ts.reject}: ${name}`}
          onClick={() => decide("rejected")}
        >
          {ts.reject}
        </Button>
        <Button
          size="md"
          variant="soft"
          className="flex-1"
          loading={pending && choice === "approved"}
          disabled={pending}
          aria-label={`${ts.approve}: ${name}`}
          onClick={() => decide("approved")}
        >
          {ts.approve}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
