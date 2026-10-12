"use client";

import { useActionState, useState } from "react";
import { Button, Card, DatePicker, Input, useToast } from "@/components/ui";
import { interpolate, t } from "@/i18n";
import { formatCount } from "@/lib/format";
import { submitWith } from "@/lib/form-submit";
import { requestLeaveAction, type MeFormState } from "../actions";

const l = t.mobile.leave;

const daysBetween = (from: string, to: string) =>
  from && to && to >= from ? Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1 : 0;

export function LeaveForm({ minDate }: { minDate: string }) {
  const toast = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [state, action, pending] = useActionState<MeFormState, FormData>(async (prev, form) => {
    const r = await requestLeaveAction(prev, form);
    if (r?.ok) {
      toast.show({ title: l.sent });
      setFrom("");
      setTo("");
    }
    return r;
  }, null);
  const errors = state && !state.ok ? (state.fields ?? {}) : {};
  const days = daysBetween(from, to);

  return (
    <Card as="section" aria-labelledby="leave-form" padding="md" className="flex flex-col gap-4">
      <h2 id="leave-form" className="text-base font-semibold">
        {l.request}
      </h2>
      <form
        action={action}
        onSubmit={submitWith(action)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <DatePicker
            name="from"
            label={l.from}
            min={minDate}
            value={from}
            onValueChange={setFrom}
            required
            error={errors.from}
          />
          <DatePicker
            name="to"
            label={l.to}
            min={from || minDate}
            value={to}
            onValueChange={setTo}
            required
            error={errors.to}
          />
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {days > 0 && interpolate(l.days, { days: formatCount(days, t.plural.days) })}
        </p>
        <Input name="comment" label={l.comment} />
        <Button type="submit" size="xl" fullWidth loading={pending}>
          {l.send}
        </Button>
      </form>
    </Card>
  );
}
