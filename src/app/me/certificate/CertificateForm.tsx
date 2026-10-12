"use client";

import { useActionState, useState } from "react";
import { Button, Card, Input, RadioGroup, useToast } from "@/components/ui";
import { t } from "@/i18n";
import { submitWith } from "@/lib/form-submit";
import { requestCertificateAction, type MeFormState } from "../actions";

const c = t.mobile.certificate;

export function CertificateForm() {
  const toast = useToast();
  const [formKey, setFormKey] = useState(0);
  const [state, action, pending] = useActionState<MeFormState, FormData>(async (prev, form) => {
    const r = await requestCertificateAction(prev, form);
    if (r?.ok) {
      toast.show({ title: c.sent });
      setFormKey((k) => k + 1);
    }
    return r;
  }, null);
  const errors = state && !state.ok ? (state.fields ?? {}) : {};
  return (
    <Card padding="md">
      <form
        key={formKey}
        action={action}
        onSubmit={submitWith(action)}
        noValidate
        className="flex flex-col gap-4"
      >
        <RadioGroup
          legend={c.kind}
          name="kind"
          defaultValue="employment"
          options={(["employment", "income"] as const).map((k) => ({
            value: k,
            label: c.kinds[k],
          }))}
        />
        <Input
          name="purpose"
          label={c.purpose}
          placeholder={c.purposePlaceholder}
          required
          error={errors.purpose}
        />
        <Button type="submit" size="xl" fullWidth loading={pending}>
          {c.send}
        </Button>
      </form>
    </Card>
  );
}
