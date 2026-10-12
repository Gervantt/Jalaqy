"use client";

import { useTransition } from "react";
import { Button, Card, useToast } from "@/components/ui";
import { t } from "@/i18n";
import { resetDemoAction } from "./actions";

const d = t.settings.demo;

export function ResetDemo() {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  return (
    <Card
      as="section"
      aria-labelledby="set-demo"
      padding="lg"
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex max-w-xl flex-col gap-1">
        <h2 id="set-demo" className="font-display text-xl font-bold tracking-display">
          {d.title}
        </h2>
        <p className="text-body text-muted">{d.text}</p>
      </div>
      <Button
        variant="secondary"
        loading={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await resetDemoAction();
            if (r.ok) toast.show({ title: d.done });
          })
        }
      >
        {d.reset}
      </Button>
    </Card>
  );
}
